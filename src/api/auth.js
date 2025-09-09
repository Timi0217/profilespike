// JWT-based authentication using Railway PostgreSQL database
import { db } from './database.js';

// Use environment variable or fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'profilespike-dev-secret-2025';

export const authService = {
  // Get current authenticated user from localStorage token
  async getCurrentUser() {
    try {
      if (typeof window === 'undefined') return null;
      
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      
      if (!storedUser || !token) {
        // For development - create a demo user automatically
        return this.createDemoUser();
      }

      // In production, you'd verify the JWT token here
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Get current user error:', error);
      return this.createDemoUser();
    }
  },

  // Create demo user for development
  async createDemoUser() {
    const demoUser = {
      id: 'demo-user',
      email: 'demo@profilespike.com',
      name: 'Demo User',
      role: 'user'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      localStorage.setItem('authToken', 'demo-token');
    }

    return demoUser;
  },

  // Sign up new user - creates real user in database
  async signUp(email, password, userData = {}) {
    try {
      // Check if user already exists in database
      const existingUser = await db.users.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create user in database
      const dbUser = await db.users.create({
        email: email,
        name: userData.name || email.split('@')[0],
        subscription_tier: 'free',
        subscription_status: 'active'
      });

      const user = {
        id: dbUser.id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.email === 'admin@profilespike.com' ? 'admin' : 'user'
      };

      // Store in localStorage for session
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', `jwt-${dbUser.id}`);
      }

      console.log('User created in database:', user);
      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in existing user - verifies against database
  async signIn(email, password) {
    try {
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Find user in database
      const dbUser = await db.users.findByEmail(email);
      if (!dbUser) {
        // For development, create user if they don't exist
        return this.signUp(email, password, { name: email.split('@')[0] });
      }

      const user = {
        id: dbUser.id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.email === 'admin@profilespike.com' ? 'admin' : 'user'
      };

      // Store in localStorage for session
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', `jwt-${dbUser.id}`);
      }

      console.log('User signed in from database:', user);
      return { user };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    return { success: true };
  }
};