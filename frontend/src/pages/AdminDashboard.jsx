import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import UserForm from '../components/admin/UserForm';
import UserList from '../components/admin/UserList';
import UserModal from '../components/admin/UserModal';
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
  Loader2,
} from 'lucide-react';

import { Menu, X as XIcon } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'submissions', 'users', 'applications', or 'settings'
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  
  // User management state (for superadmin)
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    citizenCount: 0,
  });
  
  const { toast } = useToast();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  // Load department-specific data
  useEffect(() => {
    if (!user) return;
    // For non-superadmin, department must be set
    if (user.adminLevel === 'admin' && !user.department) {
      navigate('/login');
      return;
    }
    refreshData();
    // Load users if superadmin
    if (user.adminLevel === 'superadmin') {
      loadUsers();
    }
  }, [user, navigate]);

  const loadUsers = async () => {
    setUserLoading(true);
    const token = localStorage.getItem('bocra_token');
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users || []);

      // Calculate stats
      const adminCount = (data.users || []).filter((u) => u.userType === 'admin').length;
      const citizenCount = (data.users || []).filter((u) => u.userType === 'client').length;

      setUserStats({
        totalUsers: data.users?.length || 0,
        adminCount,
        citizenCount,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserSubmit = async (formData) => {
    setUserLoading(true);
    const token = localStorage.getItem('bocra_token');

    try {
      const method = editingUser ? 'PUT' : 'POST';
      const endpoint = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save user');
      }

      toast({
        title: 'Success',
        description: editingUser ? 'User updated successfully' : 'User created successfully',
      });

      setShowUserForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setUserLoading(true);
    const token = localStorage.getItem('bocra_token');

    try {
      const response = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUserLoading(false);
    }
  };

  const loadAllApplications = async () => {
    setSubmissionsLoading(true);
    try {
      let allApps = [];

      // Load licensing applications
      try {
        const licensingData = await adminApi.getSubmissions({
          department: 'licensing',
          page: 1,
          limit: 100,
        });
        if (licensingData.submissions) {
          allApps = [...allApps, ...licensingData.submissions];
        }
      } catch (error) {
        console.error('Failed to load licensing applications:', error);
      }

      // Load complaints
      try {
        const complaintsData = await adminApi.getAdminComplaints({
          page: 1,
          limit: 100,
        });
        if (complaintsData.complaints) {
          allApps = [...allApps, ...complaintsData.complaints];
        }
      } catch (error) {
        console.error('Failed to load complaints:', error);
      }

      // Load tenders
      try {
        const tendersData = await adminApi.getAdminTenders({
          page: 1,
          limit: 100,
        });
        if (tendersData.tenders) {
          allApps = [...allApps, ...tendersData.tenders];
        }
      } catch (error) {
        console.error('Failed to load tenders:', error);
      }

      setAllApplications(allApps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const refreshData = async () => {
    if (!user) return;
    // For superadmin, only load if a department is selected
    if (user.adminLevel === 'superadmin' && !user.department) {
      setSubmissions([]);
      setComplaints([]);
      setTenders([]);
      setStats({});
      return;
    }
    
    setSubmissionsLoading(true);
    try {
      const dept = user.department;

      // Fetch data based on department
      if (dept === 'licensing') {
        const submissionsData = await adminApi.getSubmissions({
          department: dept,
          page: 1,
          limit: 100,
        });
        setSubmissions(submissionsData.submissions || []);
        setComplaints([]);
        setTenders([]);
      } else if (dept === 'complaints') {
        const complaintsData = await adminApi.getAdminComplaints({
          page: 1,
          limit: 100,
        });
        setComplaints(complaintsData.complaints || []);
        setSubmissions([]);
        setTenders([]);
      } else if (dept === 'tenders') {
        const tendersData = await adminApi.getAdminTenders({
          page: 1,
          limit: 100,
        });
        setTenders(tendersData.tenders || []);
        setSubmissions([]);
        setComplaints([]);
      } else if (dept === 'qos') {
        // QoS doesn't have submissions yet
        setSubmissions([]);
        setComplaints([]);
        setTenders([]);
      }

      // Fetch stats from backend
      const statsData = await adminApi.getAdminStats(dept);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load department data',
        variant: 'destructive',
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleStatusChange = async (token, newStatus) => {
    try {
      setSubmissionsLoading(true);
      const dept = user?.department;

      if (dept === 'complaints') {
        await adminApi.updateComplaintStatus(token, newStatus);
      } else if (dept === 'tenders') {
        await adminApi.updateTenderStatus(token, newStatus);
      } else {
        await adminApi.updateSubmissionStatus(token, newStatus);
      }

      await refreshData();
      setSelectedSubmission(null);
      toast({
        title: 'Status Updated',
        description: `Item ${token} has been moved to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleAddNote = async (token) => {
    if (!adminNote.trim()) return;
    try {
      setSubmissionsLoading(true);
      const dept = user?.department;

      if (dept === 'complaints') {
        await adminApi.addComplaintNotes(token, adminNote);
      } else if (dept === 'tenders') {
        await adminApi.addTenderNotes(token, adminNote);
      } else {
        await adminApi.addSubmissionNotes(token, adminNote);
      }

      setAdminNote('');
      await refreshData();
      setSelectedSubmission(null);
      toast({
        title: 'Note Added',
        description: `Internal admin note saved for ${token}.`,
      });
    } catch (error) {
      console.error('Failed to add note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleDisabledMock = (feature) => {
    toast({
      title: 'Development Preview',
      description: `${feature} module will be available in the upcoming release phase.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    navigate('/login');
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
    return (
      <Badge className={c.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-[#E6F4EC] text-[#1A6B3C] border-green-200',
    };
    return <Badge variant="outline" className={colors[priority]}>{priority}</Badge>;
  };

  const getDeptIcon = (dept) => {
    const icons = {
      [DEPARTMENTS.LICENSING]: Zap,
      [DEPARTMENTS.COMPLAINTS]: MessageSquare,
      [DEPARTMENTS.QOS]: BarChart3,
      [DEPARTMENTS.TENDERS]: Briefcase,
    };
    return icons[dept] || Shield;
  };

  // Get active submissions data based on department
  const getActiveData = () => {
    const dept = user?.department;
    if (dept === 'complaints') return complaints;
    if (dept === 'tenders') return tenders;
    return submissions;
  };

  const activeData = getActiveData();

  const filteredSubmissions = activeData.filter((sub) => {
    const matchesSearch =
      sub.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  const DeptIcon = getDeptIcon(user.department);
  const deptColor = DEPARTMENT_COLORS[user.department] || { bg: 'bg-[#003366]', text: 'text-[#003366]', light: 'bg-[#E8F0F9]' };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {mobileSidebarOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-72 bg-slate-900 text-white z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="BOCRA" className="h-12 w-auto brightness-0 invert" />
          </Link>
        </div>

        {/* Department Badge */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${deptColor.light} bg-opacity-10`}>
            <div className={`w-10 h-10 rounded-xl ${deptColor.bg} flex items-center justify-center`}>
              <DeptIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Department</p>
              <p className="text-sm font-bold text-white">{DEPARTMENT_LABELS[user.department]?.split(' &')[0] || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Overview</p>
          <button 
            onClick={() => { 
              setActiveView('dashboard');
              setSearchTerm('');
              setFilterStatus('all');
              toast({ title: 'Dashboard', description: 'Viewing main dashboard.' }); 
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
              activeView === 'dashboard' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>

          {/* User Management - Only for superadmins */}
          {user?.adminLevel === 'superadmin' && (
            <>
              <button 
                onClick={() => { 
                  setActiveView('users');
                  setSearchTerm('');
                  setFilterStatus('all');
                  toast({ title: 'User Management', description: 'Manage all system users.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'users' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                User Management
              </button>

              <button 
                onClick={() => { 
                  setActiveView('applications');
                  setSearchTerm('');
                  setFilterStatus('all');
                  loadAllApplications();
                  toast({ title: 'Applications', description: 'Viewing applications from all departments.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'applications' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" />
                Applications
              </button>
            </>
          )}

          {/* Departments - Only for superadmins */}
          {user?.adminLevel === 'superadmin' && (
            <>
              <p className="px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold mt-6 mb-3">Departments</p>
              <button 
                onClick={() => { 
                  const updatedUser = { ...user, department: DEPARTMENTS.LICENSING };
                  localStorage.setItem('bocra_user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  setActiveView('submissions');
                  toast({ title: 'Licensing', description: 'Switched to Licensing Department.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'submissions' && user?.department === DEPARTMENTS.LICENSING 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Zap className="h-4 w-4" />
                Licensing
              </button>
              <button 
                onClick={() => { 
                  const updatedUser = { ...user, department: DEPARTMENTS.COMPLAINTS };
                  localStorage.setItem('bocra_user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  setActiveView('submissions');
                  toast({ title: 'Complaints', description: 'Switched to Complaints Department.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'submissions' && user?.department === DEPARTMENTS.COMPLAINTS 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Complaints
              </button>
              <button 
                onClick={() => { 
                  const updatedUser = { ...user, department: DEPARTMENTS.QOS };
                  localStorage.setItem('bocra_user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  setActiveView('submissions');
                  toast({ title: 'Quality of Service', description: 'Switched to QoS Department.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'submissions' && user?.department === DEPARTMENTS.QOS 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Quality of Service
              </button>
              <button 
                onClick={() => { 
                  const updatedUser = { ...user, department: DEPARTMENTS.TENDERS };
                  localStorage.setItem('bocra_user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  setActiveView('submissions');
                  toast({ title: 'Tenders', description: 'Switched to Tenders Department.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'submissions' && user?.department === DEPARTMENTS.TENDERS 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Tenders
              </button>

              <p className="px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold mt-6 mb-3">System</p>
              <button 
                onClick={() => { 
                  setActiveView('settings');
                  setSearchTerm('');
                  setFilterStatus('all');
                  toast({ title: 'Settings', description: 'Manage system settings.' }); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                  activeView === 'settings' 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold text-sm">
              {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-72 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
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
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant="outline" className={`text-sm px-3 py-1.5 ${
              user.adminLevel === 'superadmin' 
                ? 'border-purple-200 text-purple-700 bg-purple-50' 
                : 'border-[#003366]/20 text-[#0A4D8C] bg-[#E8F0F9]'
            }`}>
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              {user.adminLevel === 'superadmin' ? 'Super Admin' : 'Admin'}
            </Badge>
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
                        </div>
                        {getStatusBadge(sub.status)}
                      </div>

                      <p className="text-slate-600 mb-4 line-clamp-2">{sub.description}</p>

                      {/* Admin Notes */}
                      {sub.adminNotes && (
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Admin Notes</p>
                          <p className="text-sm text-slate-700">{sub.adminNotes}</p>
                        </div>
                      )}

                      {/* Review Info */}
                      {sub.reviewedBy && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <CheckCheck className="h-3.5 w-3.5" />
                          Reviewed by <span className="font-semibold">{sub.reviewedBy}</span> on {new Date(sub.reviewedAt).toLocaleDateString()}
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
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* User Management View - Only for Superadmins */}
        {activeView === 'users' && user?.adminLevel === 'superadmin' && (
          <>
            {showUserForm ? (
              <div className="mb-8">
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                    }}
                    className="text-[#003366] hover:underline text-sm font-medium"
                  >
                    ← Back to Users
                  </button>
                </div>
                <UserForm
                  user={editingUser}
                  onSubmit={handleUserSubmit}
                  onCancel={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                  }}
                  loading={userLoading}
                />
              </div>
            ) : (
              <>
                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Total Users</p>
                          <p className="text-3xl font-bold text-slate-900 mt-1">{userStats.totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-slate-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Admin Users</p>
                          <p className="text-3xl font-bold text-blue-600 mt-1">{userStats.adminCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Shield className="h-6 w-6 text-blue-600" />
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
                    </CardContent>
                  </Card>
                </div>

                {/* Create Button */}
                <div className="mb-6">
                  <Button
                    onClick={() => setShowUserForm(true)}
                    className="bg-[#003366] hover:bg-[#0A4D8C] text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New User
                  </Button>
                </div>

                {/* Users List */}
                <UserList
                  users={users}
                  searchTerm={userSearchTerm}
                  onSearchChange={setUserSearchTerm}
                  onEdit={(user) => {
                    setEditingUser(user);
                    setShowUserForm(true);
                  }}
                  onDelete={handleDeleteUser}
                  onView={setViewingUser}
                  loading={userLoading}
                />
              </>
            )}
          </>
        )}

        {/* Applications View - Only for Superadmins */}
        {activeView === 'applications' && user?.adminLevel === 'superadmin' && (
          <>
            {/* Search & Filter */}
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, subject, or reference..."
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
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Rejected</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">
                        {allApplications.filter(a => a.status === 'Rejected').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {submissionsLoading ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#003366] mx-auto" />
                    <p className="text-slate-500 mt-4">Loading applications...</p>
                  </CardContent>
                </Card>
              ) : allApplications.filter((app) => {
                const matchesSearch =
                  app.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.id?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
                return matchesSearch && matchesFilter;
              }).length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-16 text-center">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Applications Found</h3>
                    <p className="text-slate-500">
                      {searchTerm || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No applications have been received yet.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                allApplications.filter((app) => {
                  const matchesSearch =
                    app.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.id?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
                  return matchesSearch && matchesFilter;
                }).map((app) => (
                  <Card key={app.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{app.subject}</h3>
                            {getPriorityBadge(app.priority)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5" />
                              <span className="font-mono font-semibold text-[#003366]">{app.id}</span>
                            </span>
                            <span>•</span>
                            <span>{app.citizenName} ({app.citizenEmail})</span>
                            <span>•</span>
                            <span>{app.submittedDate}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            Department: <span className="text-slate-600">{app.department ? app.department.toUpperCase() : 'N/A'}</span>
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <p className="text-slate-600 mb-4 line-clamp-2">{app.description}</p>

                      {/* Admin Notes */}
                      {app.adminNotes && (
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Admin Notes</p>
                          <p className="text-sm text-slate-700">{app.adminNotes}</p>
                        </div>
                      )}

                      {/* Review Info */}
                      {app.reviewedBy && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <CheckCheck className="h-3.5 w-3.5" />
                          Reviewed by <span className="font-semibold">{app.reviewedBy}</span> on {new Date(app.reviewedAt).toLocaleDateString()}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        {selectedSubmission === app.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              placeholder="Add a note..."
                              value={adminNote}
                              onChange={(e) => setAdminNote(e.target.value)}
                              disabled={submissionsLoading}
                              className="flex-1 text-sm h-9"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={submissionsLoading || !adminNote.trim()}
                              onClick={() => handleAddNote(app.id)}
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
          </>
        )}

        {/* Settings View - Only for Superadmins */}
        {activeView === 'settings' && user?.adminLevel === 'superadmin' && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Settings Management</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Settings Coming Soon</h3>
              <p className="text-slate-500">
                System settings and configuration options will be available here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* User Detail Modal */}
      {viewingUser && (
        <UserModal user={viewingUser} onClose={() => setViewingUser(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
