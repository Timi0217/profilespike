import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/api/auth';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user } = await authService.signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        onClose();
        if (onSuccess) onSuccess(); // Trigger auth refetch
        navigate(createPageUrl('Dashboard'));
      } else {
        const { user } = await authService.signUp(formData.email, formData.password, {
          name: formData.name
        });
        toast.success('Account created successfully!');
        onClose();
        if (onSuccess) onSuccess(); // Trigger auth refetch
        navigate(createPageUrl('Onboarding'));
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" 
                alt="ProfileSpike" 
                className="w-10 h-10 rounded-xl"
              />
            </div>
            <h1 className="text-3xl font-thin text-black mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-gray-500 font-light">
              {isLogin ? 'Sign in to continue your journey' : 'Create your account'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-14 bg-gray-50/80 border-0 rounded-2xl px-6 text-lg placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 bg-gray-50/80 border-0 rounded-2xl px-6 text-lg placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-14 bg-gray-50/80 border-0 rounded-2xl px-6 text-lg placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-2xl font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-8" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center mt-8">
            <button
              type="button"
              className="text-gray-500 font-light hover:text-black transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "New to ProfileSpike? Create account" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};