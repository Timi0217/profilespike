
import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Analysis } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { processAnalysis } from "@/api/functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  FileText, 
  Sparkles, // Removed Zap from here
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LoadingSpinner from "../components/LoadingSpinner";
import EmailService from "@/components/email/EmailService";
import { useAuth } from "@/components/AuthContext";

const userTypeConfig = {
  recent_grad: { bgGradient: "from-emerald-50 to-teal-50", accentColor: "text-emerald-600" },
  professional: { bgGradient: "from-blue-50 to-indigo-50", accentColor: "text-blue-600" },
  freelancer: { bgGradient: "from-purple-50 to-violet-50", accentColor: "text-purple-600" },
  skilled_veteran: { bgGradient: "from-red-50 to-rose-50", accentColor: "text-red-600" },
  ex_offender: { bgGradient: "from-orange-50 to-amber-50", accentColor: "text-orange-600" },
  returning_citizen: { bgGradient: "from-sky-50 to-cyan-50", accentColor: "text-sky-600" }
};

export default function ResumeAnalyzer() {
  const { user, userProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if(userProfile) {
        setCurrentCredits(userProfile.credits_remaining);
    }
  }, [userProfile]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/msword' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF or Word document.",
        variant: "destructive"
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file || !userProfile) return;

    if (userProfile.subscription_status !== 'premium' && currentCredits <= 0) {
      toast({
        title: "Out of Credits",
        description: "You've used all your free credits. Upgrade to premium for unlimited analyses.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { file_url } = await UploadFile({ file });
      
      const analysisRecord = await Analysis.create({
        analysis_type: 'resume',
        file_url,
        status: 'processing'
      });
      
      if (userProfile.subscription_status !== 'premium') {
        const newCreditsRemaining = Math.max(0, currentCredits - 1);
        await UserProfile.update(userProfile.id, { credits_remaining: newCreditsRemaining });
        setCurrentCredits(newCreditsRemaining);

        if (newCreditsRemaining === 1) {
          EmailService.sendLowCreditsEmail({ ...userProfile, credits_remaining: newCreditsRemaining });
        }
      }

      processAnalysis({ analysisId: analysisRecord.id }).catch(err => {
        console.error("Analysis processing error:", err);
      });

      toast({
        title: "Analysis Submitted! 🚀",
        description: "Redirecting you to view the progress...",
      });
      
      navigate(createPageUrl('SavedInsights'));
      
    } catch (error) {
      console.error("Error submitting analysis:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit analysis. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-gray-100">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-black mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Please complete your profile setup to access Resume Analyzer.
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl("Onboarding")}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl"
            >
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = userTypeConfig[userProfile.user_type] || userTypeConfig.professional;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" /> {/* Changed icon from Zap to FileText */}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Resume Analyzer</h1>
              <p className={`text-gray-700 font-medium ${config.accentColor}`}>Get ATS-optimized feedback powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userProfile.subscription_status === 'premium' ? (
              <Badge className="bg-yellow-500 text-white px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium - Unlimited
              </Badge>
            ) : (
              <Badge className="bg-black text-white px-3 py-1">
                {currentCredits !== null ? `${currentCredits} credits remaining` : "Loading credits..."}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">
                    {file ? file.name : "Click to upload your resume"}
                  </p>
                  <p className="text-sm text-gray-500">PDF or Word documents</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!file || isSubmitting || (userProfile.subscription_status !== 'premium' && (currentCredits === null || currentCredits <= 0))}
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
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to analyze your resume?
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Upload your resume to queue it for AI analysis. You will be redirected to the Insights page to watch the progress live.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
