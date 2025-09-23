import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '@/api/entities';
import { UserProfile } from '@/api/entities';

const AuthContext = createContext(null);

// A flag to ensure the initial fetch happens only once per app load.
let initialFetchCompleted = false;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            console.log("Checking auth status...");
            const currentUser = await User.me();
            console.log("Session initialized:", currentUser?.id);
            setUser(currentUser);
            if (currentUser) {
                const profiles = await UserProfile.filter({ created_by: currentUser.email });
                if (profiles.length > 0) {
                    setUserProfile(profiles[0]);
                } else {
                    setUserProfile(null); // Explicitly set to null if no profile
                }
            } else {
                setUserProfile(null);
            }
        } catch (error) {
            // Handle 401 (Unauthorized) as normal behavior - user is not logged in
            if (error.response && error.response.status === 401) {
                console.log("User not authenticated (expected for logged out users)");
            } else {
                // Log other errors as they might indicate actual problems
                console.error("Auth check failed:", error.message);
            }
            setUser(null);
            setUserProfile(null);
        } finally {
            console.log("Auth check finished.");
            setIsLoading(false);
            initialFetchCompleted = true;
        }
    };

    useEffect(() => {
        // This effect should only run ONCE per application lifecycle.
        // We use a global flag to prevent it from re-triggering on fast-refreshes or re-mounts.
        if (!initialFetchCompleted) {
            checkAuthStatus();
        } else {
            // If the fetch is already done, we just ensure loading is false.
            // This handles cases of component re-mounts on navigation without a full page reload.
            setIsLoading(false);
        }
    }, []);

    const refetch = async () => {
        setIsLoading(true);
        await checkAuthStatus();
    }

    const value = { user, userProfile, isLoading, refetch };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Export AuthContext so it can be used directly in other components
export { AuthContext };

/**
 * A component to guard content based on the authentication status.
 * It leverages the `useAuth` hook to determine the current user's session state.
 */
export const SessionGuard = ({ children, loadingFallback = <div>Loading session...</div>, unauthenticatedFallback = null }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return loadingFallback;
    }

    if (!user) {
        return unauthenticatedFallback;
    }

    return children;
};