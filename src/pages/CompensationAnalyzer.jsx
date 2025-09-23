
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities"; // Keep if User entity is used elsewhere, not directly in this component after change
import { UserProfile } from "@/api/entities"; // Keep if UserProfile entity is used elsewhere, not directly in this component after change
import { CompensationAnalysis } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  AlertCircle,
  Plus,
  Trash2,
  BarChart3,
  Lightbulb,
  Crown,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { processCompensationAnalysis } from "@/api/functions";
import LoginOrOnboard from "../components/LoginOrOnboard";
import { useAuth } from "@/components/AuthContext";

export default function CompensationAnalyzer() {
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    job_title: "",
    industry: "",
    location: "",
    experience_years: "",
    current_salary: "",
    compensation_history: []
  });

  useEffect(() => {
    // Only set form data if userProfile is available
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        industry: userProfile.industry || "",
        location: userProfile.country || ""
      }));
      // If user and userProfile are available, stop loading
      setIsLoading(false);
    } else if (user && userProfile === null) {
      // If user exists but userProfile is explicitly null (meaning not loaded yet, or doesn't exist)
      // We can stop loading and let LoginOrOnboard handle the profile completion prompt.
      setIsLoading(false);
    } else if (!user) {
      // If no user, loading is complete, LoginOrOnboard will handle login prompt.
      setIsLoading(false);
    }
  }, [user, userProfile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCompensationEntry = () => {
    setFormData(prev => ({
      ...prev,
      compensation_history: [
        ...prev.compensation_history,
        { role: "", company: "", salary: "", bonus: "", equity: "", start_date: "", end_date: "" }
      ]
    }));
  };

  const updateCompensationEntry = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      compensation_history: prev.compensation_history.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const removeCompensationEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      compensation_history: prev.compensation_history.filter((_, i) => i !== index)
    }));
  };

  const isGated = !user || !userProfile;
  const isPremium = userProfile?.subscription_status === 'premium' || user?.role === 'admin';

  const handleAnalyze = async () => {
    if (!userProfile) {
      setError("Please complete your profile first.");
      return;
    }

    if (!isPremium) {
      setError("Compensation analysis is available for Premium subscribers only. Upgrade to access this feature.");
      return;
    }

    if (!formData.job_title || !formData.experience_years) {
      setError("Please fill in the required fields: job title and years of experience.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create analysis record
      const analysisData = {
        ...formData,
        experience_years: parseInt(formData.experience_years),
        current_salary: formData.current_salary ? parseFloat(formData.current_salary) : null
      };

      const analysis = await CompensationAnalysis.create(analysisData);

      // Trigger background processing
      await processCompensationAnalysis({ analysisId: analysis.id });

      setResult({
        id: analysis.id,
        status: 'processing',
        message: "Your compensation analysis is being processed. You'll receive an email when it's ready, and results will appear in your Saved Insights."
      });

    } catch (error) {
      console.error("Error starting analysis:", error);
      setError("Failed to start compensation analysis. Please try again.");
    }

    setIsAnalyzing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading compensation analyzer..." />
      </div>
    );
  }
  
  // This check is now covered by the LoginOrOnboard component, but we keep it as a fallback.
  // This block implicitly uses the `userProfile` prop.
  if (user && !userProfile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-black mb-4">Profile Required</h1>
          <p className="text-gray-600">Please complete your profile to access the compensation analyzer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Compensation Analyzer</h1>
            <p className="text-gray-600">Understand your market value and get negotiation guidance</p>
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
                    Compensation analysis with market data and negotiation guidance is available for Premium subscribers.
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
           {isGated && <LoginOrOnboard featureName="Compensation Analyzer" user={user} userProfile={userProfile} />}
          {/* Analysis Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Role Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title *</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience *</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', e.target.value)}
                      placeholder="5"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Technology"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_salary">Current Salary (optional)</Label>
                  <Input
                    id="current_salary"
                    type="number"
                    value={formData.current_salary}
                    onChange={(e) => handleInputChange('current_salary', e.target.value)}
                    placeholder="120000"
                    disabled={isGated || !isPremium}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compensation History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Compensation History (Optional)
                  </CardTitle>
                  <Button
                    onClick={addCompensationEntry}
                    variant="outline"
                    size="sm"
                    disabled={isGated || !isPremium}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.compensation_history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Add your compensation history for more accurate analysis
                  </p>
                ) : (
                  formData.compensation_history.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Position {index + 1}</h4>
                        <Button
                          onClick={() => removeCompensationEntry(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          disabled={isGated || !isPremium}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Role title"
                          value={entry.role}
                          onChange={(e) => updateCompensationEntry(index, 'role', e.target.value)}
                          disabled={isGated || !isPremium}
                        />
                        <Input
                          placeholder="Company name"
                          value={entry.company}
                          onChange={(e) => updateCompensationEntry(index, 'company', e.target.value)}
                          disabled={isGated || !isPremium}
                        />
                        <Input
                          type="number"
                          placeholder="Base salary"
                          value={entry.salary}
                          onChange={(e) => updateCompensationEntry(index, 'salary', e.target.value)}
                          disabled={isGated || !isPremium}
                        />
                        <Input
                          type="number"
                          placeholder="Annual bonus"
                          value={entry.bonus}
                          onChange={(e) => updateCompensationEntry(index, 'bonus', e.target.value)}
                          disabled={isGated || !isPremium}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Analysis Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isGated || isAnalyzing || !isPremium}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-lg rounded-xl"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Analyzing Market Data...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5 mr-2" />
                  Analyze Compensation
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

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Analysis Started</h3>
                        <p className="text-green-700">{result.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Data Analysis</h4>
                      <p className="text-sm text-gray-600">Salary ranges, percentiles, and industry benchmarks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Personalized Recommendations</h4>
                      <p className="text-sm text-gray-600">Specific salary targets based on your experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Negotiation Strategy</h4>
                      <p className="text-sm text-gray-600">Talking points and tactics for salary discussions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Competitiveness Score</h4>
                      <p className="text-sm text-gray-600">How your compensation compares to market rates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Research the company's compensation philosophy before negotiating</p>
                  <p>• Consider total compensation, not just base salary</p>
                  <p>• Time your negotiation strategically (performance reviews, job offers)</p>
                  <p>• Document your achievements and impact</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
