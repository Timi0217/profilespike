
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { userProfileSchema } from "@/schemas/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Zap,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EmailService from "@/components/email/EmailService";
import { useAuth } from "@/components/AuthContext";

const userTypes = [
  {
    id: 'recent_grad',
    title: 'Recent Graduate',
    description: 'Just finished school and looking to start your career',
    icon: GraduationCap,
    color: 'emerald',
    benefits: ['Resume optimization for entry-level roles', 'LinkedIn profile setup', 'Interview practice for new grads']
  },
  {
    id: 'professional',
    title: 'Tenured Professional',
    description: 'Experienced professional looking to advance or change careers',
    icon: Briefcase,
    color: 'blue',
    benefits: ['Advanced resume strategies', 'Executive LinkedIn presence', 'Senior-level interview prep']
  },
  {
    id: 'freelancer',
    title: 'Freelancer',
    description: 'Independent professional building your personal brand',
    icon: Zap,
    color: 'purple',
    benefits: ['Portfolio optimization', 'Client-focused positioning', 'Rate negotiation preparation']
  },
  {
    id: 'skilled_veteran',
    title: 'Skilled Veteran',
    description: 'Transitioning from military service to a civilian career',
    icon: Award,
    color: 'red',
    benefits: ['Military-to-civilian skill translation', 'Federal resume guidance', 'Corporate interview prep']
  },
  {
    id: 'ex_offender',
    title: 'Ex-Offender',
    description: 'Rebuilding your career after incarceration',
    icon: RefreshCw,
    color: 'orange',
    benefits: ['Background-friendly job strategies', 'Skills-based resume building', 'Interview confidence coaching']
  },
  {
    id: 'returning_citizen',
    title: 'Returning Talent',
    description: 'Re-entering the workforce after a break',
    icon: RefreshCw,
    color: 'teal',
    benefits: ['Gap explanation strategies', 'Skills update guidance', 'Modern job search techniques']
  }
];

const currentRoleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'recent_graduate', label: 'Recent Graduate' },
  { value: 'entry_level', label: 'Entry Level Professional' },
  { value: 'mid_level', label: 'Mid-Level Professional' },
  { value: 'senior_level', label: 'Senior-Level Professional' },
  { value: 'executive', label: 'Executive/C-Level' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'career_changer', label: 'Career Changer' },
  { value: 'returning_to_work', label: 'Returning to Work' },
  { value: 'unemployed', label: 'Currently Unemployed' },
  { value: 'military_transitioning', label: 'Military Transitioning' },
  { value: 'formerly_incarcerated', label: 'Formerly Incarcerated' },
  { value: 'other', label: 'Other' }
];

const industryOptions = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'banking', label: 'Banking' },
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'construction', label: 'Construction' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'education', label: 'Education' },
  { value: 'energy', label: 'Energy' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'finance', label: 'Finance' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'government', label: 'Government' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal', label: 'Legal' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'marketing_advertising', label: 'Marketing & Advertising' },
  { value: 'media_entertainment', label: 'Media & Entertainment' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'retail', label: 'Retail' },
  { value: 'sports_recreation', label: 'Sports & Recreation' },
  { value: 'technology', label: 'Technology' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'transportation', label: 'Transportation' }
];

const countryOptions = [
  { value: 'USA', label: 'United States' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'CAN', label: 'Canada' },
  { value: 'IND', label: 'India' },
  { value: 'AUS', label: 'Australia' },
  { value: 'DEU', label: 'Germany' },
  { value: 'FRA', label: 'France' },
  { value: 'BRA', label: 'Brazil' },
  { value: 'NGA', label: 'Nigeria' },
  { value: 'other', label: 'Other' },
  { value: 'ZAF', label: 'South Africa' },
];

