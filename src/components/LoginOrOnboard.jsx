import React from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, LogIn, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

/**
 * A reusable component to prompt users to log in or complete their profile.
 * @param {string} featureName - The name of the feature being gated.
 * @param {object} user - The current user object, or null if not logged in.
 * @param {object} userProfile - The user's profile, or null if not created.
 */
export default function LoginOrOnboard({ featureName, user, userProfile }) {
  const handleLogin = () => {
    User.loginWithRedirect(window.location.href);
  };

  const content = {
    unauthenticated: {
      icon: LogIn,
      title: `Unlock ${featureName}`,
      description: "Sign in or create an account to get personalized AI feedback and unlock all features.",
      buttonText: "Sign In to Continue",
      onClick: handleLogin,
      link: null,
    },
    noProfile: {
      icon: ArrowRight,
      title: "One More Step!",
      description: `Please complete your profile to start using the ${featureName}. It only takes a minute!`,
      buttonText: "Complete Your Profile",
      onClick: null,
      link: createPageUrl("Onboarding"),
    },
  };

  const currentState = !user ? 'unauthenticated' : !userProfile ? 'noProfile' : null;

  if (!currentState) {
    return null;
  }

  const { icon: Icon, title, description, buttonText, onClick, link } = content[currentState];

  const ActionButton = (
    <Button onClick={onClick} className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl mt-6">
      <Icon className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );

  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full mx-auto shadow-2xl border-2 border-gray-100">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          {link ? <Link to={link}>{ActionButton}</Link> : ActionButton}
        </CardContent>
      </Card>
    </div>
  );
}