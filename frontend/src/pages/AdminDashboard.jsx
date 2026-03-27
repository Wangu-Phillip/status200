import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import UserForm from '../components/admin/UserForm';
import UserList from '../components/admin/UserList';
import UserModal from '../components/admin/UserModal';
import TenderDetailModal from '../components/TenderDetailModal';
import AdminLicensingView from '../components/admin/AdminLicensingView';

import { 
  FileText, 
  Users, 
  Shield, 
  Settings as SettingsIcon, 
  LogOut, 
  Search, 
  Bell, 
  User as UserIcon,
  Filter,
  ArrowRight,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Menu,
  X as XIcon,
  RefreshCcw,
  LayoutDashboard,
  CheckCheck,
  Send,
  Eye,
  Zap,
  MessageSquare,
  BarChart3,
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Hash,
  Activity as ActivityIcon,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Database,
  ShieldCheck,
  Download
} from 'lucide-react';

import * as adminApi from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const DEPARTMENTS = {
  LICENSING: 'licensing',
  COMPLAINTS: 'complaints',
  TENDERS: 'tenders',
  QOS: 'qos'
};

const DEPARTMENT_LABELS = {
  [DEPARTMENTS.LICENSING]: '🛡️ Licensing & Type Approval',
  [DEPARTMENTS.COMPLAINTS]: '⚖️ Complaints & Consumer Protection',
  [DEPARTMENTS.QOS]: '📊 QoS Monitoring',
  [DEPARTMENTS.TENDERS]: '💼 Tender Management'
};

