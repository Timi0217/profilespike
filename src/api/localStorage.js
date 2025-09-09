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
  CAREER_PATHS: 'profilespike_career_paths',
  UPLOADED_FILES: 'profilespike_uploaded_files'
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
    const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
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
      items[index] = { ...items[index], ...updates, updated_date: new Date().toISOString() };
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
  },

  // Add soft delete functionality for historical data
  softDelete: (id) => {
    const items = storage.get(storageKey) || [];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], deleted_at: new Date().toISOString(), is_active: false };
      storage.set(storageKey, items);
      return Promise.resolve(items[index]);
    }
    return Promise.reject(new Error('Item not found'));
  },

  // Filter active items (not soft deleted)
  filterActive: (criteria = {}) => {
    const items = storage.get(storageKey) || [];
    const filtered = items.filter(item => 
      !item.deleted_at && 
      Object.entries(criteria).every(([key, value]) => item[key] === value)
    );
    return Promise.resolve(filtered);
  }
});

// File storage utilities for resume uploads
const fileStorage = {
  // Store file as base64 in localStorage
  storeFile: async (file, userId) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileData = {
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result, // Base64 encoded file
            uploaded_by: userId,
            uploaded_date: new Date().toISOString()
          };
          
          const files = storage.get(STORAGE_KEYS.UPLOADED_FILES) || [];
          files.push(fileData);
          storage.set(STORAGE_KEYS.UPLOADED_FILES, files);
          
          resolve(fileData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  // Get file by ID
  getFile: async (fileId) => {
    const files = storage.get(STORAGE_KEYS.UPLOADED_FILES) || [];
    return files.find(f => f.id === fileId) || null;
  },

  // Get files by user
  getUserFiles: async (userId) => {
    const files = storage.get(STORAGE_KEYS.UPLOADED_FILES) || [];
    return files.filter(f => f.uploaded_by === userId && !f.deleted_at);
  }
};

export { STORAGE_KEYS, storage, createEntity, fileStorage };