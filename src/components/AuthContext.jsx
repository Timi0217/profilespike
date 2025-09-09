import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const signIn = (email, password) => {
        // Demo sign in - always succeeds for demo purposes
        const demoUser = {
            email: email,
            name: email.split('@')[0],
            id: 'demo-user-123'
        };
        setUser(demoUser);
        return Promise.resolve(demoUser);
    };

    const signOut = () => {
        setUser(null);
        setUserProfile(null);
    };

    const value = {
        user,
        userProfile,
        signIn,
        signOut
    };

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