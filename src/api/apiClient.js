// API client for frontend to make requests to backend endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = localStorage.getItem('authToken');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        },
        ...options
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // User operations
  async createUser(userData) {
    return this.makeRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getUserByEmail(email) {
    return this.makeRequest(`/api/users/email/${encodeURIComponent(email)}`);
  }

  async getUserById(id) {
    return this.makeRequest(`/api/users/${id}`);
  }

  // Profile operations
  async createProfile(profileData) {
    return this.makeRequest('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  }

  async getProfileByEmail(email) {
    return this.makeRequest(`/api/profiles/email/${encodeURIComponent(email)}`);
  }

  async updateProfile(id, updates) {
    return this.makeRequest(`/api/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Analysis operations
  async createAnalysis(analysisData) {
    return this.makeRequest('/api/analyses', {
      method: 'POST',
      body: JSON.stringify(analysisData)
    });
  }

  async getAnalysis(id) {
    return this.makeRequest(`/api/analyses/${id}`);
  }

  async updateAnalysis(id, updates) {
    return this.makeRequest(`/api/analyses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async getAnalysesByEmail(email) {
    return this.makeRequest(`/api/analyses/email/${encodeURIComponent(email)}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;