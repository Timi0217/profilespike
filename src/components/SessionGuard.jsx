import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPageUrl } from '@/utils';
import LoadingSpinner from './LoadingSpinner';

const SessionGuard = ({ children }) => {
  const { user, userProfile, isLoading, refetch } = useAuth();
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      // Prevent triggering before AuthContext finishes loading
      if (isLoading) return;

      // If no user, redirect to login
      if (!user) {
        navigate(createPageUrl('Home'));
        return;
      }

      // Check if user account is inactive
      if (user.status === 'inactive') {
        setSessionReady(true); // Let Layout handle inactive account display
        return;
      }

      // If userProfile is null or onboarded is undefined, fetch again
      if (!userProfile || typeof userProfile.onboarded === 'undefined') {
        try {
          await refetch(); // This will update the context
          // After refetch, the effect will re-run with updated userProfile
          return;
        } catch (error) {
          navigate(createPageUrl('Onboarding'));
          return;
        }
      } else {
        // Profile is loaded and has onboarded status
        if (!userProfile.onboarded) {
          navigate(createPageUrl('Onboarding'));
          return;
        } else {
          setSessionReady(true);
        }
      }
    };

    validateSession();
  }, [user, userProfile, isLoading, navigate, refetch]);

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Validating your session..." />
      </div>
    );
  }

  return children;
};

export default SessionGuard;