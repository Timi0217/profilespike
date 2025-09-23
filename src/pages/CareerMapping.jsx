
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { CareerPath } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Users,
  AlertCircle,
  Plus,
  Trash2,
  BarChart3,
  Lightbulb,
  Crown,
  Lock,
  MapPin,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { generateCareerPath } from "@/api/functions";
import LoginOrOnboard from "../components/LoginOrOnboard";
import { useAuth } from "@/components/AuthContext";

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'marketing_advertising', label: 'Marketing & Advertising' },
  { value: 'other', label: 'Other' }
];

const experienceLevels = [
  { value: 'entry', label: '0-2 years' },
  { value: 'mid', label: '3-7 years' },
  { value: 'senior', label: '8-15 years' },
  { value: 'executive', label: '15+ years' }
];

export default function CareerMapping() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  const [formData, setFormData] = useState({
    current_role: "",
    target_role: "",
    industry: "",
    experience_level: "",
    current_skills: [],
    career_goals: "",
    timeline: ""
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const profiles = await UserProfile.filter({ created_by: user.email });
      if (profiles.length > 0) {
        const profile = profiles[0];
        setUserProfile(profile);
        setFormData(prev => ({
          ...prev,
          industry: profile.industry || "",
          current_role: profile.current_role || ""
        }));
      }

      // Load existing career paths
      const paths = await CareerPath.filter({ created_by: user.email }, "-created_date");
      setCareerPaths(paths);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Please log in to access the career mapping tool.");
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const skill = prompt("Enter a skill:");
    if (skill && !formData.current_skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        current_skills: [...prev.current_skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      current_skills: prev.current_skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleGeneratePath = async () => {
    if (!userProfile) {
      setError("Please complete your profile first.");
      return;
    }

    if (userProfile.subscription_status !== 'premium') {
      setError("Career mapping is available for Premium subscribers only. Upgrade to access this feature.");
      return;
    }

    if (!formData.current_role || !formData.target_role) {
      setError("Please fill in both current and target roles.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const pathData = {
        ...formData,
        status: 'processing'
      };

      const careerPath = await CareerPath.create(pathData);

      // Trigger background processing
      await generateCareerPath({ careerPathId: careerPath.id });

      // Add to local state
      setCareerPaths(prev => [careerPath, ...prev]);
      setSelectedPath(careerPath);

    } catch (error) {
      console.error("Error generating career path:", error);
      setError("Failed to generate career path. Please try again.");
    }

    setIsGenerating(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading career mapping tool..." />
      </div>
    );
  }
  
  const isGated = !user || !userProfile;
  const isPremium = userProfile?.subscription_status === 'premium';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Career Mapping Tool</h1>
            <p className="text-gray-600">Plan your career journey with AI-powered insights</p>
          </div>
          <Badge className="bg-yellow-500 text-white ml-auto">
            <Crown className="w-3 h-3 mr-1" />
            Premium Feature
          </Badge>
        </div>

        {!isPremium && userProfile && (
          <Card className="border-2 border-yellow-200 bg-yellow-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Premium Feature</h3>
                  <p className="text-yellow-700">
                    Career mapping with personalized growth paths and skill recommendations is available for Premium subscribers.
                  </p>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
           {isGated && <LoginOrOnboard featureName="Career Mapping Tool" user={user} userProfile={userProfile} />}
          
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Define Your Career Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_role">Current Role *</Label>
                    <Input
                      id="current_role"
                      value={formData.current_role}
                      onChange={(e) => handleInputChange('current_role', e.target.value)}
                      placeholder="e.g. Software Developer"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_role">Target Role *</Label>
                    <Input
                      id="target_role"
                      value={formData.target_role}
                      onChange={(e) => handleInputChange('target_role', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => handleInputChange('industry', value)}
                      disabled={isGated || !isPremium}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select 
                      value={formData.experience_level} 
                      onValueChange={(value) => handleInputChange('experience_level', value)}
                      disabled={isGated || !isPremium}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.current_skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                          disabled={isGated || !isPremium}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={addSkill}
                    variant="outline"
                    size="sm"
                    disabled={isGated || !isPremium}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career_goals">Career Goals</Label>
                  <Textarea
                    id="career_goals"
                    value={formData.career_goals}
                    onChange={(e) => handleInputChange('career_goals', e.target.value)}
                    placeholder="Describe your career aspirations..."
                    className="h-24"
                    disabled={isGated || !isPremium}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select 
                    value={formData.timeline} 
                    onValueChange={(value) => handleInputChange('timeline', value)}
                    disabled={isGated || !isPremium}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 months</SelectItem>
                      <SelectItem value="6-months">6 months</SelectItem>
                      <SelectItem value="1-year">1 year</SelectItem>
                      <SelectItem value="2-years">2 years</SelectItem>
                      <SelectItem value="5-years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGeneratePath}
                  disabled={isGated || isGenerating || !isPremium}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white py-4 text-lg rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Generating Career Path...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Generate Career Path
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Previous Career Paths */}
            {careerPaths.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Your Career Paths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {careerPaths.slice(0, 5).map((path) => (
                      <div 
                        key={path.id} 
                        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedPath(path)}
                      >
                        <div>
                          <h4 className="font-semibold">{path.current_role} → {path.target_role}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(path.created_date).toLocaleDateString()} • {path.status}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Define Your Path</h4>
                      <p className="text-sm text-gray-600">Set your current and target roles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Analysis</h4>
                      <p className="text-sm text-gray-600">Get personalized skill gap analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Action Plan</h4>
                      <p className="text-sm text-gray-600">Receive curated learning resources</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedPath && selectedPath.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Career Path Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Skills to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPath.skill_gaps?.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Timeline</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{selectedPath.timeline || "6-12 months"}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Expected Salary Range</h4>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>{selectedPath.salary_range || "Contact us for details"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
