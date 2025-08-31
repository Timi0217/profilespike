import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { LearningPlan } from "@/api/entities";
import { SavedInsight } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Zap,
  Sparkles,
  BookOpen,
  ExternalLink,
  Save,
  Star,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReskillingRadar() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [saveTitle, setSaveTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      const profiles = await UserProfile.filter({ created_by: user.email });
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
        setCurrentRole(profiles[0].current_role || '');
      }
      
      const plans = await LearningPlan.filter({ created_by: user.email }, '-created_date', 10);
      setLearningPlans(plans);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole || !userProfile) return;

    if (userProfile.credits_remaining <= 0 && userProfile.subscription_status !== 'premium') {
      setError("You've used all your free credits. Upgrade to premium for unlimited analyses.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const aiResponse = await InvokeLLM({
        prompt: `You are a career development expert. Analyze the skill gap between a current role and target role, then provide a comprehensive reskilling plan.

        Current Role: ${currentRole || 'Not specified'}
        Target Role: ${targetRole}
        Current Skills: ${currentSkills || 'Not specified'}
        Industry Context: ${userProfile.industry || 'General'}
        
        Please provide:
        1. A detailed skill gap analysis
        2. Priority ranking of skills to develop (High/Medium/Low)
        3. Specific course recommendations from major platforms (Coursera, LinkedIn Learning, Udemy, Skillshare)
        4. Estimated timeline for skill development
        5. Industry certifications that would be valuable
        6. Automation risk assessment for current role
        7. Emerging skills in the target field
        8. Suggested learning path with milestones
        
        Focus on practical, actionable recommendations with real course titles and providers.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",  
          properties: {
            skill_gaps: { 
              type: "array", 
              items: {
                type: "object",
                properties: {
                  skill: { type: "string" },
                  priority: { type: "string", enum: ["High", "Medium", "Low"] },
                  description: { type: "string" }
                }
              }
            },
            recommended_courses: {
              type: "array",
              items: {
                type: "object", 
                properties: {
                  title: { type: "string" },
                  provider: { type: "string" },
                  duration: { type: "string" },
                  skill: { type: "string" },
                  url: { type: "string" },
                  rating: { type: "number" }
                }
              }
            },
            certifications: { type: "array", items: { type: "string" } },
            automation_risk: {
              type: "object",
              properties: {
                risk_level: { type: "string", enum: ["Low", "Medium", "High"] },
                explanation: { type: "string" }
              }
            },
            timeline: { type: "string" },
            emerging_skills: { type: "array", items: { type: "string" } },
            learning_path: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(aiResponse);

      if (userProfile.subscription_status !== 'premium') {
        await UserProfile.update(userProfile.id, {
          credits_remaining: Math.max(0, userProfile.credits_remaining - 1)
        });
        setUserProfile(prev => ({ ...prev, credits_remaining: prev.credits_remaining - 1 }));
      }

    } catch (error) {
      console.error("Error analyzing reskilling needs:", error);
      setError("Failed to analyze reskilling needs. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const handleSavePlan = async () => {
    if (!analysis || !saveTitle.trim()) return;
    
    setIsSaving(true);
    try {
      // Save as learning plan
      const skillGaps = analysis.skill_gaps?.map(gap => gap.skill) || [];
      await LearningPlan.create({
        target_role: targetRole,
        current_skills: currentSkills.split(',').map(s => s.trim()).filter(s => s),
        skill_gaps: skillGaps,
        recommended_courses: analysis.recommended_courses || [],
        priority_level: 'high'
      });

      // Also save as insight
      await SavedInsight.create({
        title: saveTitle.trim(),
        insight_type: 'reskilling',
        content: {
          currentRole,
          targetRole, 
          currentSkills,
          analysis
        }
      });

      setSaveTitle('');
      await loadUserData(); // Refresh learning plans
    } catch (error) {
      console.error("Error saving learning plan:", error);
    }
    setIsSaving(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Reskilling Radar</h1>
              <p className="text-gray-600">AI-powered skill gap analysis and learning recommendations</p>
            </div>
          </div>
          
          {userProfile && (
            <div className="flex items-center gap-4">
              <Badge className="bg-black text-white px-3 py-1">
                {userProfile.credits_remaining} credits remaining
              </Badge>
              {userProfile.subscription_status === 'premium' && (
                <Badge className="bg-yellow-500 text-white px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium - Unlimited
                </Badge>
              )}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Career Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Current Role</label>
                  <Input
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g., Marketing Coordinator"
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Target Role *</label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Product Manager"
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Current Skills (Optional)</label>
                  <Input
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    placeholder="e.g., Excel, Social Media, Analytics"
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!targetRole || isAnalyzing || (userProfile?.credits_remaining === 0 && userProfile?.subscription_status !== 'premium')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Skills Gap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Learning Plans */}
            {learningPlans.length > 0 && (
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Your Learning Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningPlans.slice(0, 3).map((plan) => (
                      <div key={plan.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-sm text-black">{plan.target_role}</p>
                        <p className="text-xs text-gray-500">{plan.skill_gaps?.length || 0} skills to develop</p>
                        <Badge 
                          className={`text-xs mt-1 ${
                            plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                            plan.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {plan.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              {analysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Save Section */}
                  <Card className="border-0 shadow-lg bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Input
                          value={saveTitle}
                          onChange={(e) => setSaveTitle(e.target.value)}
                          placeholder="Name this learning plan to save it..."
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSavePlan}
                          disabled={!saveTitle.trim() || isSaving}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Automation Risk Assessment */}
                  {analysis.automation_risk && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                          <Target className="w-5 h-5" />
                          Automation Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`p-4 rounded-xl ${getRiskColor(analysis.automation_risk.risk_level)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Risk Level: {analysis.automation_risk.risk_level}</span>
                            <Badge className={getPriorityColor(analysis.automation_risk.risk_level)}>
                              {analysis.automation_risk.risk_level}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed">{analysis.automation_risk.explanation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skill Gaps */}
                  {analysis.skill_gaps && analysis.skill_gaps.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                          <Target className="w-5 h-5" />
                          Skill Gap Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.skill_gaps.map((gap, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                              <Badge className={getPriorityColor(gap.priority)}>
                                {gap.priority}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-semibold text-black mb-1">{gap.skill}</h4>
                                <p className="text-sm text-gray-600">{gap.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommended Courses */}
                  {analysis.recommended_courses && analysis.recommended_courses.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <BookOpen className="w-5 h-5" />
                          Recommended Courses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {analysis.recommended_courses.map((course, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-black mb-1">{course.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{course.provider}</p>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {course.duration}
                                    </div>
                                    {course.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        {course.rating}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {course.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {course.skill}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Learning Path */}
                  {analysis.learning_path && analysis.learning_path.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-700">
                          <TrendingUp className="w-5 h-5" />
                          Suggested Learning Path
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.learning_path.map((step, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl">
                              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <p className="text-gray-700">{step}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Emerging Skills & Certifications */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.emerging_skills && analysis.emerging_skills.length > 0 && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-700">
                            <Sparkles className="w-5 h-5" />
                            Emerging Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.emerging_skills.map((skill, index) => (
                              <Badge key={index} className="px-3 py-1 bg-purple-100 text-purple-800 border-purple-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.certifications && analysis.certifications.length > 0 && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>  
                          <CardTitle className="flex items-center gap-2 text-orange-700">
                            <CheckCircle className="w-5 h-5" />
                            Valuable Certifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                <span className="text-sm">{cert}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Timeline */}
                  {analysis.timeline && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <Clock className="w-5 h-5" />
                          Estimated Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-lg leading-relaxed">{analysis.timeline}</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Ready to plan your reskilling journey?
                    </h3>
                    <p className="text-gray-500">
                      Enter your target role to receive a personalized skill gap analysis and learning recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}