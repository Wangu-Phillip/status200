import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Settings, User, Bell, Shield, Key, Eye, Play, Trash2, LogOut, ChevronRight, 
  CheckCircle, Globe, Palette, Sliders, AlertTriangle, Loader2, Save, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import * as api from '../../services/api';

const SettingsView = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [preferencesData, setPreferencesData] = useState({
    darkMode: true,
    compactLayout: false,
    highContrast: false,
    emailNotifications: true,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile();
      setUser(data);
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        organization: data.organization || '',
      });
      // Load preferences from localStorage
      const saved = localStorage.getItem('bocra_preferences');
      if (saved) setPreferencesData(JSON.parse(saved));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateUserProfile(profileData);
      alert('Profile updated successfully!');
      await fetchUserProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferencesData, [key]: value };
    setPreferencesData(updated);
    localStorage.setItem('bocra_preferences', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    localStorage.removeItem('bocra_token');
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate inputs
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      await api.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const replayTour = () => {
    localStorage.removeItem('bocra_tour_seen');
    window.location.reload();
  };

  const [preferences, setPreferences] = useState([
    { id: 'dark_mode', label: 'Dark Mode (Dashdark-X)', desc: 'Optimized for high-contrast visibility and reduced eye strain', active: true },
    { id: 'compact', label: 'Compact Layout', desc: 'Fits more information into the active dashboard area', active: false },
    { id: 'high_contrast', label: 'High Contrast Mode', desc: 'Enhanced accessibility for users with visual impairments', active: false }
  ]);
  const { toast } = useToast();

  const togglePreference = (id) => {
    setPreferences(prev => prev.map(p => {
      if (p.id === id) {
        const newState = !p.active;
        toast({
          title: `${p.label} ${newState ? 'Enabled' : 'Disabled'}`,
          description: `Interface preference updated successfully.`
        });
        return { ...p, active: newState };
      }
      return p;
    }));
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'preferences', icon: Sliders, label: 'Interface' },
  ];

  const renderActiveTab = () => {
    switch (activeSubTab) {
      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-100 flex items-center mb-8">
                <Bell className="w-5 h-5 mr-3 text-blue-500" />
                Notification Preferences
              </h3>
              <div className="space-y-6">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Critical alerts sent to your phone' },
                  { id: 'push', label: 'Browser Notifications', desc: 'Real-time web notifications' }
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-6 bg-slate-900/30 rounded-3xl border border-[#1e293b] hover:border-[#334155] transition-all">
                    <div>
                      <p className="font-bold text-slate-200">{pref.label}</p>
                      <p className="text-slate-500 text-sm mt-1">{pref.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer bg-[#003366]`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg left-7`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Palette className="w-5 h-5 mr-3 text-purple-500" />
                  Interface Preferences
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  { key: 'darkMode', label: 'Dark Mode (Dashdark-X)', desc: 'Optimized for high-contrast visibility and reduced eye strain' },
                  { key: 'compactLayout', label: 'Compact Layout', desc: 'Fits more information into the active dashboard area' },
                  { key: 'highContrast', label: 'High Contrast Mode', desc: 'Enhanced accessibility for users with visual impairments' }
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-6 bg-slate-900/30 rounded-3xl border border-[#1e293b] hover:border-[#334155] transition-all">
                    <div className="max-w-md">
                      <p className="font-bold text-slate-200">{pref.label}</p>
                      <p className="text-slate-500 text-sm mt-1">{pref.desc}</p>
                    </div>
                    <div 
                      onClick={() => handlePreferenceChange(pref.key, !preferencesData[pref.key])}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${preferencesData[pref.key] ? 'bg-[#003366]' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${preferencesData[pref.key] ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0099CC]/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Key className="w-5 h-5 mr-3 text-blue-500" />
                  Change Password
                </h3>
              </div>
              <div className="space-y-6 relative">
                {!showPasswordForm ? (
                  <div className="p-6 bg-slate-900/50 border border-[#1e293b] rounded-3xl flex items-center justify-between group hover:border-[#334155] transition-all">
                    <div className="flex-1">
                      <p className="font-bold text-slate-200 mb-2">Update Your Password</p>
                      <p className="text-slate-500 text-sm">Secure your account with a strong password</p>
                    </div>
                    <Button 
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-8 py-3 text-white font-bold ml-4 flex-shrink-0"
                    >
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="p-8 bg-slate-900/30 border border-[#1e293b] rounded-3xl space-y-6">
                    {passwordError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <p className="text-rose-400 text-sm font-medium">{passwordError}</p>
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-400 text-sm font-medium">{passwordSuccess}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordData.currentPassword} 
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter your current password"
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.newPassword} 
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter a new password (min. 8 characters)"
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.confirmPassword} 
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm your new password"
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex gap-4 justify-end pt-6 border-t border-[#1e293b]">
                      <Button 
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        variant="outline" 
                        className="rounded-xl px-8 py-3"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-500 rounded-xl px-8 py-3 text-white font-bold flex items-center"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </section>
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-teal-500" />
                  Authentication Protocol
                </h3>
                <Badge className="bg-[#6DC04B]/10 text-[#4E9933] border-none font-bold uppercase tracking-widest text-[10px]">Active: JWT (RS256)</Badge>
              </div>
              <div className="space-y-6 relative">
                <div className="p-6 bg-slate-900/50 border border-[#1e293b] rounded-3xl">
                  <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-slate-200">Session Token Rotation</p>
                     <span className="text-[10px] text-[#0099CC] font-bold bg-[#0099CC]/5 px-2 py-1 rounded-lg">ENABLED</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">Your portal session uses stateless JSON Web Tokens (JWT) with automatic 15-minute rotation for maximum security.</p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-[#1e293b] rounded-3xl">
                  <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-slate-200">Active Sessions</p>
                     <span className="text-[10px] text-slate-500 font-bold">1 DEVICE</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#0099CC]/10 rounded-lg flex items-center justify-center text-[#0099CC]">
                           <Globe className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-300">Chrome on Windows</p>
                           <p className="text-[10px] text-slate-600 uppercase font-bold">Current Session</p>
                        </div>
                     </div>
                     <Button variant="ghost" className="text-xs text-slate-500 hover:text-slate-400 font-bold">Active</Button>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-[#334155] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center">
                    <Key className="w-5 h-5 mr-3 text-blue-500" />
                    Two-Factor (2FA)
                  </h3>
                  <div className="w-1.5 h-1.5 bg-[#6DC04B] rounded-full"></div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Protected by SMS-based verification (+267 •••• 124). Switch to Authenticator App for higher security.</p>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-[#1e293b] bg-transparent hover:bg-blue-500/5 text-slate-300 hover:text-blue-400 font-bold text-sm shadow-inner transition-all" onClick={() => toast({title: "Redirecting", description: "Loading secure 2FA management portal."})}>
                  Modify 2FA Settings
                </Button>
              </div>
              <div className="bg-[#0a0f1e] border border-rose-500/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center">
                    <Trash2 className="w-5 h-5 mr-3 text-rose-500" />
                    Archive Data
                  </h3>
                  <AlertTriangle className="w-5 h-5 text-rose-500/20" />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Permanently wipe your regulatory record archive from the system portal.</p>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-rose-500/20 bg-transparent hover:bg-rose-500/10 text-rose-500/50 hover:text-rose-500 font-bold text-sm shadow-inner transition-all" onClick={() => toast({title: "Access Denied", description: "You must contact the DPO to initiate data wiping.", variant: "destructive"})}>
                  Wipe Records
                </Button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-10 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Bell className="w-5 h-5 mr-3 text-amber-500" />
                  Alert Channels
                </h3>
                <Badge className="bg-amber-500/10 text-amber-500 border-none font-bold uppercase tracking-widest text-[10px]">Configured</Badge>
              </div>
              <div className="space-y-6 relative">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Detailed regulatory updates and license renewal alerts' },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Urgent system messages and security codes' },
                  { id: 'push', label: 'Browser Push', desc: 'Instant desktop alerts for application status changes' }
                ].map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-6 bg-slate-900/30 rounded-3xl border border-[#1e293b] hover:border-[#334155] transition-all">
                    <div className="max-w-md">
                      <p className="font-bold text-slate-200">{channel.label}</p>
                      <p className="text-slate-500 text-sm mt-1">{channel.desc}</p>
                    </div>
                    <div 
                      onClick={() => toast({ title: "Alert Profile Updated", description: `${channel.label} setting has been synchronized.` })}
                      className="w-12 h-6 rounded-full relative transition-all cursor-pointer bg-[#003366]"
                    >
                      <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg left-7"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'profile':
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0099CC]/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-10 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Play className="w-5 h-5 mr-3 text-[#0099CC] fill-teal-500/20" />
                  Quick Onboarding
                </h3>
                <Badge className="bg-[#0099CC]/10 text-[#0099CC] border-none font-bold uppercase tracking-widest text-[10px]">Portal Help</Badge>
              </div>
              <div className="flex items-start justify-between bg-slate-900/50 border border-[#1e293b] p-8 rounded-3xl group-hover:bg-slate-900 group-hover:border-[#0099CC]/30 transition-all cursor-pointer relative overflow-hidden" onClick={replayTour}>
                 <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#0099CC]/5 rounded-full blur-2xl group-hover:bg-[#0099CC]/10 transition-all"></div>
                 <div className="flex-1 max-w-lg relative">
                    <p className="font-bold text-slate-200 text-lg">Replay Portal Tour</p>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">Want a refresher? This will reset your first-login tour and guides will walk you through portal features again.</p>
                 </div>
                 <div className="w-14 h-14 bg-[#0099CC]/10 rounded-2xl flex items-center justify-center text-[#0099CC] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all">
                    <Play className="w-6 h-6 fill-teal-400" />
                 </div>
              </div>
            </section>

            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0099CC]/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center mb-8 relative">
                <User className="w-5 h-5 mr-3 text-[#0099CC]" />
                Profile Information
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0099CC]" />
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6 relative">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email} 
                        disabled
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-500 text-sm opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-3">Organization</label>
                      <input 
                        type="text" 
                        value={profileData.organization} 
                        onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                        className="w-full bg-slate-900/50 border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end pt-6 border-t border-[#1e293b]">
                    <Button variant="outline" className="rounded-xl px-8 py-3">Cancel</Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-[#003366] hover:bg-[#0099CC] rounded-xl px-8 py-3 text-white font-bold flex items-center"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Console Settings</h2>
          <p className="text-slate-500 mt-2 leading-relaxed">Manage your citizen profile, security preferences, and dashboard interface.</p>
        </div>
        <div className="flex items-center space-x-3">
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 max-w-md">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Confirm Logout</h3>
                <p className="text-slate-500 mb-6">Are you sure you want to log out?</p>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="rounded-xl">Cancel</Button>
                  <Button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-500 rounded-xl text-white">Logout</Button>
                </div>
              </div>
            </div>
          )}
          <Button 
            onClick={() => setShowLogoutConfirm(true)}
            variant="outline" 
            className="rounded-2xl border-[#1e293b] bg-[#0a0f1e] hover:bg-rose-500/10 hover:text-rose-400 group h-12 px-6 font-bold shadow-xl transition-all"
          >
             <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
             Log Out
          </Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-2 lg:col-span-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group font-bold text-sm ${
                activeSubTab === item.id 
                  ? 'bg-[#003366]/10 text-[#0099CC] border border-[#003366]/20 shadow-lg shadow-[#0099CC]/5' 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent hover:border-[#1e293b]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === item.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </aside>
        <main className="lg:col-span-3">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default SettingsView;
