import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { Mail, Lock, User, Building2, Shield } from 'lucide-react';
import { DEPARTMENTS, DEPARTMENT_LABELS } from '../utils/persistence';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organization: '',
    userType: 'client',
    department: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login/register - will be replaced with actual API call
    const userData = {
      name: formData.name || 'John Doe',
      email: formData.email,
      userType: formData.userType,
      organization: formData.organization,
      department: formData.userType === 'admin' ? formData.department : null,
    };
    localStorage.setItem('bocra_user', JSON.stringify(userData));
    
    toast({
      title: isLogin ? 'Login Successful' : 'Registration Successful',
      description: `Welcome ${userData.name}!`,
    });
    
    // Redirect based on user type
    if (formData.userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login - will be replaced with actual OAuth
    toast({
      title: 'Google Login',
      description: 'Google OAuth integration coming soon!',
    });
  };

  const handleQuickDemoLogin = (role) => {
    const isClient = role === 'client';
    const userData = isClient ? {
      name: 'John Citizen',
      email: 'citizen@example.com',
      userType: 'client',
      organization: 'None',
      department: null,
    } : {
      name: 'Admin User',
      email: 'admin@bocra.org.bw',
      userType: 'admin',
      organization: 'BOCRA',
      department: DEPARTMENTS.LICENSING, 
    };
    
    localStorage.setItem('bocra_user', JSON.stringify(userData));
    
    toast({
      title: `${isClient ? 'Citizen' : 'Admin'} Login Successful`,
      description: `Welcome to the ${isClient ? 'Portal' : 'Admin Dashboard'}!`,
    });
    
    navigate(isClient ? '/dashboard' : '/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">BOCRA Client Portal</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Create a new account to access BOCRA services'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      placeholder="Your Company Ltd"
                      value={formData.organization}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {isLogin && (
                <div className="flex items-center justify-end">
                  <Button variant="link" className="text-sm text-teal-600 hover:text-teal-700 px-0">
                    Forgot password?
                  </Button>
                </div>
              )}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Demo Quick Access</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('client')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 rounded-xl font-bold"
                >
                  <User className="w-4 h-4 mr-2" />
                  Citizen
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-500/20 rounded-xl font-bold"
                >
                  <Shield className="w-4 h-4 mr-2 text-teal-100" />
                  Admin
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                variant="link"
                className="text-teal-600 hover:text-teal-700 px-1"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to BOCRA's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
