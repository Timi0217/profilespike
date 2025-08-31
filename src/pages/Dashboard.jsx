
import React, { useState, useEffect } from "react";
import { Analysis } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Clock, 
  FileText, 
  Linkedin, 
  Briefcase, 
  MessageSquare,
  ArrowRight,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/components/AuthContext";

const userTypeConfig = {
  recent_grad: {
    color: "#00D4AA",
    bgGradient: "from-emerald-50 to-teal-50",
    accentBg: "bg-emerald-500",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200"
  },
  professional: {
    color: "#1B365D", 
    bgGradient: "from-blue-50 to-indigo-50",
    accentBg: "bg-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },
  freelancer: {
    color: "#8B5CF6",
    bgGradient: "from-purple-50 to-violet-50",
    accentBg: "bg-purple-500",
    textColor: "text-purple-700",
    borderColor: "border-purple-200"
  },
  skilled_veteran: {
    color: "#DC2626",
    bgGradient: "from-red-50 to-rose-50",
    accentBg: "bg-red-600",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  }
};

const tools = [
  {
    title: "Resume Analyzer",
    description: "Get ATS-optimized feedback",
    icon: FileText,
    href: "ResumeAnalyzer",
    type: "resume"
  },
  {
    title: "LinkedIn Optimizer", 
    description: "Boost your profile score",
    icon: Linkedin,
    href: "LinkedInOptimizer",
    type: "linkedin"
  },
  {
    title: "Portfolio Review",
    description: "Showcase your best work",
    icon: Briefcase,
    href: "PortfolioReview", 
    type: "portfolio"
  },
  {
    title: "Interview Prep",
    description: "Practice with AI feedback",
    icon: MessageSquare,
    href: "InterviewPrep",
    type: "interview"
  }
];

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnalyses = async () => {
      setIsLoadingAnalyses(true);
      setError(null);
      try {
        if (user && userProfile) {
          const analyses = await Analysis.filter({ created_by: user.email }, "-created_date", 10);
          setRecentAnalyses(analyses);
        }
      } catch (err) { 
        console.error("Error loading user analyses:", err);
        setError("Failed to load recent analyses. Please try refreshing.");
      } finally {
        setIsLoadingAnalyses(false);
      }
    };

    if (user && userProfile) {
      loadAnalyses();
    }
  }, [user, userProfile]);

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">
            {!user ? "Please wait while we load your session..." : "Setting up your profile..."}
          </p>
          <LoadingSpinner text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  const config = userTypeConfig[userProfile.user_type] || userTypeConfig.professional;
  
  // FIX: Ensure only completed analyses with a valid number score are used and default to 0.
  const completedAnalyses = recentAnalyses.filter(a => a.status === 'completed' && typeof a.score === 'number');
  const averageScore = completedAnalyses.length > 0 
    ? Math.round(completedAnalyses.reduce((sum, a) => sum + a.score, 0) / completedAnalyses.length)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl p-8 mb-8 border ${config.borderColor}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
                Welcome back, {userProfile.first_name}
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                {userProfile.user_type === 'recent_grad' && "Ready to launch your career journey"}
                {userProfile.user_type === 'professional' && "Advancing your professional trajectory"} 
                {userProfile.user_type === 'freelancer' && "Building your independent brand"}
                {userProfile.user_type === 'skilled_veteran' && "Translating your service into success"}
              </p>
              <div className="flex items-center gap-4">
                {/* FIX: Show unlimited for admins too */}
                {(userProfile.subscription_status === 'premium' || user.role === 'admin') ? (
                  <Badge className="bg-yellow-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    {user.role === 'admin' ? 'Admin Access' : 'Premium'}
                  </Badge>
                ) : (
                  <Badge className={`${config.accentBg} text-white px-3 py-1`}>
                    {userProfile.credits_remaining} credits remaining
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Overall Score</div>
              <div className="text-4xl font-bold text-black">{averageScore}</div>
              <div className="text-sm text-gray-500">out of 100</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    +12%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-black mb-1">{completedAnalyses.length}</h3>
                <p className="text-gray-600">Analyses Completed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                  <Badge variant="outline" className="text-blue-700 border-blue-200">
                    Active
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-black mb-1">3</h3>
                <p className="text-gray-600">Improvement Goals</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                  <Badge variant="outline" className="text-purple-700 border-purple-200">
                    This Week
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-black mb-1">2.5h</h3>
                <p className="text-gray-600">Time Invested</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tools.map((tool, index) => {
            const lastAnalysis = recentAnalyses.find(a => a.analysis_type === tool.type && a.status === 'completed');
            
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={createPageUrl(tool.href)}>
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-200">
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors duration-200" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2">{tool.title}</h3>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      {lastAnalysis && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Last Score</span>
                            <span className="font-semibold">{lastAnalysis.score}/100</span>
                          </div>
                          <Progress value={lastAnalysis.score} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity with Access Links */}
        {recentAnalyses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {recentAnalyses.slice(0, 5).map((analysis, index) => (
                    <div 
                         key={analysis.id} 
                         className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                         onClick={() => navigate(createPageUrl("SavedInsights"))}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          {analysis.analysis_type === 'resume' && <FileText className="w-5 h-5" />}
                          {analysis.analysis_type === 'linkedin' && <Linkedin className="w-5 h-5" />}
                          {analysis.analysis_type === 'portfolio' && <Briefcase className="w-5 h-5" />}
                          {analysis.analysis_type === 'interview' && <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-black capitalize">
                            {analysis.analysis_type.replace('_', ' ')} Analysis
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(analysis.created_date).toLocaleDateString()} • {analysis.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {analysis.status === 'completed' && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-black">{analysis.score}</div>
                            <div className="text-sm text-gray-500">score</div>
                          </div>
                        )}
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                {recentAnalyses.length > 5 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => navigate(createPageUrl("SavedInsights"))}>
                      View All Analyses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
