import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Analysis } from "@/api/entities";
import { processAnalysis } from "@/api/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Linkedin,
  AlertCircle,
  Zap,
  Sparkles,
  Send
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import EmailService from "@/components/email/EmailService";
import { useAuth } from "@/components/AuthContext";

export default function LinkedInOptimizer() {
  const { user, userProfile } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setLinkedinUrl(userProfile.linkedin_url || '');
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    if (!linkedinUrl || !userProfile) {
        setError("Please enter your LinkedIn profile URL.");
        return;
    }

    if (!linkedinUrl.includes('linkedin.com/in/')) {
        setError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile).");
        return;
    }

    if (user.role !== 'admin' && userProfile.subscription_status !== 'premium' && userProfile.credits_remaining <= 0) {
      setError("You've used all your free credits. Upgrade to premium for unlimited analyses.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const analysisRecord = await Analysis.create({
        analysis_type: 'linkedin',
        content_text: linkedinUrl,
        status: 'processing'
      });

      if (user.role !== 'admin' && userProfile.subscription_status !== 'premium') {
        const newCreditsRemaining = Math.max(0, userProfile.credits_remaining - 1);
        await UserProfile.update(userProfile.id, { credits_remaining: newCreditsRemaining });
        
        if (newCreditsRemaining === 1) {
          EmailService.sendLowCreditsEmail({ ...userProfile, credits_remaining: newCreditsRemaining });
        }
      }

      processAnalysis({ analysisId: analysisRecord.id }).catch(err => {
        console.error("LinkedIn analysis processing error:", err);
      });

      toast({
        title: "Analysis Submitted! 🚀",
        description: "Redirecting you to view the progress...",
      });

      navigate(createPageUrl('SavedInsights'));

    } catch (error) {
      console.error("Error submitting LinkedIn analysis:", error);
      setError("Failed to submit analysis. Please try again.");
      setIsSubmitting(false);
    }
  };

  // The SessionGuard in Layout.js handles the main loading and profile checks.
  // This page can now assume user and userProfile exist if it renders.

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">LinkedIn Optimizer</h1>
              <p className="text-gray-600">Boost your professional brand with AI insights</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(user?.role === 'admin' || userProfile?.subscription_status === 'premium') ? (
              <Badge className="bg-yellow-500 text-white px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                {user.role === 'admin' ? 'Admin Access' : 'Premium'}
              </Badge>
            ) : (
              <Badge className="bg-black text-white px-3 py-1">
                {userProfile?.credits_remaining} credits remaining
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5" />
                  Your LinkedIn Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="rounded-xl border-gray-200"
                    />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!linkedinUrl || isSubmitting || (user?.role !== 'admin' && userProfile?.subscription_status !== 'premium' && userProfile?.credits_remaining <= 0)}
                  className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg h-full">
              <CardContent className="p-12 text-center flex flex-col justify-center h-full">
                <Linkedin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to optimize your LinkedIn?
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Submit your profile URL to see the analysis progress live on your Insights page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}