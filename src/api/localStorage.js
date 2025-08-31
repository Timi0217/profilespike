// Local storage utilities for managing user data
const STORAGE_KEYS = {
  USER: 'profilespike_user',
  USER_PROFILE: 'profilespike_user_profile',
  ANALYSES: 'profilespike_analyses',
  SAVED_INSIGHTS: 'profilespike_saved_insights',
  LEARNING_PLANS: 'profilespike_learning_plans',
  ARTICLES: 'profilespike_articles',
  EMAIL_TEMPLATES: 'profilespike_email_templates',
  COMPENSATION_ANALYSES: 'profilespike_compensation_analyses',
  CAREER_PATHS: 'profilespike_career_paths'
};

// Helper to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Generic storage operations
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Generic entity factory
const createEntity = (storageKey) => ({
  create: (data) => {
    const items = storage.get(storageKey) || [];
    const newItem = { ...data, id: generateId(), created_at: new Date().toISOString() };
    items.push(newItem);
    storage.set(storageKey, items);
    return Promise.resolve(newItem);
  },
  
  filter: (criteria = {}) => {
    const items = storage.get(storageKey) || [];
    const filtered = items.filter(item => 
      Object.entries(criteria).every(([key, value]) => item[key] === value)
    );
    return Promise.resolve(filtered);
  },
  
  update: (id, updates) => {
    const items = storage.get(storageKey) || [];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
      storage.set(storageKey, items);
      return Promise.resolve(items[index]);
    }
    return Promise.reject(new Error('Item not found'));
  },
  
  delete: (id) => {
    const items = storage.get(storageKey) || [];
    const filtered = items.filter(item => item.id !== id);
    storage.set(storageKey, filtered);
    return Promise.resolve({ success: true });
  },
  
  findById: (id) => {
    const items = storage.get(storageKey) || [];
    const item = items.find(item => item.id === id);
    return Promise.resolve(item || null);
  }
});

export { STORAGE_KEYS, storage, createEntity };