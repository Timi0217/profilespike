import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { setAdminRole } from '@/api/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Shield, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminSetup({ user }) {
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingAdmin, setIsSettingAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const admins = await User.filter({ role: 'admin' });
        if (admins.length > 0) {
          setIsAdminSetup(true);
        }
      } catch (error) {
        console.error("Error checking for admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdminExists();
  }, []);

  const handleSetAdmin = async () => {
    setIsSettingAdmin(true);
    try {
      await setAdminRole();
      toast({
        title: "Success!",
        description: "You have been assigned the admin role.",
      });
      setIsAdminSetup(true);
      // Give a moment for the user to see the success message before redirecting
      setTimeout(() => {
        navigate(createPageUrl('AdminDashboard'));
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set admin role. Please try again.",
        variant: "destructive",
      });
      console.error("Error setting admin role:", error);
    } finally {
      setIsSettingAdmin(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Checking system status..." />;
  }

  return (
    <Card className="max-w-lg mx-auto shadow-xl border-gray-100">
      <CardHeader className="text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isAdminSetup ? 'bg-green-100' : 'bg-blue-100'}`}>
          {isAdminSetup ? <ShieldCheck className="w-10 h-10 text-green-600" /> : <ShieldAlert className="w-10 h-10 text-blue-600" />}
        </div>
        <CardTitle className="text-2xl font-bold text-black">
          {isAdminSetup ? "Admin Configured" : "Initial Admin Setup"}
        </CardTitle>
        <CardDescription>
          {isAdminSetup 
            ? "The administrative user has already been set up for this application."
            : "No admin user found. As the first user, you can assign yourself administrative privileges."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdminSetup ? (
          <Button onClick={() => navigate(createPageUrl('AdminDashboard'))} className="w-full bg-black hover:bg-gray-900 text-white">
            Go to Admin Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSetAdmin} disabled={isSettingAdmin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isSettingAdmin ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Assigning Role...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Become the First Admin
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}