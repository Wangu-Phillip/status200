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

  const handleQuickDemoLogin = (role, dept = null) => {
    const isClient = role === 'client';
    const userData = isClient ? {
      name: 'John Citizen',
      email: 'citizen@example.com',
      userType: 'client',
      organization: 'None',
      department: null,
    } : {
      name: `Admin (${dept ? DEPARTMENT_LABELS[dept].split(' ')[0] : 'General'})`,
      email: `${dept || 'admin'}@bocra.org.bw`,
      userType: 'admin',
      organization: 'BOCRA',
      department: dept || DEPARTMENTS.LICENSING, 
    };
    
    localStorage.setItem('bocra_user', JSON.stringify(userData));
    
    toast({
      title: `${isClient ? 'Citizen' : 'Admin'} Login Successful`,
      description: `Welcome to the ${isClient ? 'Portal' : 'Admin Dashboard'}!`,
    });
    
    navigate(isClient ? '/dashboard' : '/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F3] py-12 px-4 sm:px-6 lg:px-8">
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
                  <Button variant="link" className="text-sm text-[#003366] hover:text-[#0A4D8C] px-0">
                    Forgot password?
                  </Button>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#003366] hover:bg-[#0A4D8C] text-white">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Demo Quick Access</p>
              <div className="flex justify-center mb-4">
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('client')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 rounded-xl font-bold py-6"
                >
                  <User className="w-5 h-5 mr-3" />
                  Citizen Portal
                </Button>
              </div>
              
              <div className="relative mt-6 mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-bold tracking-wider">
                    Staff Portals
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin', DEPARTMENTS.LICENSING)}
                  className="w-full bg-[#003366] hover:bg-[#003366] text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Licensing
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin', DEPARTMENTS.COMPLAINTS)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Complaints
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin', DEPARTMENTS.QOS)}
                  className="w-full bg-[#003366] hover:bg-[#003366] text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Quality of Service
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin', DEPARTMENTS.TENDERS)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Tenders
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                variant="link"
                className="text-[#003366] hover:text-[#0A4D8C] px-1"
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
