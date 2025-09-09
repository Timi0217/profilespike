// Simple browser-compatible authentication service
export const authService = {
  // Get current authenticated user from localStorage
  async getCurrentUser() {
    try {
      if (typeof window === 'undefined') return null;
      
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      
      if (!storedUser || !token) {
        return null;
      }
      
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Sign in user (simplified for browser)
  async signIn(email, password) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      throw new Error('Sign in failed');
    }
  },

  // Sign up user (simplified for browser)
  async signUp(email, password, metadata = {}) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = {
        id: Date.now().toString(),
        email,
        name: metadata.name || email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      throw new Error('Sign up failed');
    }
  },

  // Sign out user
  async signOut() {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      throw new Error('Sign out failed');
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    return !!(token && user);
  }
};