export default function Onboarding() {
  const { user, userProfile, isLoading, refetch } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    user_type: '',
    first_name: '',
    last_name: '',
    current_role: '',
    industry: '',
    country: '',
    linkedin_url: '',
    portfolio_url: '',
    referral_code: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This effect pre-populates form data from an existing (but incomplete) profile
    // or a referral code from the URL.
    if (!isLoading && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      setFormData(prev => ({
          ...prev,
          user_type: userProfile?.user_type || '',
          first_name: userProfile?.first_name || '',
          last_name: userProfile?.last_name || '',
          current_role: userProfile?.current_role || '',
          industry: userProfile?.industry || '',
          country: userProfile?.country || '',
          linkedin_url: userProfile?.linkedin_url || '',
          portfolio_url: userProfile?.portfolio_url || '',
          referral_code: refCode || userProfile?.referral_code || ''
      }));
    }
  }, [user, userProfile, isLoading]);

  const handleUserTypeSelect = (userType) => {
    setFormData(prev => ({ ...prev, user_type: userType }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Validate form data
      const validation = userProfileSchema.safeParse(formData);
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        setIsSubmitting(false);
        return;
      }

      let profileData = {
        user_type: formData.user_type,
        first_name: formData.first_name,
        last_name: formData.last_name,
        current_role: formData.current_role,
        industry: formData.industry,
        country: formData.country,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        referral_code: formData.referral_code,
        onboarded: true, 
        credits_remaining: 3,
        subscription_status: 'free'
      };

      // Ensure 'created_by' is always set from the authenticated user's email
      if (user && user.email) {
          profileData.created_by = user.email;
      } else {
          console.error("Onboarding: User or user.email is missing! Cannot set created_by.");
          throw new Error("User session invalid during onboarding.");
      }

      // Handle referral logic before creating/updating the profile
      if (formData.referral_code) {
        const referrers = await UserProfile.filter({ referral_code: formData.referral_code });
        if (referrers.length > 0) {
          const referrerProfile = referrers[0];
          await UserProfile.update(referrerProfile.id, {
            credits_remaining: (referrerProfile.credits_remaining || 0) + 5
          });
          profileData.credits_remaining += 5;
          profileData.referred_by_user_id = referrerProfile.created_by;
        }
      }
      
      console.log("Onboarding: profileData being prepared for submission:", profileData);

      let newProfile;
      if (userProfile) { 
        console.log("Onboarding: Attempting to UPDATE existing profile:", userProfile.id);
        newProfile = await UserProfile.update(userProfile.id, profileData);
      } else {
        console.log("Onboarding: Attempting to CREATE new profile.");
        newProfile = await UserProfile.create(profileData);
        
        // WORKAROUND: Explicitly update onboarded to true after creation
        // This addresses the issue where the initial 'create' doesn't consistently set 'onboarded: true'
        if (newProfile && newProfile.id) {
          console.log("Onboarding: Forcing onboarded status to true after initial creation.");
          newProfile = await UserProfile.update(newProfile.id, { onboarded: true });
          console.log("Onboarding: Onboarded status force-update complete:", newProfile);
        }
      }
      
      console.log("Onboarding: Response from UserProfile.create/update:", newProfile);
      
      try {
        console.log("Onboarding: Attempting to send welcome email.");
        await EmailService.sendWelcomeEmail(newProfile);
        console.log("Onboarding: Welcome email triggered successfully.");
      } catch (emailError) {
        console.error("Onboarding: FAILED to send welcome email:", emailError);
      }
      
      console.log("Onboarding: Calling refetch() to update AuthContext state.");
      await refetch();
      console.log("Onboarding: Refetch complete. Now preparing to navigate to Dashboard.");

      // Add a small, protective delay before navigating. This can help
      // prevent race conditions where navigation occurs before context
      // updates are fully propagated in the React tree.
      await new Promise(resolve => setTimeout(resolve, 500)); 

      navigate(createPageUrl("Dashboard"));

    } catch (error) {
      console.error("Onboarding: CRITICAL ERROR during profile creation/update:", error);
      setError(`Failed to complete profile setup: ${error.message}. Please try again.`);
      setIsSubmitting(false);
    }
  };

  const selectedUserType = userTypes.find(type => type.id === formData.user_type);

  // The main loading spinner is in the Layout, so we don't need one here.
  // The layout will handle showing a login prompt if the user is not authenticated.
  if (isLoading) {
      return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
               {/* Minimal spinner, main one is in Layout */}
          </div>
      );
  }
  
  if (!user) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="max-w-md mx-auto shadow-xl border-gray-100">
                <CardContent className="p-8 text-center">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-16 h-16 rounded-2xl mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-black mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                    Please sign in to continue with profile setup.
                    </p>
                    <Button
                    onClick={() => User.loginWithRedirect(window.location.href)}
                    className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl"
                    >
                    Sign In to Continue
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-black tracking-tight">ProfileSpike</h1>
              <p className="text-lg text-gray-600">AI Career Coach</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Let's get you set up
          </h2>
          <p className="text-gray-600 text-lg">
            Personalize your experience in 3 quick steps.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  step <= currentStep
                    ? 'bg-black border-black text-white'
                    : 'border-gray-300 text-gray-300'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className="w-16 h-0.5 ml-4 transition-all duration-200 bg-gray-300" 
                    style={{
                      backgroundColor: step < currentStep ? 'black' : 'rgb(209 213 219)', 
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: User Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-2">What describes you best?</h2>
                <p className="text-gray-600">Choose your career journey to get personalized recommendations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
                      formData.user_type === type.id
                        ? `ring-2 ring-${type.color}-500 shadow-lg`
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => handleUserTypeSelect(type.id)}
                  >
                    <CardHeader className="text-center p-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        formData.user_type === type.id
                          ? `bg-${type.color}-500 text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <type.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg font-bold text-black mb-2">
                        {type.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {type.description}
                      </p>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-2">
                        {type.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!formData.user_type}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Basic Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-black mb-2">
                    Tell us about yourself
                  </CardTitle>
                  <p className="text-gray-600">
                    Help us personalize your experience
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="font-semibold">First Name *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="rounded-xl border-gray-200"
                        placeholder="Your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="font-semibold">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="rounded-xl border-gray-200"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current_role" className="font-semibold">Current Status</Label>
                    <Select value={formData.current_role} onValueChange={(value) => handleInputChange('current_role', value)}>
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select your current status" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentRoleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="font-semibold">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select your industry" />
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
                      <Label htmlFor="country" className="font-semibold">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="px-6 py-3 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!formData.first_name}
                      className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Links and Finalization */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-black mb-2">
                    Almost there!
                  </CardTitle>
                  <p className="text-gray-600">
                    Add your professional links (optional)
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="font-semibold">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      className="rounded-xl border-gray-200"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url" className="font-semibold">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                      className="rounded-xl border-gray-200"
                      placeholder="https://yourportfolio.com"
                    />
                    <p className="text-sm text-gray-500">
                      Examples: GitHub, Dribbble, Behance, Upwork, Fiverr, personal website, etc.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referral_code" className="font-semibold">Referral Code (Optional)</Label>
                    <Input
                      id="referral_code"
                      value={formData.referral_code}
                      onChange={(e) => handleInputChange('referral_code', e.target.value)}
                      className="rounded-xl border-gray-200"
                      placeholder="Enter code if you have one"
                    />
                  </div>

                  {selectedUserType && (
                    <div className="bg-gray-50 rounded-xl p-6 mt-8">
                      <h3 className="font-bold text-black mb-2">Your personalized experience includes:</h3>
                      <div className="space-y-2">
                        {selectedUserType.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                      <Badge className="mt-4 bg-black text-white">
                        3 Free AI Analyses Included
                      </Badge>
                    </div>
                  )}

                  {error && (
                    <div className="text-red-500 text-sm text-center mt-4">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="px-6 py-3 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Complete Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
