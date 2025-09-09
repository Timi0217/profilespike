import { Client } from 'pg';

// Database connection utility - only works in Node.js environment
let client = null;

const getDbClient = async () => {
  // Only create database connection if we're in Node.js (not browser)
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available in browser environment');
  }

  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: false
    });
    await client.connect();
  }
  return client;
};

// Close database connection
export const closeDb = async () => {
  if (client) {
    await client.end();
    client = null;
  }
};

// Generic database operations
export const db = {
  query: async (text, params = []) => {
    const dbClient = await getDbClient();
    return dbClient.query(text, params);
  },
  
  // Users table operations
  users: {
    create: async (userData) => {
      const { email, name, referral_code, password_hash, subscription_tier, subscription_status } = userData;
      const result = await db.query(
        `INSERT INTO users (email, name, referral_code, password_hash, subscription_tier, subscription_status, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         RETURNING *`,
        [email, name, referral_code, password_hash, subscription_tier || 'free', subscription_status || 'active']
      );
      return result.rows[0];
    },
    
    findByEmail: async (email) => {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    },
    
    findById: async (id) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    },
    
    update: async (id, updates) => {
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      const result = await db.query(
        `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    }
  },

  // User profiles table operations
  userProfiles: {
    create: async (profileData) => {
      const { user_id, current_role, experience_level, skills, goals } = profileData;
      const result = await db.query(
        `INSERT INTO user_profiles (user_id, current_role, experience_level, skills, goals, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW()) 
         RETURNING *`,
        [user_id, current_role, experience_level, JSON.stringify(skills), JSON.stringify(goals)]
      );
      return result.rows[0];
    },
    
    findByUserId: async (userId) => {
      const result = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
      return result.rows[0] || null;
    },
    
    update: async (id, updates) => {
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      const result = await db.query(
        `UPDATE user_profiles SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    }
  },

  // Analyses table operations
  analyses: {
    create: async (analysisData) => {
      const { user_id, type, content, result } = analysisData;
      const dbResult = await db.query(
        `INSERT INTO analyses (user_id, type, content, result, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING *`,
        [user_id, type, content, JSON.stringify(result)]
      );
      return dbResult.rows[0];
    },
    
    findByUserId: async (userId, type = null) => {
      let query = 'SELECT * FROM analyses WHERE user_id = $1';
      let params = [userId];
      
      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }
      
      query += ' ORDER BY created_at DESC';
      const result = await db.query(query, params);
      return result.rows;
    }
  },

  // Saved insights table operations
  savedInsights: {
    create: async (insightData) => {
      const { user_id, insight_type, content, source_analysis_id } = insightData;
      const result = await db.query(
        `INSERT INTO saved_insights (user_id, insight_type, content, source_analysis_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING *`,
        [user_id, insight_type, JSON.stringify(content), source_analysis_id]
      );
      return result.rows[0];
    },
    
    findByUserId: async (userId) => {
      const result = await db.query(
        'SELECT * FROM saved_insights WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    },
    
    delete: async (id, userId) => {
      const result = await db.query(
        'DELETE FROM saved_insights WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      return result.rows[0];
    }
  },

  // Learning plans table operations
  learningPlans: {
    create: async (planData) => {
      const { user_id, title, description, skills_to_learn, timeline } = planData;
      const result = await db.query(
        `INSERT INTO learning_plans (user_id, title, description, skills_to_learn, timeline, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW()) 
         RETURNING *`,
        [user_id, title, description, JSON.stringify(skills_to_learn), JSON.stringify(timeline)]
      );
      return result.rows[0];
    },
    
    findByUserId: async (userId) => {
      const result = await db.query(
        'SELECT * FROM learning_plans WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    }
  }
};

export default db;