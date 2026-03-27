import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

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
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  DEPARTMENT_COLORS,
} from '../utils/persistence';
import { qosMetrics } from '../mockData';
import Analytics from '../components/Analytics';
import * as adminApi from '../services/api';
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  CheckCheck,
  XCircle,
  Shield,
  BarChart3,
  MessageSquare,
  Briefcase,
  Zap,
  LogOut,
  Hash,
  Send,
  ChevronDown,
  Users,
  Plus,
  Settings,
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
  Inbox,
  Lock,
  Mail,
  Bell,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Target,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';

const BRAND = {
  navy: '#010B1D',
  accent: '#14B8A6',
  white: '#FFFFFF',
  slate: '#64748B',
  border: '#E2E8F0',
  red: '#F43F5E',
  yellow: '#F59E0B',
  emerald: '#10B981',
  blue: '#3B82F6'
};

const StatTile = ({ label, value, icon: Icon, accent, helper }) => (
  <Card className="border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#14B8A6]/10 group-hover:text-[#14B8A6] transition-colors">
          <Icon size={22} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{helper}</span>
          <div className="h-1 w-8 rounded-full mt-1" style={{ backgroundColor: accent }}></div>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const SurfaceCard = ({ title, children, subtitle, icon: Icon, action }) => (
  <Card className="border-0 shadow-sm rounded-[2.5rem] overflow-hidden">
    <CardHeader className="bg-white border-b border-slate-100 p-8 flex flex-row items-center justify-between space-y-0">
      <div className="flex items-center gap-4">
        {Icon && <div className="p-3 rounded-2xl bg-teal-50 text-teal-600"><Icon size={20} /></div>}
        <div>
          <CardTitle className="text-xl font-black text-slate-900">{title}</CardTitle>
          {subtitle && <CardDescription className="font-medium text-slate-500">{subtitle}</CardDescription>}
        </div>
      </div>
      {action}
    </CardHeader>
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [tenderPostings, setTenderPostings] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [licensingApps, setLicensingApps] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({
    licensing: { total: 0, pending: 0, approved: 0, rejected: 0 },
    complaints: { total: 0, pending: 0, approved: 0, rejected: 0 },
    tenders: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });
  
  // UI states
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [tenderView, setTenderView] = useState('submissions'); // 'submissions' or 'postings'
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [editingTender, setEditingTender] = useState(null);
  const [formData, setFormData] = useState({
    tenderNumber: '',
    title: '',
    category: '',
    closingDate: '',
    estimatedValue: '',
    location: '',
    description: ''
  });

  // Settings states
  const [settings, setSettings] = useState({
    siteName: 'BOCRA Portal',
    maintenanceMode: false,
    registrationEnabled: true,
    supportEmail: 'support@bocra.org.bw',
    sessionTimeout: 30,
    twoFactorAuth: false
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [tenderPostingsLoading, setTenderPostingsLoading] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('adminUser'));
    const token = localStorage.getItem('adminToken');

    if (!authUser || !token) {
      navigate('/admin/login');
      return;
    }

    setUser(authUser);
    refreshData(authUser);
  }, [navigate]);

  const refreshData = async (currUser) => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadAllApplications(),
        loadSettings(),
        loadAllActivities()
      ]);

      if (currUser.department === 'tenders') {
        await loadTenderPostings();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('User fetch failed:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAllApplications = async () => {
    try {
      const resp = await adminApi.getAllSubmissions();
      const subs = resp.submissions || [];
      setAllApplications(subs);
      
      // Filter by department if needed
      setComplaints(subs.filter(a => a.department === 'complaints'));
      setTenders(subs.filter(a => a.department === 'tenders'));
      setLicensingApps(subs.filter(a => a.department === 'licensing'));
      
      // Calculate stats
      const stats = {
        licensing: { total: 0, pending: 0, approved: 0, rejected: 0 },
        complaints: { total: 0, pending: 0, approved: 0, rejected: 0 },
        tenders: { total: 0, pending: 0, approved: 0, rejected: 0 }
      };
      
      subs.forEach(app => {
        if (stats[app.department]) {
          stats[app.department].total++;
          if (app.status === 'pending' || app.status === 'Submitted') stats[app.department].pending++;
          if (app.status === 'approved' || app.status === 'Approved') stats[app.department].approved++;
          if (app.status === 'rejected' || app.status === 'Rejected') stats[app.department].rejected++;
        }
      });
      setDepartmentStats(stats);
    } catch (err) {
      console.error('Applications fetch failed:', err);
    }
  };

  const loadTenderPostings = async () => {
    setTenderPostingsLoading(true);
    try {
      const data = await adminApi.getTenderPostings();
      setTenderPostings(data);
    } catch (err) {
      console.error('Tender postings fetch failed:', err);
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await adminApi.getSystemSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.error('Settings fetch failed:', err);
    }
  };

  const loadAllActivities = async () => {
    try {
      const data = await adminApi.getActivityLogs();
      setRecentActivities(data.slice(0, 10));
    } catch (err) {
      console.error('Activity logs fetch failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedSubmission) return;
    setSubmissionsLoading(true);
    try {
      await adminApi.updateSubmissionStatus(selectedSubmission.id, newStatus);
      toast({
        title: 'Status Updated',
        description: `Submission ${selectedSubmission.token || selectedSubmission.id} is now ${newStatus}.`,
      });
      loadAllApplications();
      setSelectedSubmission(null);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleAddNote = async (note) => {
    if (!selectedSubmission) return;
    try {
      await adminApi.addSubmissionNotes(selectedSubmission.id, note);
      toast({ title: 'Note Added', description: 'Internal note saved successfully.' });
      loadAllApplications();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleTenderFormSubmit = async (e) => {
    e.preventDefault();
    setTenderPostingsLoading(true);
    try {
      if (editingTender) {
        await adminApi.updateTenderPosting(editingTender.id, formData);
        toast({ title: 'Tender Updated', description: 'Notice has been updated.' });
      } else {
        await adminApi.createTenderPosting(formData);
        toast({ title: 'Tender Posted', description: 'New procurement notice is now live.' });
      }
      setShowTenderForm(false);
      setEditingTender(null);
      loadTenderPostings();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleDeleteTenderPosting = async (id) => {
    if (!window.confirm('Delete this tender notice?')) return;
    try {
      await adminApi.deleteTenderPosting(id);
      toast({ title: 'Deleted', description: 'Notice has been removed.' });
      loadTenderPostings();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      await adminApi.updateSystemSettings(settings);
      toast({ title: 'Settings Saved', description: 'System configuration updated successfully.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Approved</Badge>;
      case 'rejected': return <Badge className="bg-rose-100 text-rose-700 border-rose-200">Rejected</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Under Review</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Approved': { className: 'bg-[#6DC04B] hover:bg-[#4E9933]', icon: CheckCircle },
      'Under Review': { className: 'bg-[#003366] hover:bg-[#003366]', icon: Clock },
      'Pending Review': { className: 'bg-amber-500 hover:bg-amber-600', icon: Clock },
      'Rejected': { className: 'bg-[#B91C1C] hover:bg-[#991b1b]', icon: XCircle },
    };
    const c = config[status] || config['Pending Review'];
    const Icon = c.icon;
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1525] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-[#14B8A6] animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Initializing Control Panel...</p>
      </div>
    );
  }

  // Determine which data to show in active data list
  const activeData = activeView === 'submissions' 
    ? (user?.department === 'tenders' ? tenders : 
       user?.department === 'complaints' ? complaints : 
       user?.department === 'licensing' ? licensingApps : [])
    : allApplications;

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(a => a.status === 'pending').length,
    approved: allApplications.filter(a => a.status === 'approved').length,
    rejected: allApplications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] text-white transition-all duration-300 lg:static lg:block
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       shadow-2xl shadow-black/50`}>
        <div className="flex flex-col h-full bg-[#020617]">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
               <div className="w-12 h-12 bg-[#14B8A6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#14B8A6]/30 group-hover:scale-110 transition-transform">
                  <Shield size={22} className="text-white" />
               </div>
               <div>
                  <h1 className="text-xl font-black tracking-tighter">BOCRA</h1>
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">Admin Portal</p>
               </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                { id: 'submissions', label: user?.department === 'tenders' ? 'Tenders hub' : 'Department Queue', icon: Inbox },
                { id: 'applications', label: 'All Submissions', icon: FileText, superOnly: true },
                { id: 'users', label: 'Staff Accounts', icon: Users, superOnly: true },
                { id: 'licensing', label: 'Licensing Desk', icon: CreditCard, superOnly: true },
              ].filter(item => !item.superOnly || user?.adminLevel === 'superadmin').map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group
                    ${activeView === item.id 
                      ? 'bg-[#14B8A6] text-white shadow-xl shadow-[#14B8A6]/20' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon size={20} className={activeView === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  {activeView === item.id && (
                    <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              ))}

              {user?.adminLevel === 'superadmin' && (
                <button 
                  onClick={() => setActiveView('settings')}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeView === 'settings' ? 'bg-[#14B8A6] text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <Settings size={20} />
                  <span className="font-bold text-sm tracking-tight">System Settings</span>
                </button>
              )}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 mb-4 group cursor-pointer hover:bg-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform">
                  {user?.name?.charAt(0)}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate tracking-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{user?.adminLevel}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut size={18} />
              <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              {activeView === 'dashboard' 
                ? 'System Control Panel' 
                : activeView === 'users' 
                ? 'User Management' 
                : activeView === 'applications' 
                ? 'All Applications' 
                : activeView === 'settings'
                ? 'Settings'
                : `${DEPARTMENT_LABELS[user.department] || 'Admin'} - Submissions`}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeView === 'dashboard'
                ? 'Monitor platform activity, manage queues, and process submissions from one operational workspace.'
                : activeView === 'users'
                ? 'Manage all system users and permissions.'
                : activeView === 'applications'
                ? 'Manage license applications from all departments'
                : activeView === 'settings'
                ? 'Configure system-wide settings and preferences'
                : `Managing ${DEPARTMENT_LABELS[user.department] || 'submissions'} submissions.`}
            </p>
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">{activeView.replace('-', ' ')}</h2>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Terminal Session Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600 tracking-tight">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative shadow-sm">
               <Bell size={18} />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#14B8A6] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid - Only show during submissions view */}
        {activeView === 'submissions' && user?.department && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Submissions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total || 0}</p>
                  </div>
                <div className={`w-12 h-12 rounded-2xl ${deptColor.light} flex items-center justify-center`}>
                  <FileText className={`h-6 w-6 ${deptColor.text}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Review</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">High Priority</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved</p>
                  <p className="text-3xl font-bold text-[#4E9933] mt-1">{stats.approved || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EDF7E8] flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-[#4E9933]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Pending Queue" value={stats.pending || 0} icon={Clock} accent={BRAND.yellow} helper="Items awaiting action" />
              <StatTile label="High Priority" value={stats.highPriority || 0} icon={AlertCircle} accent={BRAND.red} helper="Needs immediate attention" />
              <StatTile label="Approved" value={stats.approved || 0} icon={CheckCircle} accent={BRAND.green} helper="Resolved or cleared items" />
              <StatTile
                label={user?.adminLevel === 'superadmin' ? 'System Users' : 'Department Total'}
                value={user?.adminLevel === 'superadmin' ? userStats.totalUsers : stats.total || 0}
                icon={user?.adminLevel === 'superadmin' ? Users : FileText}
                accent={BRAND.blue}
                helper={user?.adminLevel === 'superadmin' ? 'Registered platform accounts' : 'Items currently in queue'}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <SurfaceCard>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                        <Shield className="h-3.5 w-3.5" style={{ color: BRAND.blue }} />
                        Control overview
                      </div>
                      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">Operational queue snapshot</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                        Review live workload, identify urgent cases, and move straight into processing from an admin-first control panel.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          setActiveView('submissions');
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                        className="h-11 rounded-xl text-white"
                        style={{ backgroundColor: BRAND.navy }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Open Queue
                      </Button>
                      {user?.adminLevel === 'superadmin' && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveView('users');
                            setShowUserForm(false);
                          }}
                          className="h-11 rounded-xl border-slate-200"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                    <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-[1.4fr_0.9fr_0.7fr_0.8fr]">
                      <span>Submission</span>
                      <span className="hidden sm:block">Applicant</span>
                      <span>Status</span>
                      <span>Priority</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {activeData.slice(0, 5).map((sub) => (
                        <div
                          key={sub.id}
                          className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-sm text-slate-700 sm:grid-cols-[1.4fr_0.9fr_0.7fr_0.8fr]"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-950">{sub.subject || 'Untitled submission'}</p>
                            <p className="mt-1 truncate text-xs text-slate-500">{sub.id}</p>
                          </div>
                          <div className="hidden min-w-0 sm:block">
                            <p className="truncate">{sub.citizenName || 'Unknown applicant'}</p>
                            <p className="mt-1 truncate text-xs text-slate-500">{sub.citizenEmail || 'No email'}</p>
                          </div>
                          <div className="min-w-0">{getStatusBadge(sub.status)}</div>
                          <div className="min-w-0">{getPriorityBadge(sub.priority)}</div>
                        </div>
                      ))}

                      {activeData.length === 0 && (
                        <div className="px-4 py-10 text-center">
                          <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
                          <p className="mt-3 font-medium text-slate-900">No live queue items yet</p>
                          <p className="mt-1 text-sm text-slate-500">
                            New department submissions will appear here once they are received.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </SurfaceCard>

              <div className="space-y-6">
                <SurfaceCard>
                  <CardContent className="p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Response targets</p>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-[1.5rem] border border-slate-200 p-4" style={{ backgroundColor: '#FFF8DF' }}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Pending review</p>
                            <p className="mt-1 text-sm text-slate-600">Items waiting for the next admin action.</p>
                          </div>
                          <span className="text-2xl font-bold text-slate-950">{stats.pending || 0}</span>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 p-4" style={{ backgroundColor: '#FBECEC' }}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Flagged priority</p>
                            <p className="mt-1 text-sm text-slate-600">Cases that may require faster intervention.</p>
                          </div>
                          <span className="text-2xl font-bold text-slate-950">{stats.highPriority || 0}</span>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 p-4" style={{ backgroundColor: '#EDF8F2' }}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">Department focus</p>
                            <p className="mt-1 text-sm text-slate-600">Current administrative area in view.</p>
                          </div>
                          <span className="text-sm font-bold text-slate-950">
                            {DEPARTMENT_LABELS[user?.department]?.split(' &')[0] || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </SurfaceCard>

                <SurfaceCard>
                  <CardContent className="p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin actions</p>
                    <div className="mt-5 space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('submissions');
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                        className="flex w-full items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <span>
                          <p className="font-semibold text-slate-950">Review queue</p>
                          <p className="text-sm text-slate-500">Open the full submissions workspace.</p>
                        </span>
                        <FileText className="h-5 w-5 text-slate-400" />
                      </button>

                      {user?.adminLevel === 'superadmin' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('applications');
                              setSearchTerm('');
                              setFilterStatus('all');
                              loadAllApplications();
                            }}
                            className="flex w-full items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            <span>
                              <p className="font-semibold text-slate-950">Cross-department review</p>
                              <p className="text-sm text-slate-500">Inspect applications across the whole system.</p>
                            </span>
                            <Briefcase className="h-5 w-5 text-slate-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveView('users');
                              setShowUserForm(false);
                            }}
                            className="flex w-full items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            <span>
                              <p className="font-semibold text-slate-950">User access control</p>
                              <p className="text-sm text-slate-500">Create and manage staff or citizen accounts.</p>
                            </span>
                            <Users className="h-5 w-5 text-slate-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </SurfaceCard>
              </div>
            </div>
          </>
        )}

        {activeView === 'submissions' && user?.department && (
          <>
            {/* Search & Filter */}
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, subject, or reference token..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  >
                    <option value="all">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Registered">Registered</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-16 text-center">
                    <DeptIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Submissions Found</h3>
                    <p className="text-slate-500">
                      {searchTerm || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No submissions have been received for this department yet.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredSubmissions.map((sub) => (
                  <Card key={sub.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{sub.subject}</h3>
                            {getPriorityBadge(sub.priority)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5" />
                              <span className="font-mono font-semibold text-[#003366]">{sub.id}</span>
                            </span>
                            <span>•</span>
                            <span>{sub.citizenName} ({sub.citizenEmail})</span>
                            <span>•</span>
                            <span>{sub.submittedDate}</span>
                          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto pb-12">
          {/* Dashboard/Overview View */}
          {activeView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatTile label="Current Backlog" value={stats.total} icon={Inbox} accent={BRAND.blue} helper="Active Requests" />
                  <StatTile label="Pending Review" value={stats.pending} icon={Clock} accent={BRAND.yellow} helper="Action Required" />
                  <StatTile label="Approvals" value={stats.approved} icon={CheckCircle} accent={BRAND.emerald} helper="YTD Issued" />
                  <StatTile label="System Health" value="Optimum" icon={Zap} accent={BRAND.accent} helper="Latency < 45ms" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2.5rem] overflow-hidden">
                     <CardHeader className="bg-white border-b border-slate-100 p-8">
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-xl font-black text-slate-900">Institutional Throughput</CardTitle>
                           <Badge variant="outline" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-slate-200">Real-time Pipeline</Badge>
                        </div>
                     </CardHeader>
                     <CardContent className="p-8">
                        <div className="h-[400px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Licensing', apps: departmentStats.licensing.total, pending: departmentStats.licensing.pending },
                                { name: 'Complaints', apps: departmentStats.complaints.total, pending: departmentStats.complaints.pending },
                                { name: 'Tenders', apps: departmentStats.tenders.total, pending: departmentStats.tenders.pending },
                                { name: 'QoS', apps: 42, pending: 2 }
                              ]}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                 <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                                 <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                                 <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#F8FAFC' }}
                                 />
                                 <Bar dataKey="apps" fill="#14B8A6" radius={[8, 8, 8, 8]} barSize={32} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm rounded-[2.5rem] overflow-hidden">
                     <CardHeader className="bg-white border-b border-slate-100 p-8">
                        <CardTitle className="text-xl font-black text-slate-900">Distribution</CardTitle>
                     </CardHeader>
                     <CardContent className="p-8 pb-4">
                        <div className="h-[300px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={[
                                       { name: 'Approved', value: stats.approved },
                                       { name: 'Pending', value: stats.pending },
                                       { name: 'Rejected', value: stats.rejected }
                                    ]}
                                    innerRadius={70} outerRadius={100} paddingAngle={12} dataKey="value" stroke="none"
                                 >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#F59E0B" />
                                    <Cell fill="#F43F5E" />
                                 </Pie>
                                 <Tooltip />
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        {selectedSubmission === sub.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              placeholder="Add a note before changing status..."
                              value={adminNote}
                              onChange={(e) => setAdminNote(e.target.value)}
                              disabled={submissionsLoading}
                              className="flex-1 text-sm h-9"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={submissionsLoading || !adminNote.trim()}
                              onClick={() => {
                                handleAddNote(sub.id);
                              }}
                              className="text-[#003366]"
                            >
                              {submissionsLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={submissionsLoading}
                              onClick={() => setSelectedSubmission(null)}
                              className="text-slate-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={submissionsLoading}
                              className="text-slate-600 border-slate-200"
                              onClick={() => setSelectedSubmission(sub.id)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              Add Note
                            </Button>
                            {sub.status === 'Submitted' && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={submissionsLoading}
                                  className="bg-[#003366] hover:bg-[#003366] text-white"
                                  onClick={() => handleStatusChange(sub.id, 'Under Review')}
                                >
                                  <Clock className="h-4 w-4 mr-1.5" />
                                  Start Review
                                </Button>
                              </>
                            )}
                            {(sub.status === 'Submitted' || sub.status === 'Under Review') && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={submissionsLoading}
                                  className="bg-[#6DC04B] hover:bg-[#4E9933] text-white"
                                  onClick={() => handleStatusChange(sub.id, 'Approved')}
                                >
                                  <CheckCheck className="h-4 w-4 mr-1.5" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={submissionsLoading}
                                  variant="destructive"
                                  onClick={() => handleStatusChange(sub.id, 'Rejected')}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                        <div className="space-y-4 pt-4 border-t border-slate-100 mt-4">
                           {[
                              { label: 'Approved', color: 'bg-emerald-500', val: stats.approved },
                              { label: 'Pending', color: 'bg-amber-500', val: stats.pending },
                              { label: 'Rejected', color: 'bg-rose-500', val: stats.rejected }
                           ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                                 </div>
                                 <span className="text-sm font-black text-slate-900">{item.val} items</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
          )}

          {/* Applications/Submissions View */}
          {activeView === 'submissions' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {user?.department === 'tenders' && (
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner mb-6">
                  <button 
                    onClick={() => setTenderView('submissions')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tenderView === 'submissions' ? 'bg-white text-teal-600 shadow-xl shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Bids & Submissions
                  </button>
                  <button 
                    onClick={() => setTenderView('postings')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tenderView === 'postings' ? 'bg-white text-teal-600 shadow-xl shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Active Notices
                  </button>
                </div>
              )}

              {user?.department === 'tenders' && tenderView === 'postings' ? (
                showTenderForm ? (
                  <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden animate-in zoom-in duration-300">
                    <CardHeader className="p-12 border-b bg-slate-50">
                      <CardTitle className="text-3xl font-black text-slate-900">{editingTender ? 'Edit Tender Notice' : 'Post New Procurement Notice'}</CardTitle>
                      <CardDescription className="text-base mt-2 font-medium">Provide comprehensive details for the open tender opportunity.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12">
                      <form onSubmit={handleTenderFormSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Tender Reference Number</Label>
                            <Input 
                              required 
                              value={formData.tenderNumber} 
                              onChange={(e) => setFormData({...formData, tenderNumber: e.target.value})}
                              placeholder="e.g. BOCRA/TEN/2026/01"
                              className="h-16 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#14B8A6]/20 font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Notice Title</Label>
                            <Input 
                              required 
                              value={formData.title} 
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                              placeholder="Official tender title..."
                              className="h-16 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#14B8A6]/20 font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Procurement Category</Label>
                            <Input 
                              required 
                              value={formData.category} 
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              placeholder="e.g. IT, Infrastructure, Consultancy"
                              className="h-16 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#14B8A6]/20 font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Closing Date & Time</Label>
                            <Input 
                              type="datetime-local"
                              required 
                              value={formData.closingDate} 
                              onChange={(e) => setFormData({...formData, closingDate: e.target.value})}
                              className="h-16 rounded-2xl border-slate-200 focus:ring-2 focus:ring-[#14B8A6]/20 font-bold"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Detailed Scope & Requirements</Label>
                          <textarea 
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={6}
                            className="w-full p-6 rounded-[2rem] border-slate-200 focus:ring-2 focus:ring-[#14B8A6]/20 font-medium leading-relaxed bg-slate-50"
                            placeholder="Describe the tender requirements, eligibility, and evaluation criteria..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Citizen Users</p>
                          <p className="text-3xl font-bold text-[#003366] mt-1">{userStats.citizenCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-[#E0F4FB] flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#003366]" />
                        </div>
                      </div>
                        <div className="flex gap-4 pt-6">
                          <Button type="button" variant="outline" className="h-16 flex-1 rounded-2xl border-2 border-slate-900 font-bold" onClick={() => setShowTenderForm(false)}>Discard</Button>
                          <Button type="submit" className="h-16 flex-[2] rounded-2xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black shadow-xl shadow-teal-500/20">
                            {tenderPostingsLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (editingTender ? 'Update Notice' : 'Post Tender Notice')}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <SurfaceCard 
                    title="Current Tender Notices" 
                    subtitle="Manage procurement opportunities published on the public portal."
                    icon={Briefcase}
                    action={
                      <Button className="bg-[#14B8A6] hover:bg-teal-600 h-12 rounded-2xl px-6 font-bold text-white shadow-lg" onClick={() => {
                        setEditingTender(null);
                        setFormData({ tenderNumber: '', title: '', category: '', closingDate: '', estimatedValue: '', location: '', description: '' });
                        setShowTenderForm(true);
                      }}>
                        <Plus className="mr-2" /> Publish New Tender
                      </Button>
                    }
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Title & Category</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Closing Date</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tenderPostings.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6 font-mono text-xs font-bold text-teal-600 leading-none">{t.tenderNumber}</td>
                              <td className="px-8 py-6">
                                <p className="text-sm font-bold text-slate-900">{t.title}</p>
                                <p className="text-xs font-medium text-slate-400">{t.category}</p>
                              </td>
                              <td className="px-8 py-6">
                                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-black tracking-tight px-3 py-1">
                                  {new Date(t.closingDate).toLocaleDateString()}
                                </Badge>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 rounded-xl" onClick={() => {
                                    setEditingTender(t);
                                    setFormData({ ...t });
                                    setShowTenderForm(true);
                                  }}>
                                    <Edit2 size={16} />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="hover:bg-rose-50 hover:text-rose-600 rounded-xl" onClick={() => handleDeleteTenderPosting(t.id)}>
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SurfaceCard>
                )
              ) : (
                <SurfaceCard 
                  title={`${DEPARTMENT_LABELS[user?.department || 'licensing']} Queue`}
                  subtitle="Actionable repository for incoming departmental requests."
                  icon={Inbox}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference Number</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant Info</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current State</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeData.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6 font-mono text-xs font-bold text-teal-600">{app.token || app.id.slice(0, 12)}</td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-bold text-slate-900">{app.citizenName}</p>
                              <p className="text-xs font-medium text-slate-400">{app.citizenEmail}</p>
                            </td>
                            <td className="px-8 py-6">{getStatusBadge(app.status)}</td>
                            <td className="px-8 py-6">
                              <Button 
                                onClick={() => setSelectedSubmission(app)}
                                className="bg-slate-900 hover:bg-[#14B8A6] text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 transition-all"
                              >
                                {app.status === 'pending' ? 'Decision Required' : 'Review Manifest'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SurfaceCard>
              )}
            </div>
          )}

          {/* Users View */}
          {activeView === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Directory</h2>
                  <p className="text-slate-500 font-medium">Manage institutional access and departmental privileges.</p>
                </div>
                {!showUserForm && (
                  <Button className="bg-[#14B8A6] hover:bg-teal-600 text-white rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-lg" onClick={() => setShowUserForm(true)}>
                    <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Authenticate New Staff
                  </Button>
                )}
              </div>

              {showUserForm ? (
                <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden">
                  <CardHeader className="p-12 border-b bg-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">{editingUser ? 'Policy Modification' : 'Access Provisioning'}</CardTitle>
                      <CardDescription className="font-medium">Establishing secure credentials for institutional staff.</CardDescription>
                    </div>
                    <Button variant="ghost" className="rounded-2xl text-slate-400 hover:text-slate-900" onClick={() => setShowUserForm(false)}>
                      <X size={24} />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-12">
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
                  loading={usersLoading} 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onEdit={(u) => { setEditingUser(u); setShowUserForm(true); }}
                  onDelete={async (u) => { if (confirm(`Revoke access for ${u.name}?`)) { await adminApi.deleteUser(u.id); loadUsers(); } }}
                  onView={setViewingUser}
                />
              )}
            </div>
          )}

          {/* Applications/All Submissions View */}
          {activeView === 'applications' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <SurfaceCard 
                title="Consolidated System Audit" 
                subtitle="A complete record of every transaction initiated across the BOCRA ecosystem."
                icon={ShieldCheck}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Auth Token</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Portfolio</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current State</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="px-8 py-6 font-mono text-xs font-bold text-teal-600">{app.token || 'MANIFEST_ERR'}</td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-slate-900">{app.citizenName}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{app.citizenEmail}</p>
                          </td>
                          <td className="px-8 py-6">
                            <Badge className={`${DEPARTMENT_COLORS[app.department]?.bg || 'bg-slate-900'} text-white border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1`}>
                              {app.department}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">{getStatusBadge(app.status)}</td>
                          <td className="px-8 py-6">
                            <Button variant="outline" className="rounded-2xl border-2 border-slate-900 font-black text-[10px] uppercase h-10 px-6" onClick={() => setSelectedSubmission(app)}>Inspect</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SurfaceCard>
            </div>
          )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Applications</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">{allApplications.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F0F9] flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#003366]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Pending</p>
                      <p className="text-3xl font-bold text-amber-600 mt-1">
                        {allApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Approved</p>
                      <p className="text-3xl font-bold text-[#4E9933] mt-1">
                        {allApplications.filter(a => a.status === 'Approved').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EDF7E8] flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-[#4E9933]" />
                    </div>
          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden shadow-slate-200">
                <CardHeader className="p-10 border-b bg-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">System Node Configuration</CardTitle>
                    <CardDescription className="text-slate-500 text-base mt-2 font-medium">Protocol weights, security barriers, and automated dispatch control.</CardDescription>
                  </div>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={settingsLoading}
                    className="bg-slate-900 hover:bg-[#14B8A6] text-white px-10 h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  >
                    {settingsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-3 h-5 w-5" />}
                    Commit System Changes
                  </Button>
                </CardHeader>
                <CardContent className="p-0 min-h-[600px]">
                  <Tabs defaultValue="general" className="w-full">
                    <div className="px-10 bg-white border-b sticky top-0 z-10">
                      <TabsList className="h-16 bg-transparent gap-8">
                        {['general', 'security', 'email', 'automation', 'activity'].map((tab) => (
                          <TabsTrigger 
                            key={tab}
                            value={tab} 
                            className="h-16 rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#14B8A6] data-[state=active]:bg-transparent px-2 font-black text-[10px] uppercase tracking-widest text-slate-400 data-[state=active]:text-slate-900 transition-all"
                          >
                            {tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="p-12">
                      <TabsContent value="general" className="mt-0 space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-teal-600">Portal Instance Name</Label>
                            <Input value={settings.siteName} onChange={(e) => handleSettingsChange('siteName', e.target.value)} className="h-14 rounded-xl border-slate-200 focus:ring-2 focus:ring-teal-500/20 font-bold" />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-teal-600">Emergency Protocol Email</Label>
                            <Input value={settings.supportEmail} onChange={(e) => handleSettingsChange('supportEmail', e.target.value)} className="h-14 rounded-xl border-slate-200 focus:ring-2 focus:ring-teal-500/20 font-bold" />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                          <div className="flex gap-6">
                            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                              <AlertCircle size={24} />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 text-lg leading-tight tracking-tight">Infrastructure Lockdown (Maintenance)</p>
                               <p className="text-sm text-slate-500 font-medium">Redirect all public ingress to maintenance cluster. Emergency access only.</p>
                            </div>
                          </div>
                          <Switch checked={settings.maintenanceMode} onCheckedChange={(val) => handleSettingsChange('maintenanceMode', val)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="security" className="mt-0 space-y-8">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex gap-6">
                              <div className="w-14 h-14 bg-[#14B8A6]/10 text-teal-600 rounded-2xl flex items-center justify-center"><Lock size={24} /></div>
                              <div>
                                <p className="font-black text-slate-900 text-lg leading-tight tracking-tight">Biometric/Two-Factor Enforced</p>
                                <p className="text-sm text-slate-500 font-medium">Require additional validation layers for all institutional access.</p>
                              </div>
                            </div>
                            <Switch checked={settings.twoFactorAuth} onCheckedChange={(val) => handleSettingsChange('twoFactorAuth', val)} />
                          </div>

                          <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex gap-6">
                              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Clock size={24} /></div>
                              <div>
                                <p className="font-black text-slate-900 text-lg leading-tight tracking-tight">Automated Terminal Logout</p>
                                <p className="text-sm text-slate-500 font-medium">Flush sessions after {settings.sessionTimeout} minutes of zero IO activity.</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                              <Input type="number" value={settings.sessionTimeout} onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))} className="w-24 h-12 border-0 text-center font-black text-xl" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Min</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={submissionsLoading}
                              className="text-slate-600 border-slate-200"
                              onClick={() => setSelectedSubmission(app.id)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              Add Note
                            </Button>
                            {app.status === 'Submitted' && (
                              <Button
                                size="sm"
                                disabled={submissionsLoading}
                                className="bg-[#003366] hover:bg-[#003366] text-white"
                                onClick={() => handleStatusChange(app.id, 'Under Review')}
                              >
                                <Clock className="h-4 w-4 mr-1.5" />
                                Start Review
                              </Button>
                            )}
                            {(app.status === 'Submitted' || app.status === 'Under Review') && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={submissionsLoading}
                                  className="bg-[#6DC04B] hover:bg-[#4E9933] text-white"
                                  onClick={() => handleStatusChange(app.id, 'Approved')}
                                >
                                  <CheckCheck className="h-4 w-4 mr-1.5" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={submissionsLoading}
                                  variant="destructive"
                                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="activity" className="mt-0">
                        <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vector Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Operation Log</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Origin Handle</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {recentActivities.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-6 text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                  <td className="px-8 py-6 text-xs font-black text-slate-900 uppercase">{log.action}</td>
                                  <td className="px-8 py-6 text-xs text-slate-500 font-bold">{log.userEmail || 'SYSTEM_CORE'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Licensing desk view logic */}
          {activeView === 'licensing' && user?.adminLevel === 'superadmin' && (
            <div className="animate-in fade-in duration-500">
              <AdminLicensingView user={user} />
            </div>
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      {viewingUser && <UserModal user={viewingUser} onClose={() => setViewingUser(null)} />}
      
      {selectedSubmission && (
         <TenderDetailModal 
            tender={selectedSubmission} 
            onClose={() => setSelectedSubmission(null)}
            onAddNote={handleAddNote}
            onStatusChange={handleStatusChange}
            loading={submissionsLoading}
            adminNote={adminNote}
            setAdminNote={setAdminNote}
         />
      )}
    </div>
  );
};

export default AdminDashboard;
