
import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Analysis } from "@/api/entities";
import { processAnalysis } from "@/api/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Briefcase,
  Users,
  Target
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EmailService from "@/components/email/EmailService";
import { useAuth } from "@/components/AuthContext";

const interviewTypes = [
  { value: "behavioral", label: "Behavioral Interview", icon: Users },
  { value: "technical", label: "Technical Interview", icon: Target },
  { value: "case_study", label: "Case Study", icon: Briefcase },
  { value: "panel", label: "Panel Interview", icon: Users }
];

export default function InterviewPrep() {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    interview_type: "",
    job_title: "",
    company_name: "",
    job_description: "",
    questions: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userProfile || !formData.interview_type || !formData.job_title) {
      toast({
        title: "Missing Information",
        description: "Please fill in the interview type and job title.",
        variant: "destructive"
      });
      return;
    }

    if (user.role !== 'admin' && userProfile.subscription_status !== 'premium' && userProfile.credits_remaining <= 0) {
      toast({
        title: "Out of Credits",
        description: "You've used all your free credits. Upgrade to premium for unlimited analyses.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const analysisRecord = await Analysis.create({
        analysis_type: 'interview',
        content_text: JSON.stringify(formData),
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
        console.error("Interview analysis processing error:", err);
      });

      toast({
        title: "Analysis Submitted! 🚀",
        description: "Redirecting you to view the progress...",
      });
      
      navigate(createPageUrl('SavedInsights'));

    } catch (error) {
      console.error("Error submitting interview prep:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit analysis. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Interview Prep</h1>
              <p className="text-gray-600">Get AI-powered interview coaching and practice</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(user?.role === 'admin' || userProfile?.subscription_status === 'premium') ? (
              <Badge className="bg-yellow-500 text-white px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                {user?.role === 'admin' ? 'Admin Access' : 'Premium'}
              </Badge>
            ) : (
              <Badge className="bg-black text-white px-3 py-1">
                {userProfile?.credits_remaining} credits remaining
              </Badge>
            )}
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Interview Type *</label>
                <Select value={formData.interview_type} onValueChange={(value) => handleInputChange('interview_type', value)}>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Job Title *</label>
                <Input
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  placeholder="e.g. Senior Marketing Manager"
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company Name</label>
              <Input
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="e.g. Google, Microsoft, etc."
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Job Description (Optional)</label>
              <Textarea
                value={formData.job_description}
                onChange={(e) => handleInputChange('job_description', e.target.value)}
                placeholder="Paste the job description here to get more targeted practice questions..."
                rows={4}
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Specific Questions (Optional)</label>
              <Textarea
                value={formData.questions}
                onChange={(e) => handleInputChange('questions', e.target.value)}
                placeholder="Add specific questions you want to practice, one per line..."
                rows={3}
                className="rounded-xl border-gray-200"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.interview_type || !formData.job_title || isSubmitting || (user?.role !== 'admin' && userProfile?.subscription_status !== 'premium' && userProfile?.credits_remaining <= 0)}
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
                  Start Interview Prep
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
