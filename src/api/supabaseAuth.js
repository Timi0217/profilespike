import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication service
export const authService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    return user;
  },

  // Sign up with email/password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email/password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth (Google, GitHub, etc.)
  async signInWithOAuth(provider = 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      return null;
    }
    return session;
  }
};

// User management with Supabase
export const UserService = {
  // Create user profile after signup
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    return data;
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Get or create user record
  async getOrCreateUser(authUser) {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .single();
      
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user if doesn't exist
    if (fetchError && fetchError.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (createError) throw createError;
      return newUser;
    }
    
    throw fetchError;
  }
};