import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { UserProfile } from '@/api/entities';
import { Analysis } from '@/api/entities';
import { Article } from '@/api/entities'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, AlertCircle, BarChart3, Plus, Edit, Shield, CreditCard, Trash2 } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { createPageUrl } from '@/utils';
import { adminUpdateUser } from '@/api/functions';
import { adminDeleteUserProfile } from '@/api/functions';
import { format, startOfDay, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    profilesCompleted: 0,
    totalAnalyses: 0,
    failedAnalyses: 0,
  });
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [recentFailedAnalyses, setRecentFailedAnalyses] = useState([]);
  const [duplicateArticles, setDuplicateArticles] = useState([]);
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [updateCooldown, setUpdateCooldown] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState('month');
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [allUsersData, allProfilesData, allAnalysesData] = await Promise.all([
        User.list(),
        UserProfile.list(),
        Analysis.list()
      ]);
        
      setUsers(allUsersData);
      setAllAnalyses(allAnalysesData);

      const profileMap = allProfilesData.reduce((acc, profile) => {
        acc[profile.created_by] = profile;
        return acc;
      }, {});
      setProfiles(profileMap);

      const failed = allAnalysesData.filter(a => a.status === 'failed');
      setRecentFailedAnalyses(failed.slice(0, 5));

      setStats({
        totalUsers: allUsersData.length,
        premiumUsers: allProfilesData.filter(p => p.subscription_status === 'premium').length,
        profilesCompleted: allProfilesData.length,
        totalAnalyses: allAnalysesData.length,
        failedAnalyses: failed.length
      });

    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUser = (userToEdit) => {
    if (isUpdating || updateCooldown || operationInProgress) {
      toast({
        title: "Operation In Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive"
      });
      return;
    }

    const userProfile = profiles[userToEdit.email];
    setSelectedUser(userToEdit);
    setEditFormData({
      role: userToEdit.role || 'user',
      status: userToEdit.status || 'active',
      subscription_status: userProfile?.subscription_status || 'free',
      credits_remaining: userProfile?.credits_remaining || 0,
      user_type: userProfile?.user_type || 'professional',
      onboarded: userProfile?.onboarded || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || isUpdating || updateCooldown || operationInProgress) {
      toast({
        title: "Operation In Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive"
      });
      return;
    }
    
    const now = Date.now();
    if (now - lastUpdateTime < 15000) {
      const remainingTime = Math.ceil((15000 - (now - lastUpdateTime)) / 1000);
      toast({
        title: "Rate Limit Protection",
        description: `Please wait ${remainingTime} more seconds before making another update.`,
        variant: "destructive"
      });
      return;
    }

    setLastUpdateTime(now);
    setIsUpdating(true);
    setUpdateCooldown(true);
    setOperationInProgress(true);

    const cooldownTimer = setTimeout(() => {
      setUpdateCooldown(false);
      setOperationInProgress(false);
    }, 15000);

    try {
      console.log("Attempting to update user:", selectedUser.email, "with data:", editFormData);
      
      const response = await adminUpdateUser({
        targetUserId: selectedUser.id,
        targetUserEmail: selectedUser.email,
        ...editFormData
      });

      console.log("Update response:", response);
      const responseData = response.data;

      if (responseData && responseData.success) {
          let toastDescription = (responseData.userUpdateMessage || '') + ' ' + (responseData.profileMessage || '');
          toast({
            title: "User Update Processed",
            description: toastDescription.trim(),
            duration: 8000
          });
        
        clearTimeout(cooldownTimer);
        setUpdateCooldown(false);
        setOperationInProgress(false);
        
        setTimeout(async () => {
          await fetchData();
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }, 3000);
      } else {
        throw new Error(response?.data?.error || 'Update failed - no success confirmation');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      
      let errorMessage = "Failed to update user. Please try again.";
      let errorTitle = "Update Failed";
      
      if (error.response?.status === 429 || error.message?.includes('Rate limit') || error.response?.data?.error?.includes('Rate limit')) {
        errorTitle = "Rate Limit Exceeded";
        errorMessage = "Too many requests. Please wait 1 minute before trying again.";
        
        clearTimeout(cooldownTimer);
        setTimeout(() => {
          setUpdateCooldown(false);
          setOperationInProgress(false);
        }, 60000);
        
      } else if (error.response?.status === 500) {
        errorTitle = "Server Error";
        errorMessage = "Server error occurred. Please try again in a few moments.";
      } else if (error.response?.status === 403) {
        errorTitle = "Permission Denied";
        errorMessage = "You don't have permission to perform this action.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = (userToDel) => {
    if (isUpdating || updateCooldown || operationInProgress) {
      toast({
        title: "Operation In Progress",
        description: "Another operation is in progress. Please wait.",
        variant: "destructive"
      });
      return;
    }
    setUserToDelete(userToDel);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete || isUpdating || updateCooldown || operationInProgress) {
      toast({
        title: "Operation In Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive"
      });
      return;
    }
    
    const now = Date.now();
    if (now - lastUpdateTime < 15000) {
      const remainingTime = Math.ceil((15000 - (now - lastUpdateTime)) / 1000);
      toast({
        title: "Rate Limit Protection",
        description: `Please wait ${remainingTime} more seconds before making another action.`,
        variant: "destructive"
      });
      return;
    }
    
    setLastUpdateTime(now);
    setIsUpdating(true);
    setUpdateCooldown(true);
    setOperationInProgress(true);

    const cooldownTimer = setTimeout(() => {
      setUpdateCooldown(false);
      setOperationInProgress(false);
    }, 15000);
    
    try {
      console.log("Attempting to delete user profile:", userToDelete.email);
      
      const response = await adminDeleteUserProfile({ targetUserEmail: userToDelete.email });
      
      console.log("Delete response:", response);
      
      if (response && response.data && response.data.success) {
        toast({
          title: "User Deactivated Successfully",
          description: `Profile for ${userToDelete.full_name} has been removed and account set to inactive.`,
        });

        setUserToDelete(null); 

        clearTimeout(cooldownTimer);
        setUpdateCooldown(false);
        setOperationInProgress(false);
        
        setTimeout(async () => {
          await fetchData();
        }, 3000);
      } else {
        throw new Error(response?.data?.error || 'Deactivation failed - no success confirmation');
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      
      let errorMessage = "Could not deactivate user profile.";
      let errorTitle = "Deactivation Failed";
      
      if (error.response?.status === 429 || error.message?.includes('Rate limit') || error.response?.data?.error?.includes('Rate limit')) {
        errorTitle = "Rate Limit Exceeded";
        errorMessage = "Too many requests. Please wait 1 minute before trying again.";
        
        clearTimeout(cooldownTimer);
        setTimeout(() => {
          setUpdateCooldown(false);
          setOperationInProgress(false);
        }, 60000);
        
      } else if (error.response?.status === 500) {
        errorTitle = "Server Error";
        errorMessage = "Server error occurred. Please try again in a few moments.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateArticles = async () => {
    if (operationInProgress) {
        toast({
            title: "Operation In Progress",
            description: "Please wait for the current operation to complete.",
            variant: "destructive"
        });
        return;
    }
    setOperationInProgress(true);
    toast({
        title: "Creating articles...",
        description: "Please wait while we populate the Help Center.",
    });

    try {
      const articlesToCreate = [
            {
                title: "Getting Started with ProfileSpike",
                slug: "getting-started",
                category: "getting-started",
                excerpt: "Learn the basics of setting up your account and running your first analysis.",
                content: `Welcome to ProfileSpike! We're excited to help you on your career journey. Here's how to get started in 3 simple steps:\n\n1. **Complete Your Profile:** After signing up, you'll go through a quick onboarding process. This helps us personalize your AI feedback.\n\n2. **Run Your First Analysis:** We recommend starting with the **AI Resume Analyzer** (if available) or another relevant tool. Upload your resume (PDF or Word doc) and our AI will give you an instant score and actionable feedback.\n\n3. **Review Your Insights:** All of your completed analyses are saved in the **Saved Insights** page. You can review them anytime to track your progress.\n\nYou start with 3 free credits. Each analysis uses one credit. If you need more, you can always upgrade to a premium plan for unlimited access!`,
                is_published: true
            },
            {
                title: "From Good to Great: Strategies for a High-Impact Resume",
                slug: "high-impact-resume-strategies",
                category: "resume-analysis",
                excerpt: "Go beyond the basics with advanced strategies to make your resume stand out.",
                content: `A strong resume gets you the interview. Here's how to make yours stand out to both automated systems (ATS) and human recruiters.\n\n### Keywords are King\nUse the job description as your guide. Identify key skills, qualifications, and technologies mentioned, and ensure that language is mirrored in your resume. Our AI Resume Analyzer is specifically designed to help you with this keyword optimization.\n\n### Action Verbs + Quantified Results\nThis is the most powerful formula for your experience bullet points. Avoid passive language like "Responsible for...". Instead, use strong action verbs and add numbers to show your impact.\n\n- **Instead of:** \`Managed social media accounts.\`\n- **Try:** \`Grew social media engagement by 45% across three platforms by implementing a data-driven content strategy.\`\n\n### Formatting for Humans & Robots\n- **Clarity is Key:** Keep your layout clean, professional, and easy to read. Use a standard font like Calibri, Arial, or Times New Roman.\n- **ATS-Friendly:** Avoid using tables, columns, or graphics in your resume, as these can confuse the Applicant Tracking Systems that many companies use to filter applications. A single-column format is safest.\n- **File Type:** Always submit your resume as a PDF to preserve your formatting unless the application specifically requests a Word document.`,
                is_published: true
            },
            {
                title: "5 Keys to a Powerful LinkedIn Profile",
                slug: "linkedin-profile-keys",
                category: "linkedin-optimization",
                excerpt: "Transform your LinkedIn from a simple online resume to a powerful networking and branding tool.",
                content: `Your LinkedIn profile is your digital professional identity. Our AI LinkedIn Optimizer can give you detailed feedback, but here are five key areas to focus on.\n\n1. **Your Headline is Your Pitch:** Don't just list your job title. Use the 220 characters to describe your value. Example: \`Senior Product Manager | Building User-Centric FinTech Solutions | Ex-Amazon\`.\n\n2. **A Professional Headshot:** This is non-negotiable. No selfies or group photos. Your face should be clearly visible, and you should look approachable and professional.\n\n3. **The "About" Section is Your Story:** This is your chance to shine. Write in the first person. Talk about your passion, your core skills, your biggest achievements, and what you're looking for in your career. End with a call to action, like "Feel free to connect with me!"\n\n4. **Detail Your Experience with STAR:** Just like on your resume, use the STAR method (Situation, Task, Action, Result) in your experience descriptions. Quantify your results to show your impact.\n\n5. **Skills & Endorsements:** Pin your top three most relevant skills to the top of the skills section. This tells everyone what you're best at. Don't be afraid to ask colleagues for endorsements on your most important skills.`,
                is_published: true
            },
            {
                title: "Crafting Your Interview Narrative: The STAR Method",
                slug: "interview-narrative-star",
                category: "interview-prep",
                excerpt: "Learn how to structure your answers to behavioral questions with compelling, memorable stories.",
                content: `Behavioral questions like "Tell me about a time when..." are designed to see how you've handled situations in the past. The STAR method is the best way to provide a clear, concise, and impactful answer.\n\nOur **AI Interview Prep** tool is perfect for practicing this method.\n\nHere's the breakdown:\n\n- **S - Situation:** Briefly set the scene and provide the necessary context. (1-2 sentences)\n  - *"In my previous role as a Project Manager, we were facing a tight deadline on a key client deliverable."*\n- **T - Task:** Describe your specific responsibility or goal in that situation. (1 sentence)\n  - *"My task was to re-prioritize the team's workload to ensure we met the deadline without sacrificing quality."*\n- **A - Action:** Detail the specific, individual steps you took. This should be the longest part of your answer. Use "I" statements to focus on your contribution.\n  - *"First, I organized a quick stand-up to identify critical path items. Then, I delegated two lower-priority tasks to a parallel team and created a new, focused timeline which I communicated to the client..."*\n- **R - Result:** What was the outcome of your actions? Quantify it whenever possible.\n  - *"As a result, we delivered the project on time, and the client was so pleased with our transparency and performance that they extended our contract by six months, valued at $250,000."*`,
                is_published: true
            },
            {
                title: "Billing, Credits, and Subscriptions",
                slug: "billing-explained",
                category: "billing",
                excerpt: "Everything you need to know about ProfileSpike pricing and credits.",
                content: `### Free Plan\n\n- You receive **3 free credits** when you sign up.\n- Each AI analysis (e.g., Resume, LinkedIn, Portfolio) costs 1 credit.\n- This plan is perfect for trying out our core features.\n\n### Premium Plans\n\n- Our paid plans give you **unlimited analyses** - no credit limits!\n- You also get access to all AI tools, including advanced features.\n- We offer monthly and semi-annual billing options.\n\n### Managing Your Subscription\n\n- You can view your current plan and credit balance in **Account Settings**.\n- Upgrade anytime with our secure Stripe checkout on the **Pricing** page.\n- You can manage or cancel your subscription at any time from your Account Settings.`,
                is_published: true
            },
            {
                title: "Data Security and Privacy",
                slug: "data-security",
                category: "troubleshooting",
                excerpt: "Learn how we protect your personal information and documents.",
                content: `Your privacy and security are our top priorities. Here's how we protect your data:\n\n- **Data Encryption:** All data, including your uploaded documents, is encrypted both in transit (while being uploaded) and at rest (when stored on our servers).\n- **Strict Access Control:** Our database is configured with Row Level Security (RLS). This means your data is tied to your account, and no other user can ever access it. It's a fundamental part of our architecture.\n- **Secure AI Processing:** When you submit a document for analysis, it is processed by our AI in a secure, isolated environment. It is not used for training, and no human reviews your documents.\n- **Data Deletion:** You have the right to delete your data at any time. If you delete your account, all associated profile information and analysis results are permanently removed.`,
                is_published: true
            }
        ];
    
      for (const article of articlesToCreate) {
        const existing = await Article.filter({ slug: article.slug });
        if (existing.length === 0) {
          await Article.create(article);
        }
      }

      toast({
        title: "Success!",
        description: `Help Center has been populated. Navigating now...`,
      });
      navigate(createPageUrl('HelpCenter'));
    } catch (error) {
      console.error('Error creating articles:', error);
      toast({
        title: "Error Creating Articles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setOperationInProgress(false);
    }
  };

  const handleCleanupDuplicates = async () => {
    if (operationInProgress) {
        toast({
            title: "Operation In Progress",
            description: "Please wait for the current operation to complete.",
            variant: "destructive"
        });
        return;
    }
    setOperationInProgress(true);
    toast({
      title: "Searching for Duplicates...",
      description: "Looking for articles that might be duplicates.",
    });

    try {
      const allArticles = await Article.list();
      const possibleDuplicates = allArticles.filter(article => 
        article.slug === 'three-rules-for-graduates' || 
        article.title.toLowerCase().includes('three rules for graduates')
      );

      if (possibleDuplicates.length === 0) {
        toast({
          title: "No Duplicates Found",
          description: "No duplicate articles were detected.",
        });
        setOperationInProgress(false);
        return;
      }

      setDuplicateArticles(possibleDuplicates);
      setShowDuplicatesDialog(true);

    } catch (error) {
      console.error("Error searching for duplicate articles:", error);
      toast({
        title: "Search Failed",
        description: "Could not search for duplicates. Check console for details.",
        variant: "destructive",
      });
    } finally {
        setOperationInProgress(false);
    }
  };

  const handleDeleteSelectedArticles = async (articleIds) => {
    if (operationInProgress) {
        toast({
            title: "Operation In Progress",
            description: "Please wait for the current operation to complete.",
            variant: "destructive"
        });
        return;
    }
    setOperationInProgress(true);
    toast({
      title: "Deleting Articles...",
      description: "Removing selected duplicate articles.",
    });

    try {
      for (const articleId of articleIds) {
        await Article.delete(articleId);
      }
      
      toast({
        title: "Cleanup Complete!",
        description: `Successfully removed ${articleIds.length} article(s).`,
      });

      setShowDuplicatesDialog(false);
      setDuplicateArticles([]);

    } catch (error) {
      console.error("Error deleting articles:", error);
      toast({
        title: "Deletion Failed",
        description: "Some articles could not be deleted. Check console for details.",
        variant: "destructive",
      });
    } finally {
        setOperationInProgress(false);
    }
  };

  if (isLoading) {
    return <div className="p-8"><LoadingSpinner text="Loading Admin Data..." /></div>;
  }
  
  const getSubscriptionBadge = (status) => {
      if (status === 'premium') {
          return <Badge className="bg-yellow-500 text-white">Premium</Badge>;
      }
      return <Badge variant="outline">Free</Badge>;
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Badge className="bg-red-500 text-white">Admin</Badge>;
    }
    return <Badge variant="outline">User</Badge>;
  }

  const getStatusBadge = (status) => {
    if (status === 'inactive') {
        return <Badge variant="destructive">Inactive</Badge>;
    }
    return <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>;
  }

  const getOnboardedBadge = (onboarded) => {
    if (onboarded) {
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Yes</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border border-yellow-200">No</Badge>;
  }

  const getAnalysisChartData = (range) => {
    let groupedData = {};
    let dateFormat;
    let intervalFn;

    switch (range) {
        case 'day':
            dateFormat = 'MMM d';
            intervalFn = startOfDay;
            break;
        case 'quarter':
            dateFormat = "yyyy QQQ";
            intervalFn = startOfQuarter;
            break;
        case 'year':
            dateFormat = 'yyyy';
            intervalFn = startOfYear;
            break;
        case 'month':
        default:
            dateFormat = 'MMM yyyy';
            intervalFn = startOfMonth;
            break;
    }
    
    allAnalyses.forEach(analysis => {
        const intervalStart = intervalFn(new Date(analysis.created_date));
        const dateKey = format(intervalStart, dateFormat);
        const sortKey = intervalStart.getTime();

        if (!groupedData[dateKey]) {
            groupedData[dateKey] = { name: dateKey, sortKey: sortKey, resume: 0, linkedin: 0, portfolio: 0, interview: 0, veteran: 0 };
        }
        let typeKey = analysis.analysis_type;
        if(typeKey === 'veteran_translator') typeKey = 'veteran';

        if (groupedData[dateKey].hasOwnProperty(typeKey)) {
            groupedData[dateKey][typeKey]++;
        }
    });
    
    return Object.values(groupedData).sort((a, b) => a.sortKey - b.sortKey);
  };
  
  const analysisChartData = getAnalysisChartData(chartTimeRange);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{stats.premiumUsers}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Analyses Run</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${stats.failedAnalyses > 0 ? 'text-red-500' : 'text-green-500'}`} />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{stats.failedAnalyses > 0 ? `${stats.failedAnalyses} Failed` : 'Healthy'}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <p className="text-2xl font-bold">{stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</p>
                </CardContent>
            </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleCreateArticles} className="bg-blue-600 hover:bg-blue-700" disabled={operationInProgress}>
                <Plus className="w-4 h-4 mr-2" />
                Populate Help Center
              </Button>
              <Button onClick={handleCleanupDuplicates} variant="outline" disabled={operationInProgress}>
                <Trash2 className="w-4 h-4 mr-2" />
                Find Duplicate Articles
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Analysis by Type</CardTitle>
                        <CardDescription>Distribution of AI tools used.</CardDescription>
                      </div>
                      <Select value={chartTimeRange} onValueChange={setChartTimeRange}>
                          <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Time Range" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="month">Month</SelectItem>
                              <SelectItem value="quarter">Quarter</SelectItem>
                              <SelectItem value="year">Year</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analysisChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="resume" stackId="a" fill="#3b82f6" name="Resume" />
                            <Bar dataKey="linkedin" stackId="a" fill="#8b5cf6" name="LinkedIn" />
                            <Bar dataKey="portfolio" stackId="a" fill="#ef4444" name="Portfolio" />
                            <Bar dataKey="interview" stackId="a" fill="#10b981" name="Interview" />
                            <Bar dataKey="veteran" stackId="a" fill="#f97316" name="Veteran Translator" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Failed Analyses</CardTitle>
                    <CardDescription>Monitor for system issues.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Analysis ID</TableHead>
                                <TableHead>User Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentFailedAnalyses.length > 0 ? recentFailedAnalyses.map(analysis => (
                                <TableRow key={analysis.id}>
                                    <TableCell className="font-mono text-xs">{analysis.id}</TableCell>
                                    <TableCell>{analysis.created_by}</TableCell>
                                    <TableCell>{analysis.analysis_type}</TableCell>
                                    <TableCell>{new Date(analysis.created_date).toLocaleString()}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center">No failed analyses. System is healthy.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and edit user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Onboarded</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const profile = profiles[user.email];
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getOnboardedBadge(profile?.onboarded)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{profile ? profile.user_type?.replace(/_/g, ' ') : 'N/A'}</TableCell>
                      <TableCell>{profile ? getSubscriptionBadge(profile.subscription_status) : 'N/A'}</TableCell>
                      <TableCell>{profile ? profile.credits_remaining : 'N/A'}</TableCell>
                      <TableCell>{new Date(user.created_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            disabled={isUpdating || updateCooldown || operationInProgress}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            disabled={isUpdating || updateCooldown || operationInProgress}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Deactivate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDuplicatesDialog} onOpenChange={setShowDuplicatesDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Duplicate Articles Found</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Found {duplicateArticles.length} articles that might be duplicates. Review and select which ones to delete:
              </p>
              
              {duplicateArticles.map((article) => (
                <Card key={article.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{article.title}</h4>
                        <p className="text-sm text-gray-500">Slug: {article.slug}</p>
                        <p className="text-sm text-gray-500">Created: {new Date(article.created_date).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Category: {article.category}</p>
                        {article.author && <p className="text-sm text-gray-500">Author: {article.author}</p>}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSelectedArticles([article.id])}
                        disabled={operationInProgress}
                      >
                        Delete This Article
                      </Button>
                    </div>
                    <div className="border-l-4 border-gray-200 pl-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {article.content?.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDuplicatesDialog(false)}
                  disabled={operationInProgress}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteSelectedArticles(duplicateArticles.map(a => a.id))}
                  disabled={operationInProgress}
                >
                  Delete All Listed Articles
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to deactivate this user?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the user's profile and all associated data (like analyses), and set their account status to inactive. They will not be able to access the app until reactivated.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUserToDelete(null)} disabled={isUpdating || operationInProgress}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteUser} 
                className="bg-red-600 hover:bg-red-700" 
                disabled={isUpdating || operationInProgress}
              >
                {isUpdating ? 'Deactivating...' : 'Yes, deactivate user'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open && !isUpdating && !operationInProgress) {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
          } else if (!open && (isUpdating || operationInProgress)) {
            toast({
              title: "Update In Progress",
              description: "Please wait for the update to complete before closing.",
              variant: "destructive"
            });
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User: {selectedUser?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Account Status</label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => setEditFormData(prev => ({...prev, status: value}))}
                  disabled={operationInProgress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <label className="text-sm font-medium">Onboarding Complete</label>
                <Select
                  value={String(editFormData.onboarded)} 
                  onValueChange={(value) => setEditFormData(prev => ({...prev, onboarded: value === 'true'}))}
                  disabled={operationInProgress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Onboarded status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">User Role</label>
                 <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Select 
                          value={editFormData.role} 
                          disabled={true}
                        >
                          <SelectTrigger className="cursor-not-allowed">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>User roles can only be changed by platform owners in the Base44 dashboard.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              
              <div>
                <label className="text-sm font-medium">User Type</label>
                <Select 
                  value={editFormData.user_type} 
                  onValueChange={(value) => setEditFormData(prev => ({...prev, user_type: value}))}
                  disabled={operationInProgress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent_grad">Recent Graduate</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="skilled_veteran">Skilled Veteran</SelectItem>
                    <SelectItem value="ex_offender">Ex-Offender</SelectItem>
                    <SelectItem value="returning_citizen">Returning Citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Subscription Status</label>
                <Select 
                  value={editFormData.subscription_status} 
                  onValueChange={(value) => setEditFormData(prev => ({...prev, subscription_status: value}))}
                  disabled={operationInProgress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Credits Remaining</label>
                <Input
                  type="number"
                  value={editFormData.credits_remaining}
                  onChange={(e) => setEditFormData(prev => ({...prev, credits_remaining: parseInt(e.target.value, 10) || 0}))}
                  disabled={operationInProgress}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpdateUser}
                  disabled={isUpdating || updateCooldown || operationInProgress}
                  className="flex-1"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : updateCooldown || operationInProgress ? (
                    <>
                      <div className="animate-pulse h-4 w-4 bg-gray-400 rounded-full mr-2" />
                      Please Wait...
                    </>
                  ) : (
                    'Update User'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (!isUpdating && !operationInProgress) {
                      setIsEditDialogOpen(false);
                      setSelectedUser(null);
                    }
                  }}
                  disabled={isUpdating || operationInProgress}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}