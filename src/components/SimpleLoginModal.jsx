import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const SimpleLoginModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login delay for polished feel
    setTimeout(async () => {
      try {
        await signIn(email);
        onClose();
        navigate('/dashboard');
      } catch (error) {
        alert('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        padding: '48px',
        borderRadius: '24px',
        maxWidth: '440px',
        width: '90%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        transform: isOpen ? 'scale(1)' : 'scale(0.9)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          marginBottom: '16px', 
          color: '#1a1a1a',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          Welcome to ProfileSpike
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '32px',
          fontSize: '18px',
          fontWeight: '400'
        }}>
          Sign in to access your AI career coach
        </p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              marginBottom: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '16px',
              fontWeight: '400',
              backgroundColor: 'rgba(255,255,255,0.8)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0,0,0,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: '#374151',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                flex: 1,
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.04)'}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                flex: 1,
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(102,126,234,0.3)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
                }
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};