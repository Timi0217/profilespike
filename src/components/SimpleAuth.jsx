import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SimpleAuth = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignUp && !name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    await onLogin(email, password, isSignUp, name);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-backdrop" />
      <motion.div 
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="auth-header">
          <div className="brand-icon">PS</div>
          <div className="brand-text">
            <h1>ProfileSpike</h1>
            <p>Your AI Career Coach</p>
          </div>
        </div>

        <div className="auth-content">
          <h2>{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isSignUp 
              ? 'Join thousands of professionals advancing their careers' 
              : 'Sign in to access your AI career tools'
            }
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="auth-link"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>3 Free AI Analyses</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Instant Results</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .auth-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
        }

        .auth-modal {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 0;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .auth-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .brand-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
        }

        .brand-text h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .brand-text p {
          font-size: 14px;
          opacity: 0.9;
          margin: 2px 0 0 0;
        }

        .auth-content {
          padding: 32px;
        }

        .auth-content h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .auth-subtitle {
          font-size: 16px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-input {
          padding: 16px 20px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .auth-button {
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-button.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .auth-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-switch {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-switch span {
          color: #6b7280;
          font-size: 14px;
        }

        .auth-link {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-weight: 600;
          margin-left: 4px;
          font-family: inherit;
        }

        .auth-features {
          display: flex;
          justify-content: space-around;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .feature-icon {
          font-size: 16px;
          color: #667eea;
        }
      `}</style>
    </div>
  );
};

export default SimpleAuth;