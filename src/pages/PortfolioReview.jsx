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
  Briefcase, 
  AlertCircle, 
  Zap,
  Sparkles,
  Send
} from "lucide-react";
import { createPageUrl } from "@/utils";
import EmailService from "@/components/email/EmailService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

export default function PortfolioReview() {
  const { user, userProfile } = useAuth();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setPortfolioUrl(userProfile.portfolio_url || '');
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    if (!portfolioUrl || !userProfile) return;
    
    if (!portfolioUrl.startsWith('http')) {
        setError("Please enter a valid URL (e.g., https://yourportfolio.com).");
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
        analysis_type: 'portfolio',
        content_text: portfolioUrl,
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
        console.error("Portfolio analysis processing error:", err);
      });
      
      toast({
        title: "Analysis Submitted! 🚀",
        description: "Your portfolio is queued for review. You'll be redirected to see progress.",
      });
      
      navigate(createPageUrl('SavedInsights'));

    } catch (error) {
      console.error("Error submitting portfolio analysis:", error);
      setError("Failed to submit analysis. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Portfolio Review</h1>
              <p className="text-gray-600">Showcase your best work, perfected by AI</p>
              <p className="text-sm text-gray-500 mt-1">
                Works with GitHub, Dribbble, Behance, Upwork, Fiverr, personal websites, and more
              </p>
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
                  <Briefcase className="w-5 h-5" />
                  Your Portfolio URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://your-portfolio.com"
                        className="rounded-xl border-gray-200"
                    />
                    <p className="text-xs text-gray-500">
                      Examples: GitHub, Dribbble, Behance, personal site
                    </p>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!portfolioUrl || isSubmitting || (user?.role !== 'admin' && userProfile?.subscription_status !== 'premium' && userProfile?.credits_remaining <= 0)}
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
                      Submit for Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
             <Card className="border-0 shadow-lg h-full">
                <CardContent className="p-12 text-center flex flex-col justify-center h-full">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Ready to perfect your portfolio?
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Submit your URL and our AI will analyze it. Check your <a href={createPageUrl("SavedInsights")} className="text-blue-600 hover:underline">Saved Insights</a> page for the results.
                  </p>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}