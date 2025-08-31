// Mock authentication system to replace Base44 auth
import { storage, STORAGE_KEYS } from './localStorage';

const AUTH_STORAGE_KEY = 'profilespike_auth_session';

class MockAuth {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.listeners = new Set();
  }

  // Check if user is currently authenticated
  async me() {
    const session = storage.get(AUTH_STORAGE_KEY);
    if (session && session.expiresAt > Date.now()) {
      this.currentUser = session.user;
      this.isAuthenticated = true;
      return this.currentUser;
    }
    
    // Session expired or doesn't exist
    this.logout();
    throw new Error('User not authenticated', { response: { status: 401 } });
  }

  // Mock login - in real app this would redirect to OAuth provider
  async loginWithRedirect(redirectUrl = window.location.href) {
    // For demo purposes, create a mock user
    const mockUser = {
      id: 'user_' + Date.now(),
      email: 'demo@profilespike.com',
      name: 'Demo User',
      status: 'active'
    };
    
    const session = {
      user: mockUser,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    storage.set(AUTH_STORAGE_KEY, session);
    this.currentUser = mockUser;
    this.isAuthenticated = true;
    
    // Notify listeners
    this.listeners.forEach(callback => callback(mockUser));
    
    // In real app, this would redirect to OAuth provider
    // For now, just reload the page to simulate redirect flow
    window.location.href = redirectUrl;
  }

  // Logout user
  logout() {
    storage.remove(AUTH_STORAGE_KEY);
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners.forEach(callback => callback(null));
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const User = new MockAuth();