import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID || "688805d1d5aacbdc373f389a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
