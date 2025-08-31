
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities"; // Keep import for User entity type if needed elsewhere, though not directly used as prop here.
import { UserProfile } from "@/api/entities"; // Keep import for UserProfile entity type if needed elsewhere.
import { SavedInsight } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Award, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Zap,
  Sparkles,
  Copy,
  Download,
  Save,
  Crown,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginOrOnboard from "../components/LoginOrOnboard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "@/components/AuthContext"; // New import

export default function VeteranTranslator() { // user, userProfile props removed
  const { user, userProfile } = useAuth(); // Use useAuth hook to get user and userProfile
  const [militaryInput, setMilitaryInput] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState(null);
  const [saveTitle, setSaveTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTranslate = async () => {
    // Check if userProfile is available (it's now from useAuth)
    if (!militaryInput || !userProfile) {
      setError("Please provide military experience and ensure your profile is loaded.");
      return;
    }

    // Use the updated isPremium check here
    const isPremium = userProfile?.subscription_status === 'premium' || user?.role === 'admin';
    if (!isPremium) {
      setError("Veteran Translator is available for Premium subscribers only. Upgrade to access this feature.");
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const aiResponse = await InvokeLLM({
        prompt: `You are an expert military-to-civilian career translator. Convert the following military experience into civilian-friendly language that recruiters and hiring managers can easily understand:

        Military Background: ${militaryInput}
        ${jobCode ? `Military Job Code: ${jobCode}` : ''}
        ${targetRole ? `Target Civilian Role: ${targetRole}` : ''}
        
        Please provide:
        1. A civilian-friendly job title
        2. Rewritten job descriptions using corporate terminology
        3. Quantified achievements where possible
        4. Skills translation (military terms → civilian equivalents)
        5. Industry keywords that align with civilian roles
        6. Suggested resume bullet points
        7. Leadership and management experience translation
        
        Focus on translating military jargon, emphasizing transferable skills, and highlighting leadership, problem-solving, and technical abilities that civilian employers value.`,
        response_json_schema: {
          type: "object",
          properties: {
            civilian_title: { type: "string" },
            description_rewrite: { type: "string" },
            skills_translation: { 
              type: "array", 
              items: {
                type: "object",
                properties: {
                  military_term: { type: "string" },
                  civilian_equivalent: { type: "string" }
                }
              }
            },
            resume_bullets: { type: "array", items: { type: "string" } },
            keywords: { type: "array", items: { type: "string" } },
            achievements: { type: "array", items: { type: "string" } },
            leadership_highlights: { type: "array", items: { type: "string" } }
          }
        }
      });

      setTranslation(aiResponse);

    } catch (error) {
      console.error("Error translating military experience:", error);
      setError("Failed to translate military experience. Please try again.");
    }

    setIsTranslating(false);
  };

  const handleSaveTranslation = async () => {
    if (!translation || !saveTitle.trim()) return;
    
    setIsSaving(true);
    try {
      await SavedInsight.create({
        title: saveTitle.trim(),
        insight_type: 'veteran_translation',
        content: {
          input: militaryInput,
          jobCode,
          targetRole,
          translation
        }
      });
      setSaveTitle('');
      // Show success message or redirect
    } catch (error) {
      console.error("Error saving translation:", error);
      setError("Failed to save translation. Please try again.");
    }
    setIsSaving(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const isGated = !user || !userProfile;
  const isPremium = userProfile?.subscription_status === 'premium' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Veteran Translation Engine</h1>
              <p className="text-gray-600">Convert military experience to civilian-friendly language</p>
            </div>
            <Badge className="bg-yellow-500 text-white ml-auto">
              <Crown className="w-3 h-3 mr-1" />
              Premium Feature
            </Badge>
          </div>
        </div>

        {!isPremium && userProfile && ( // Check if not premium AND userProfile exists (to avoid showing for logged out users)
          <Card className="border-2 border-yellow-200 bg-yellow-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Premium Feature</h3>
                  <p className="text-yellow-700">
                    Veteran Translation Engine is available for Premium subscribers only.
                  </p>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-5 gap-8 relative">
          {isGated && <LoginOrOnboard featureName="Veteran Translation Engine" user={user} userProfile={userProfile} />}
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Military Experience Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Military Job Description *</label>
                  <Textarea
                    value={militaryInput}
                    onChange={(e) => setMilitaryInput(e.target.value)}
                    placeholder="Paste your military job description, duties, or experience here..."
                    rows={8}
                    className="rounded-xl border-gray-200"
                    disabled={isGated || !isPremium}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Military Job Code (Optional)</label>
                    <Input
                      value={jobCode}
                      onChange={(e) => setJobCode(e.target.value)}
                      placeholder="e.g., 25B, 0311, etc."
                      className="rounded-xl border-gray-200"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Target Civilian Role (Optional)</label>
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g., Project Manager, IT Specialist"
                      className="rounded-xl border-gray-200"
                      disabled={isGated || !isPremium}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleTranslate}
                  disabled={isGated || !militaryInput || isTranslating || !isPremium}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
                >
                  {isTranslating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Translate to Civilian
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              {translation ? (
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
                          placeholder="Name this translation to save it..."
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSaveTranslation}
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

                  {/* Civilian Title */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-5 h-5" />
                          Civilian Job Title
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(translation.civilian_title)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-lg font-semibold text-gray-800">{translation.civilian_title}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description Rewrite */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-blue-700">
                          <Target className="w-5 h-5" />
                          Civilian Description
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(translation.description_rewrite)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {translation.description_rewrite}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Translation */}
                  {translation.skills_translation && translation.skills_translation.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                          <TrendingUp className="w-5 h-5" />
                          Skills Translation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {translation.skills_translation.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                              <span className="font-medium text-gray-600">{skill.military_term}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-semibold text-gray-800">{skill.civilian_equivalent}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Resume Bullets */}
                  {translation.resume_bullets && translation.resume_bullets.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-orange-700">
                            <Target className="w-5 h-5" />
                            Resume Bullet Points
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.resume_bullets.join('\n• '))}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {translation.resume_bullets.map((bullet, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                              <span className="text-orange-600 font-bold">•</span>
                              <p className="text-gray-700">{bullet}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Keywords */}
                  {translation.keywords && translation.keywords.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-700">
                          <Sparkles className="w-5 h-5" />
                          Industry Keywords
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {translation.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1 text-indigo-700 border-indigo-200">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Ready to translate your military experience?
                    </h3>
                    <p className="text-gray-500">
                      Input your military background to receive civilian-friendly translations that recruiters understand.
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
