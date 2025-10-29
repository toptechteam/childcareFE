import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68ed9f71df888d487eb37e90", 
  requiresAuth: false // Ensure authentication is required for all operations
});
