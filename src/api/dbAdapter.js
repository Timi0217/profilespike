// Database adapter that falls back to localStorage in browser environment
import { storage, STORAGE_KEYS } from './localStorage.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

let dbModule = null;

// Dynamically import database module only in non-browser environments
if (!isBrowser) {
  try {
    dbModule = await import('./database.js');
  } catch (error) {
    console.warn('Database module not available, using localStorage fallback');
  }
}

// Create a unified interface that uses database in Node.js and localStorage in browser
export const createAdapter = (storageKey, tableName) => ({
  create: async (data) => {
    if (!isBrowser && dbModule) {
      // Use database
      return dbModule.default[tableName].create(data);
    } else {
      // Fallback to localStorage
      const items = storage.get(storageKey) || [];
      const newItem = { 
        ...data, 
        id: Date.now().toString(36) + Math.random().toString(36).substr(2), 
        created_at: new Date().toISOString() 
      };
      items.push(newItem);
      storage.set(storageKey, items);
      return Promise.resolve(newItem);
    }
  },

  findById: async (id) => {
    if (!isBrowser && dbModule) {
      return dbModule.default[tableName].findById(id);
    } else {
      const items = storage.get(storageKey) || [];
      const item = items.find(item => item.id === id);
      return Promise.resolve(item || null);
    }
  },

  filter: async (criteria = {}) => {
    if (!isBrowser && dbModule) {
      return dbModule.default[tableName].filter(criteria);
    } else {
      const items = storage.get(storageKey) || [];
      const filtered = items.filter(item => 
        Object.entries(criteria).every(([key, value]) => item[key] === value)
      );
      return Promise.resolve(filtered);
    }
  },

  update: async (id, updates) => {
    if (!isBrowser && dbModule) {
      return dbModule.default[tableName].update(id, updates);
    } else {
      const items = storage.get(storageKey) || [];
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
        storage.set(storageKey, items);
        return Promise.resolve(items[index]);
      }
      return Promise.reject(new Error('Item not found'));
    }
  },

  delete: async (id) => {
    if (!isBrowser && dbModule) {
      return dbModule.default[tableName].delete(id);
    } else {
      const items = storage.get(storageKey) || [];
      const filtered = items.filter(item => item.id !== id);
      storage.set(storageKey, filtered);
      return Promise.resolve({ success: true });
    }
  }
});

export { STORAGE_KEYS };