const DEPARTMENT_COLORS = {
  [DEPARTMENTS.LICENSING]: { bg: 'bg-[#003366]', text: 'text-[#003366]', light: 'bg-[#E8F0F9]' },
  [DEPARTMENTS.COMPLAINTS]: { bg: 'bg-[#B22222]', text: 'text-[#B22222]', light: 'bg-[#F9E8E8]' },
  [DEPARTMENTS.QOS]: { bg: 'bg-[#006400]', text: 'text-[#006400]', light: 'bg-[#E8F9E8]' },
  [DEPARTMENTS.TENDERS]: { bg: 'bg-[#DAA520]', text: 'text-[#DAA520]', light: 'bg-[#F9F4E8]' }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'submissions', 'users', 'applications', 'settings', 'licensing'
  
  // Dashboard & Stats
  const [stats, setStats] = useState({});
  const [departmentStats, setDepartmentStats] = useState({
    licensing: { total: 0, pending: 0, approved: 0, rejected: 0 },
    complaints: { total: 0, pending: 0, approved: 0, rejected: 0 },
    tenders: { total: 0, pending: 0, approved: 0, rejected: 0 },
    qos: { total: 0, pending: 0, approved: 0, rejected: 0 },
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  
  // Data Loading
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Content State
  const [submissions, setSubmissions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [users, setUsers] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedTenderDetail, setSelectedTenderDetail] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [lastInactivityCheck, setLastInactivityCheck] = useState(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);

  // Management State
  const [tenderView, setTenderView] = useState('submissions'); // 'submissions' or 'postings'
  const [tenderPostings, setTenderPostings] = useState([]);
  const [tenderPostingsLoading, setTenderPostingsLoading] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [editingTender, setEditingTender] = useState(null);
  const [tenderDocumentsLoading, setTenderDocumentsLoading] = useState(false);
  const [formDocuments, setFormDocuments] = useState([]);
  const [formData, setFormData] = useState({
    tenderNumber: '',
    title: '',
    category: '',
    closingDate: '',
    estimatedValue: '',
    location: '',
    description: '',
  });
  const [documentsToDeleteAfterSave, setDocumentsToDeleteAfterSave] = useState([]);

  // System Settings State (for superadmin)
  const [settings, setSettings] = useState({
    siteName: 'BOCRA Portal',
    supportEmail: 'support@bocra.org.bw',
    maintenanceMode: false,
    registrationEnabled: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    emailNotifications: true,
    autoBackup: true,
    darkMode: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('bocra_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Initial data load
    if (parsedUser.adminLevel === 'superadmin') {
      loadSystemStats();
      loadUsers();
      loadAllApplications();
      loadActivities();
      loadSettings();
    } else {
      refreshData(parsedUser);
      loadActivities();
    }

    // Inactivity listener
    const resetTimer = () => setLastInactivityCheck(Date.now());
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [navigate]);

  useEffect(() => {
    const checkTimer = setInterval(() => {
      const inactiveMinutes = (Date.now() - lastInactivityCheck) / 1000 / 60;
      if (inactiveMinutes >= sessionTimeoutMinutes) {
        handleLogout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive"
        });
      }
    }, 60000); // Check every minute
    return () => clearInterval(checkTimer);
  }, [lastInactivityCheck, sessionTimeoutMinutes]);

  useEffect(() => {
    if (activeView === 'submissions' && user?.department === 'tenders' && tenderView === 'postings') {
      loadTenderPostings();
    }
  }, [activeView, tenderView, user?.department]);

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await adminApi.getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await adminApi.getActivityLogs({ limit: 5 });
      setRecentActivities(data.logs || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const loadAllActivities = async () => {
    try {
      const data = await adminApi.getActivityLogs({ limit: 50 });
      setAllActivities(data.logs || []);
    } catch (error) {
       console.error('Failed to load all activities:', error);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const token = localStorage.getItem('bocra_token');
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const licensingStats = await adminApi.getAdminStats('licensing');
      const complaintsStats = await adminApi.getAdminStats('complaints');
      const tendersStats = await adminApi.getAdminStats('tenders');
      const qosStats = await adminApi.getAdminStats('qos');

      setDepartmentStats({
        licensing: licensingStats,
        complaints: complaintsStats,
        tenders: tendersStats,
        qos: qosStats
      });
    } catch (error) {
      console.error('Failed to load system stats:', error);
    }
  };

  const loadAllApplications = async () => {
    setSubmissionsLoading(true);
    try {
      let allApps = [];
      const depts = ['licensing', 'complaints', 'tenders'];
      for (const dept of depts) {
        const data = await adminApi.getSubmissions({ department: dept, page: 1, limit: 100 });
        if (data.submissions) allApps = [...allApps, ...data.submissions];
      }
      setAllApplications(allApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const refreshData = async (currentUser = user) => {
    if (!currentUser) return;
    setSubmissionsLoading(true);
    try {
      const dept = currentUser.department;
      if (!dept) return;

      const submissionsData = await adminApi.getSubmissions({ department: dept, page: 1, limit: 100 });
      
      if (dept === DEPARTMENTS.LICENSING) setSubmissions(submissionsData.submissions || []);
      else if (dept === DEPARTMENTS.COMPLAINTS) setComplaints(submissionsData.submissions || []);
      else if (dept === DEPARTMENTS.TENDERS) setTenders(submissionsData.submissions || []);
      
      const statsData = await adminApi.getAdminStats(dept);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const loadTenderPostings = async () => {
    setTenderPostingsLoading(true);
    try {
      const data = await adminApi.getTenderPostings();
      setTenderPostings(data.tenders || []);
    } catch (error) {
      console.error('Failed to load tender postings:', error);
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleStatusChange = async (token, newStatus) => {
    try {
      setSubmissionsLoading(true);
      await adminApi.updateSubmissionStatus(token, newStatus);
      await refreshData();
      if (user?.adminLevel === 'superadmin') await loadAllApplications();
      setSelectedSubmission(null);
      toast({
        title: "Status Updated",
        description: `Item ${token} has been moved to ${newStatus}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleAddNote = async (token) => {
    if (!adminNote.trim()) return;
    try {
      setSubmissionsLoading(true);
      await adminApi.addSubmissionNotes(token, adminNote);
      setAdminNote('');
      await refreshData();
      if (user?.adminLevel === 'superadmin') await loadAllApplications();
      setSelectedSubmission(null);
      toast({
        title: "Note Added",
        description: `Internal admin note saved for ${token}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    localStorage.removeItem('bocra_token');
    navigate('/login');
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      await adminApi.updateSystemSettings(settings);
      toast({ title: "Settings Saved", description: "System configuration updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSettingsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Approved': { className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500', icon: CheckCircle },
      'Under Review': { className: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500', icon: Clock },
      'Pending Review': { className: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500', icon: Clock },
      'Rejected': { className: 'bg-rose-500/10 text-rose-500 border-rose-500/20', dot: 'bg-rose-500', icon: XCircle }
    };
    const c = config[status] || config['Pending Review'];
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${c.className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`}></span>
        {status}
      </div>
    );
  };

  const getActiveData = () => {
    if (user?.department === 'complaints') return complaints;
    if (user?.department === 'tenders') return tenders;
    return submissions;
  };

  const activeData = getActiveData();

  if (!user) return null;

  const DeptIcon = {
    [DEPARTMENTS.LICENSING]: Zap,
    [DEPARTMENTS.COMPLAINTS]: MessageSquare,
    [DEPARTMENTS.TENDERS]: Briefcase,
    [DEPARTMENTS.QOS]: BarChart3
  }[user.department] || Shield;

  const deptColor = DEPARTMENT_COLORS[user.department] || DEPARTMENT_COLORS[DEPARTMENTS.LICENSING];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#003366] selection:text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-950 text-slate-400 z-50 flex flex-col transition-all duration-500 lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="B" className="h-6 w-auto" />
            </div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-xl">BOCRA</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Admin Control</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveView('overview')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'overview' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-bold text-sm">Dashboard Overview</span>
            </button>

            {user.adminLevel === 'superadmin' && (
              <>
                <button 
                  onClick={() => setActiveView('licensing')}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'licensing' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <Zap size={20} />
                  <span className="font-bold text-sm">Licensing Dept</span>
                </button>
                <button 
                  onClick={() => setActiveView('applications')}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'applications' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <FileText size={20} />
                  <span className="font-bold text-sm">All Applications</span>
                </button>
                <button 
                  onClick={() => setActiveView('users')}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'users' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <Users size={20} />
                  <span className="font-bold text-sm">User Management</span>
                </button>
              </>
            )}

            <button 
              onClick={() => setActiveView('submissions')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'submissions' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <FileText size={20} />
              <span className="font-bold text-sm">{user.department === 'tenders' ? 'Tenders & Bids' : 'Submissions'}</span>
            </button>

            {user.adminLevel === 'superadmin' && (
              <button 
                onClick={() => {
                  setActiveView('settings');
                  loadSettings();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeView === 'settings' ? 'bg-[#003366] text-white shadow-xl shadow-[#003366]/20' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <SettingsIcon size={20} />
                <span className="font-bold text-sm">System Settings</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 mb-4">
             <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white font-black">
                {user.name?.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{user.adminLevel}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-rose-500 hover:bg-rose-500/10"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-80 min-h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 capitalize">{activeView.replace('-', ' ')}</h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Shield size={14} />
                <span>BOCRA Administration Portal</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
          {/* Dashboard Overview */}
          {activeView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { label: 'Total Applications', val: departmentStats.licensing.total + departmentStats.complaints.total + departmentStats.tenders.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                   { label: 'Pending Review', val: departmentStats.licensing.pending + departmentStats.complaints.pending + departmentStats.tenders.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                   { label: 'System Health', val: '99.9%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { label: 'Active Admins', val: users.filter(u => u.adminLevel).length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
                 ].map((stat, i) => (
                   <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                     <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={24} />
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                             <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
                          </div>
                        </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>

               {/* Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-8">
                      <CardTitle className="text-xl font-black text-[#003366] flex items-center gap-3">
                         <BarChart3 size={24} /> Department Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Licensing', apps: departmentStats.licensing.total },
                            { name: 'Complaints', apps: departmentStats.complaints.total },
                            { name: 'Tenders', apps: departmentStats.tenders.total },
                            { name: 'QoS', apps: 0 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="apps" fill="#003366" radius={[6, 6, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                 </Card>

                 <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-8">
                      <CardTitle className="text-xl font-black text-[#003366] flex items-center gap-3">
                         <TrendingUp size={24} /> Overall Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Approved', value: departmentStats.licensing.approved + departmentStats.complaints.approved + departmentStats.tenders.approved },
                                { name: 'Pending', value: departmentStats.licensing.pending + departmentStats.complaints.pending + departmentStats.tenders.pending },
                                { name: 'Rejected', value: departmentStats.licensing.rejected + departmentStats.complaints.rejected + departmentStats.tenders.rejected }
                              ]}
                              cx="50%" cy="50%"
                              innerRadius={60} outerRadius={100} paddingAngle={5}
                              dataKey="value"
                            >
                              {[ '#10B981', '#F59E0B', '#F43F5E' ].map((color, idx) => (
                                <Cell key={`cell-${idx}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                 </Card>
               </div>
            </div>
          )}

          {/* Admin Licensing View */}
          {activeView === 'licensing' && user?.adminLevel === 'superadmin' && (
            <AdminLicensingView user={user} />
          )}

          {/* User Management View */}
          {activeView === 'users' && user?.adminLevel === 'superadmin' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">User Management</h2>
                  <p className="text-slate-500 font-medium">Create and manage internal staff accounts and access levels.</p>
                </div>
                <Button 
                  onClick={() => {
                    setEditingUser(null);
                    setShowUserForm(true);
                  }}
                  className="bg-[#003366] hover:bg-[#003366]/90 text-white rounded-2xl h-12 px-6 font-bold"
                >
                  <Plus className="mr-2 h-5 w-5" /> Add Staff Member
                </Button>
              </div>

              {showUserForm ? (
                <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-10 border-b bg-slate-50">
                    <CardTitle className="text-2xl font-black text-[#003366]">{editingUser ? 'Edit Staff Member' : 'New Staff Account'}</CardTitle>
                    <CardDescription>Enter details for the new staff member and assign department permissions.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <UserForm 
                      initialData={editingUser} 
                      onSubmit={() => {
                        setShowUserForm(false);
                        loadUsers();
                      }}
                      onCancel={() => setShowUserForm(false)}
                      isLoading={usersLoading}
                    />
                  </CardContent>
                </Card>
              ) : (
                <UserList 
                  users={users} 
                  isLoading={usersLoading} 
                  onEdit={(u) => {
                    setEditingUser(u);
                    setShowUserForm(true);
                  }}
                  onDelete={async (u) => {
                    if (window.confirm(`Delete staff member ${u.name}?`)) {
                      await adminApi.deleteUser(u.id);
                      loadUsers();
                    }
                  }}
                  onView={setViewingUser}
                />
              )}
            </div>
          )}

          {/* All Applications View */}
          {activeView === 'applications' && user?.adminLevel === 'superadmin' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <Card className="border-0 shadow-md rounded-[2.5rem] overflow-hidden">
                 <CardHeader className="p-10 border-b bg-white">
                    <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="text-2xl font-black text-slate-900 leading-tight">System-Wide Submissions</CardTitle>
                         <CardDescription className="text-slate-500">A consolidated view of all applications across all departments.</CardDescription>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    {/* Reuse table logic from current file but for ALL apps */}
                 </CardContent>
               </Card>
            </div>
          )}

          {/* Department Submissions View */}
          {activeView === 'submissions' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {user.department === 'tenders' && (
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                    <button 
                      onClick={() => setTenderView('submissions')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${tenderView === 'submissions' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Bids & Submissions
                    </button>
                    <button 
                      onClick={() => setTenderView('postings')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${tenderView === 'postings' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Active Tender Postings
                    </button>
                 </div>
               )}

               <Card className="border-0 shadow-md rounded-[2.5rem] overflow-hidden">
                 <CardHeader className="p-10 border-b bg-white flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">
                        {user.department === 'tenders' && tenderView === 'postings' ? 'Current Tender Notices' : DEPARTMENT_LABELS[user.department]}
                      </CardTitle>
                      <CardDescription>Manage incoming submissions and track their lifecycle state.</CardDescription>
                    </div>
                    {user.department === 'tenders' && tenderView === 'postings' && (
                      <Button className="bg-[#003366] h-12 rounded-2xl px-6 font-bold" onClick={() => setShowTenderForm(true)}>
                        <Plus className="mr-2" /> Post New Tender
                      </Button>
                    )}
                 </CardHeader>
                 <CardContent className="p-8">
                    {/* Render specific view based on Dept and tenderView */}
                 </CardContent>
               </Card>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && user?.adminLevel === 'superadmin' && (
            <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden animate-in fade-in duration-500 shadow-slate-200">
              <CardHeader className="p-10 border-b bg-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black text-[#003366]">System Configuration</CardTitle>
                  <CardDescription className="text-slate-500 text-base mt-2">Manage global portal variables, security policies, and automation.</CardDescription>
                </div>
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={settingsLoading}
                  className="bg-[#003366] hover:bg-[#042d54] text-white px-8 h-14 rounded-2xl text-base font-black shadow-lg shadow-[#003366]/20 transition-all active:scale-95"
                >
                  {settingsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-3 h-6 w-6" />}
                  Save All Changes
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="general" className="w-full">
                  <div className="px-10 bg-white border-b sticky top-0 z-10">
                    <TabsList className="h-16 bg-transparent gap-8">
                      {['general', 'security', 'email', 'display', 'notifications', 'activity'].map((tab) => (
                        <TabsTrigger 
                          key={tab}
                          value={tab} 
                          className="h-16 rounded-none border-b-2 border-transparent data-[state=active]:border-[#003366] data-[state=active]:bg-transparent px-2 font-black text-xs uppercase tracking-widest text-slate-400 data-[state=active]:text-[#003366] transition-all"
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <div className="p-10">
                    <TabsContent value="general" className="mt-0 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-sm font-black text-slate-700">Portal Name</Label>
                          <Input 
                            value={settings.siteName} 
                            onChange={(e) => handleSettingsChange('siteName', e.target.value)}
                            className="h-14 rounded-xl border-slate-200 focus:ring-2 focus:ring-[#003366]/20"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-black text-slate-700">Support Contact Email</Label>
                          <Input 
                            value={settings.supportEmail} 
                            onChange={(e) => handleSettingsChange('supportEmail', e.target.value)}
                            className="h-14 rounded-xl border-slate-200 focus:ring-2 focus:ring-[#003366]/20"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Maintenance Mode</p>
                            <p className="text-sm text-slate-500">Redirect users to a maintenance page while performing updates.</p>
                          </div>
                        </div>
                        <Switch 
                          checked={settings.maintenanceMode} 
                          onCheckedChange={(val) => handleSettingsChange('maintenanceMode', val)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-0 space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                              <Lock className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                              <p className="text-sm text-slate-500">Enforce 2FA for all administrative accounts.</p>
                            </div>
                          </div>
                          <Switch 
                            checked={settings.twoFactorAuth} 
                            onCheckedChange={(val) => handleSettingsChange('twoFactorAuth', val)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                              <Clock className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">Automatic Session Timeout</p>
                              <p className="text-sm text-slate-500">Log out users after {settings.sessionTimeout} minutes of inactivity.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Input 
                              type="number" 
                              value={settings.sessionTimeout} 
                              onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                              className="w-20 h-12 text-center font-bold"
                            />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Min</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="email" className="mt-0 space-y-6">
                       <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                          <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-slate-900">SMTP Configuration</h3>
                          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6 text-sm">Configure your mail server settings to enable system notifications and transactional emails.</p>
                          <Button variant="outline" className="rounded-xl font-bold">Configure Server</Button>
                       </div>
                    </TabsContent>

                    <TabsContent value="display" className="mt-0 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-900">Dark Mode Policy</p>
                            <p className="text-xs text-slate-500 mt-1">Force system-wide dark theme.</p>
                          </div>
                          <Switch 
                            checked={settings.darkMode} 
                            onCheckedChange={(val) => handleSettingsChange('darkMode', val)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-900">Compact Table View</p>
                            <p className="text-xs text-slate-500 mt-1">Reduce spacing in data lists.</p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0 space-y-4">
                      <div className="space-y-4">
                        {[
                          { id: 'sub', title: 'New Submissions', desc: 'Notify admins when a new application is received.' },
                          { id: 'sta', title: 'Status Changes', desc: 'Notify users when their application status is updated.' },
                          { id: 'usr', title: 'User Registration', desc: 'Alert superadmins when a new account is created.' }
                        ].map((n) => (
                          <div key={n.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl">
                             <div>
                               <p className="font-bold text-slate-900">{n.title}</p>
                               <p className="text-xs text-slate-500">{n.desc}</p>
                             </div>
                             <Switch checked={true} />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-0 pt-4">
                      <div className="rounded-2xl border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {recentActivities.map((log, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 text-xs font-bold text-[#003366]">{log.action}</td>
                                <td className="px-6 py-4 text-xs text-slate-600">{log.userEmail}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Button variant="ghost" className="w-full mt-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600" onClick={loadAllActivities}>
                        View Full System Log <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Modals */}
      {viewingUser && <UserModal user={viewingUser} onClose={() => setViewingUser(null)} />}
      {selectedTenderDetail && <TenderDetailModal tender={selectedTenderDetail} onClose={() => setSelectedTenderDetail(null)} />}
    </div>
  );
};

export default AdminDashboard;
