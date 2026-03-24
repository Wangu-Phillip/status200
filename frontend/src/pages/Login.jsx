import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Mail, Lock, User, Building2, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, DEPARTMENT_LABELS } from '../utils/persistence';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);
        toast({
          title: 'Login Successful',
          description: `Welcome back!`,
        });
        // Redirect based on stored user type
        const storedUser = JSON.parse(localStorage.getItem('bocra_user'));
        if (storedUser?.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Register
        await register(
          formData.email,
          formData.password,
          formData.name,
          formData.userType,
          formData.organization,
          formData.userType === 'admin' ? formData.department : null
        );
        toast({
          title: 'Registration Successful',
          description: `Welcome ${formData.name}!`,
        });
        // Redirect based on user type
        if (formData.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (email, password, role, dept = null) => {
    try {
      await login(email, password);
      const isClient = role === 'client';
      toast({
        title: `${isClient ? 'Citizen' : 'Admin'} Login Successful`,
        description: `Welcome to the ${isClient ? 'Citizen Portal' : 'Admin Dashboard'}!`,
      });
      navigate(isClient ? '/dashboard' : '/admin');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
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
                        disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">Account Type</Label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500"
                      disabled={isSubmitting}
                    >
                      <option value="client">Citizen</option>
                      <option value="admin">Admin Staff</option>
                    </select>
                  </div>
                  {formData.userType === 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Department</option>
                        <option value="licensing">Licensing</option>
                        <option value="complaints">Complaints</option>
                        <option value="qos">Quality of Service</option>
                        <option value="tenders">Tenders</option>
                      </select>
                    </div>
                  )}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isSubmitting || authLoading}
              >
                {isSubmitting || authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Demo Quick Access</p>
              <div className="flex justify-center mb-4">
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('citizen@example.com', 'demo123456', 'client')}
                  disabled={isSubmitting || authLoading}
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
                  onClick={() => handleQuickDemoLogin('licensing@bocra.org.bw', 'admin123456', 'admin', 'licensing')}
                  disabled={isSubmitting || authLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Licensing
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('complaints@bocra.org.bw', 'admin123456', 'admin', 'complaints')}
                  disabled={isSubmitting || authLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Complaints
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('qos@bocra.org.bw', 'admin123456', 'admin', 'qos')}
                  disabled={isSubmitting || authLoading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white shadow-md rounded-xl font-semibold text-xs py-5"
                >
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Quality of Service
                </Button>
                <Button
                  type="button"
                  onClick={() => handleQuickDemoLogin('tenders@bocra.org.bw', 'admin123456', 'admin', 'tenders')}
                  disabled={isSubmitting || authLoading}
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
                className="text-teal-600 hover:text-teal-700 px-1"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
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
