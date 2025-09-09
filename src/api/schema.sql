-- ProfileSpike Database Schema
-- Based on localStorage structure analysis

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  referral_code VARCHAR(20) UNIQUE,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  "current_role" VARCHAR(255),
  experience_level VARCHAR(50),
  skills JSONB DEFAULT '[]',
  goals JSONB DEFAULT '[]',
  location VARCHAR(255),
  industry VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analyses table (resume, LinkedIn, etc.)
CREATE TABLE IF NOT EXISTS analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'resume', 'linkedin', 'portfolio', etc.
  content TEXT,
  result JSONB,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved insights table
CREATE TABLE IF NOT EXISTS saved_insights (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  source_analysis_id INTEGER REFERENCES analyses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning plans table
CREATE TABLE IF NOT EXISTS learning_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skills_to_learn JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Career paths table
CREATE TABLE IF NOT EXISTS career_paths (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  "current_role" VARCHAR(255),
  target_role VARCHAR(255),
  path_content TEXT,
  timeline_months INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Compensation analyses table
CREATE TABLE IF NOT EXISTS compensation_analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  location VARCHAR(255),
  experience_level VARCHAR(50),
  analysis_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email templates table (for admin use)
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  subject VARCHAR(500),
  html_content TEXT,
  variables JSONB DEFAULT '[]', -- List of template variables
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table (for help center)
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses(type);
CREATE INDEX IF NOT EXISTS idx_saved_insights_user_id ON saved_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_career_paths_user_id ON career_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_compensation_analyses_user_id ON compensation_analyses(user_id);