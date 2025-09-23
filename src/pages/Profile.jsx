
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Settings,
  CreditCard,
  Gift,
  LogOut,
  Save,
  Sparkles,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { generateReferralCode } from "@/api/functions";
import { useAuth } from "@/components/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profiles = await UserProfile.filter({ created_by: user.email });
        if (profiles.length > 0) {
          setUserProfile(profiles[0]);
          setFormData(profiles[0]);
        } else {
          setUserProfile(null); // No profile exists, will show onboarding prompt.
          setFormData({});
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    } else {
      // When the user prop isn't ready, we are not loading profile data yet.
      // The layout handles the main auth loading.
      setIsLoading(false);
    }
  }, [user]); // Dependency on the user prop is key.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-black hover:bg-gray-900 text-white"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (!userProfile) { // This check is safe because isLoading is false.
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">It looks like you haven't completed your profile setup.</p>
        <Button
          onClick={() => window.location.href = createPageUrl("Onboarding")}
          className="bg-black hover:bg-gray-900 text-white rounded-xl"
        >
          Complete Onboarding
        </Button>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!userProfile) return;
    setIsSaving(true);
    setError(null); // Clear previous errors before saving

    try {
      const { id, created_by, created_date, updated_date, ...updateData } = formData;
      await UserProfile.update(userProfile.id, updateData);
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };
  
  const handleGenerateReferralCode = async () => {
    try {
        const { data } = await generateReferralCode();
        if (data.code) {
            setUserProfile(prev => ({...prev, referral_code: data.code}));
            setFormData(prev => ({...prev, referral_code: data.code}));
            toast({ title: "Referral code generated!" });
        } else {
            throw new Error("Backend did not return a referral code.");
        }
    } catch (err) {
        let description = "Could not generate referral code. Please try again later.";
        // Check if the error indicates the profile was not found
        if (err.response && err.response.status === 404) {
            description = "You must complete your profile setup before generating a referral code.";
        } else if (err.response && err.response.data && err.response.data.error) {
            description = err.response.data.error;
        }
        toast({ title: "Error", description: description, variant: "destructive" });
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}${createPageUrl("Onboarding")}?ref=${userProfile.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Copied to clipboard!", description: "Share the link with your friends." });
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">Account Settings</h1>
              <p className="text-gray-600">Manage your profile and subscription</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  This information helps us personalize your AI feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" value={formData.first_name || ''} onChange={e => handleInputChange('first_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={formData.last_name || ''} onChange={e => handleInputChange('last_name', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_role">Current Role or Status</Label>
                  <Input id="current_role" value={formData.current_role || ''} onChange={e => handleInputChange('current_role', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry or Field</Label>
                  <Input id="industry" value={formData.industry || ''} onChange={e => handleInputChange('industry', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input id="linkedin_url" type="url" value={formData.linkedin_url || ''} onChange={e => handleInputChange('linkedin_url', e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="bg-black hover:bg-gray-900 text-white rounded-xl px-6 py-3"
                  >
                    {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription & Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Current Plan</Label>
                  <p className="text-lg font-semibold capitalize">{userProfile.subscription_status}</p>
                </div>
                 <div>
                  <Label className="text-sm text-gray-500">Available Credits</Label>
                   {userProfile.subscription_status === 'premium' ? (
                    <p className="text-lg font-semibold">Unlimited</p>
                  ) : (
                    <p className="text-lg font-semibold">{userProfile.credits_remaining}</p>
                  )}
                </div>

                {userProfile.subscription_status === 'premium' ? (
                  <div>
                    <Label className="text-sm text-gray-500">Next Renewal</Label>
                    <p className="text-lg font-semibold">October 26, 2024</p>
                    <Button variant="outline" className="w-full mt-4">Manage Subscription</Button>
                  </div>
                ) : (
                  <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                     <Link to={createPageUrl("Pricing")}>
                      <Sparkles className="w-4 h-4 mr-2"/>
                      Upgrade to Premium
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Refer & Earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Refer a friend and you both get 5 free credits!</p>
                {userProfile.referral_code ? (
                    <div className="flex items-center gap-2">
                        <Input value={`${window.location.origin}${createPageUrl("Onboarding")}?ref=${userProfile.referral_code}`} readOnly />
                        <Button variant="outline" size="icon" onClick={copyReferralLink}>
                            <Copy className="w-4 h-4"/>
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" className="w-full" onClick={handleGenerateReferralCode}>Get Referral Link</Button>
                )}
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => User.logout()}>
              <LogOut className="w-4 h-4 mr-2"/>
              Log Out
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
