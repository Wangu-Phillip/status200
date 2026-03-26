import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCheck,
  CheckCircle,
  ChevronDown,
  Eye,
  FileText,
  Hash,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Users,
  X as XIcon,
  XCircle,
  Zap,
  Clock,
} from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import UserForm from '../components/admin/UserForm';
import UserList from '../components/admin/UserList';
import UserModal from '../components/admin/UserModal';
import * as adminApi from '../services/api';
import { DEPARTMENTS, DEPARTMENT_COLORS, DEPARTMENT_LABELS } from '../utils/persistence';

const BRAND = {
  navy: '#003366',
  dark: '#001F40',
  blue: '#2C7DA0',
  green: '#2EAD6F',
  red: '#C62828',
  yellow: '#F2C94C',
  tint: '#E8F0F9',
};

const departmentNavigation = [
  { key: DEPARTMENTS.LICENSING, label: 'Licensing', icon: Zap },
  { key: DEPARTMENTS.COMPLAINTS, label: 'Complaints', icon: MessageSquare },
  { key: DEPARTMENTS.QOS, label: 'Quality of Service', icon: BarChart3 },
  { key: DEPARTMENTS.TENDERS, label: 'Tenders', icon: Briefcase },
];

const systemViews = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users, superadminOnly: true },
  { id: 'applications', label: 'All Applications', icon: FileText, superadminOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings, superadminOnly: true },
];

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getDepartmentIcon = (department) => {
  switch (department) {
    case DEPARTMENTS.LICENSING:
      return Zap;
    case DEPARTMENTS.COMPLAINTS:
      return MessageSquare;
    case DEPARTMENTS.QOS:
      return BarChart3;
    case DEPARTMENTS.TENDERS:
      return Briefcase;
    default:
      return Shield;
  }
};

const getStatusBadge = (status) => {
  const statusMap = {
    Approved: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    'Under Review': { className: 'bg-sky-100 text-sky-700 border-sky-200', icon: Clock },
    'Pending Review': { className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    Submitted: { className: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText },
    Registered: { className: 'bg-violet-100 text-violet-700 border-violet-200', icon: Shield },
    Rejected: { className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  };

  const config = statusMap[status] || statusMap.Submitted;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} gap-1 border`}>
      <Icon className="h-3 w-3" />
      {status || 'Unknown'}
    </Badge>
  );
};

const getPriorityBadge = (priority) => {
  const className =
    priority === 'High'
      ? 'bg-red-100 text-red-700 border-red-200'
      : priority === 'Medium'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  return (
    <Badge variant="outline" className={`${className} border`}>
      {priority || 'Normal'}
    </Badge>
  );
};

const SurfaceCard = ({ children, className = '' }) => (
  <Card className={`rounded-[1.75rem] border-slate-200 shadow-sm ${className}`}>{children}</Card>
);

const StatTile = ({ label, value, accent, icon: Icon, helper }) => (
  <SurfaceCard>
    <CardContent className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </SurfaceCard>
);

const AdminSidebar = ({
  mobileSidebarOpen,
  onCloseMobile,
  user,
  activeView,
  onViewChange,
  onDepartmentChange,
  onLogout,
}) => {
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const DeptIcon = getDepartmentIcon(user?.department);

  return (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col border-r border-white/10 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: BRAND.dark }}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
              <img src="/logo.png" alt="BOCRA" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">BOCRA</p>
              <p className="text-sm font-semibold text-white">Admin Portal</p>
            </div>
          </Link>
        </div>

        <div className="border-b border-white/10 px-4 py-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: BRAND.yellow, color: BRAND.dark }}>
                <DeptIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Department</p>
                <p className="text-sm font-semibold text-white">
                  {DEPARTMENT_LABELS[user?.department]?.split(' &')[0] || 'General'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
          <div className="space-y-2">
            {systemViews
              .filter((item) => !item.superadminOnly || user?.adminLevel === 'superadmin')
              .map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onViewChange(item.id);
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      active ? 'text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.10)' : 'transparent' }}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: active ? BRAND.yellow : 'rgba(255,255,255,0.06)', color: active ? BRAND.dark : '#E2E8F0' }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
          </div>

          {user?.adminLevel === 'superadmin' && (
            <>
              <p className="mb-3 mt-6 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Departments</p>
              <div className="space-y-2">
                {departmentNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = activeView === 'submissions' && user?.department === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        onDepartmentChange(item.key);
                        onCloseMobile();
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                        active ? 'text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                      style={{ backgroundColor: active ? 'rgba(255,255,255,0.10)' : 'transparent' }}
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: active ? BRAND.blue : 'rgba(255,255,255,0.06)', color: '#E2E8F0' }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold" style={{ backgroundColor: BRAND.yellow, color: BRAND.dark }}>
                {initials || 'AD'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user?.name || 'Admin user'}</p>
                <p className="truncate text-xs text-slate-400">{user?.email || 'admin@bocra.co.bw'}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userStats, setUserStats] = useState({ totalUsers: 0, adminCount: 0, citizenCount: 0 });

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

  useEffect(() => {
    if (!user) return;

    if (user.adminLevel === 'admin' && !user.department) {
      navigate('/login');
      return;
    }

    refreshData();
    if (user.adminLevel === 'superadmin') {
      loadUsers();
    }
  }, [user, navigate]);

  const persistUser = (nextUser) => {
    localStorage.setItem('bocra_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    localStorage.removeItem('bocra_token');
    navigate('/login');
  };

  const loadUsers = async () => {
    setUserLoading(true);
    const token = localStorage.getItem('bocra_token');

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      const allUsers = data.users || [];
      setUsers(allUsers);
      setUserStats({
        totalUsers: allUsers.length,
        adminCount: allUsers.filter((entry) => entry.userType === 'admin').length,
        citizenCount: allUsers.filter((entry) => entry.userType === 'client').length,
      });
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to load users', variant: 'destructive' });
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save user');
      }

      toast({ title: 'Success', description: editingUser ? 'User updated successfully' : 'User created successfully' });
      setShowUserForm(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to save user', variant: 'destructive' });
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) {
      return;
    }

    setUserLoading(true);
    const token = localStorage.getItem('bocra_token');

    try {
      const response = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast({ title: 'Success', description: 'User deleted successfully' });
      await loadUsers();
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to delete user', variant: 'destructive' });
    } finally {
      setUserLoading(false);
    }
  };

  const loadAllApplications = async () => {
    setSubmissionsLoading(true);
    try {
      let combined = [];

      try {
        const licensingData = await adminApi.getSubmissions({ department: 'licensing', page: 1, limit: 100 });
        combined = [...combined, ...(licensingData.submissions || [])];
      } catch (error) {
        console.error('Failed to load licensing applications:', error);
      }

      try {
        const complaintsData = await adminApi.getAdminComplaints({ page: 1, limit: 100 });
        combined = [...combined, ...(complaintsData.complaints || [])];
      } catch (error) {
        console.error('Failed to load complaints:', error);
      }

      try {
        const tendersData = await adminApi.getAdminTenders({ page: 1, limit: 100 });
        combined = [...combined, ...(tendersData.tenders || [])];
      } catch (error) {
        console.error('Failed to load tenders:', error);
      }

      setAllApplications(combined);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const refreshData = async () => {
    if (!user) return;

    if (user.adminLevel === 'superadmin' && !user.department) {
      setSubmissions([]);
      setComplaints([]);
      setTenders([]);
      setStats({});
      return;
    }

    setSubmissionsLoading(true);
    try {
      const department = user.department;

      if (department === 'licensing') {
        const submissionsData = await adminApi.getSubmissions({ department, page: 1, limit: 100 });
        setSubmissions(submissionsData.submissions || []);
        setComplaints([]);
        setTenders([]);
      } else if (department === 'complaints') {
        const complaintsData = await adminApi.getAdminComplaints({ page: 1, limit: 100 });
        setComplaints(complaintsData.complaints || []);
        setSubmissions([]);
        setTenders([]);
      } else if (department === 'tenders') {
        const tendersData = await adminApi.getAdminTenders({ page: 1, limit: 100 });
        setTenders(tendersData.tenders || []);
        setSubmissions([]);
        setComplaints([]);
      } else {
        setSubmissions([]);
        setComplaints([]);
        setTenders([]);
      }

      const statsData = await adminApi.getAdminStats(department);
      setStats(statsData || {});
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({ title: 'Error', description: 'Failed to load department data', variant: 'destructive' });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleStatusChange = async (token, newStatus) => {
    try {
      setSubmissionsLoading(true);
      const department = user?.department;

      if (department === 'complaints') {
        await adminApi.updateComplaintStatus(token, newStatus);
      } else if (department === 'tenders') {
        await adminApi.updateTenderStatus(token, newStatus);
      } else {
        await adminApi.updateSubmissionStatus(token, newStatus);
      }

      await refreshData();
      setSelectedSubmission(null);
      toast({ title: 'Status updated', description: `Item ${token} moved to ${newStatus}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleAddNote = async (token) => {
    if (!adminNote.trim()) return;

    try {
      setSubmissionsLoading(true);
      const department = user?.department;

      if (department === 'complaints') {
        await adminApi.addComplaintNotes(token, adminNote);
      } else if (department === 'tenders') {
        await adminApi.addTenderNotes(token, adminNote);
      } else {
        await adminApi.addSubmissionNotes(token, adminNote);
      }

      setAdminNote('');
      await refreshData();
      setSelectedSubmission(null);
      toast({ title: 'Note added', description: `Internal note saved for ${token}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const activeData = useMemo(() => {
    if (user?.department === 'complaints') return complaints;
    if (user?.department === 'tenders') return tenders;
    return submissions;
  }, [complaints, submissions, tenders, user?.department]);

  const filteredSubmissions = useMemo(() => {
    return activeData.filter((entry) => {
      const haystack = `${entry.citizenName || ''} ${entry.subject || ''} ${entry.id || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || entry.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [activeData, filterStatus, searchTerm]);

  const filteredApplications = useMemo(() => {
    return allApplications.filter((entry) => {
      const haystack = `${entry.citizenName || ''} ${entry.subject || ''} ${entry.id || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || entry.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [allApplications, filterStatus, searchTerm]);

  const headerTitle = useMemo(() => {
    if (activeView === 'dashboard') return 'Admin Dashboard';
    if (activeView === 'users') return 'User Management';
    if (activeView === 'applications') return 'All Applications';
    if (activeView === 'settings') return 'System Settings';
    return `${DEPARTMENT_LABELS[user?.department] || 'Department'} Submissions`;
  }, [activeView, user?.department]);

  const headerDescription = useMemo(() => {
    if (activeView === 'dashboard') {
      return `Welcome back, ${user?.name || 'Admin'}. Here is the latest operational overview.`;
    }
    if (activeView === 'users') return 'Manage user accounts, access levels, and admin roles.';
    if (activeView === 'applications') return 'Review submissions across licensing, complaints, and tenders.';
    if (activeView === 'settings') return 'System preferences and administrative configuration.';
    return `Review and manage current items for ${DEPARTMENT_LABELS[user?.department] || 'this department'}.`;
  }, [activeView, user?.department, user?.name]);

  const dashboardStats = useMemo(() => {
    return [
      { label: 'Total', value: stats.total || 0, icon: FileText, accent: BRAND.blue, helper: 'All items in queue' },
      { label: 'Pending', value: stats.pending || 0, icon: Clock, accent: BRAND.yellow, helper: 'Awaiting review' },
      { label: 'High Priority', value: stats.highPriority || 0, icon: AlertCircle, accent: BRAND.red, helper: 'Needs immediate action' },
      { label: 'Approved', value: stats.approved || 0, icon: CheckCircle, accent: BRAND.green, helper: 'Resolved or approved' },
    ];
  }, [stats]);

  if (!user) return null;

  const DeptIcon = getDepartmentIcon(user.department);
  const deptTheme = DEPARTMENT_COLORS[user.department] || {
    bg: 'bg-[#003366]',
    text: 'text-[#003366]',
    light: 'bg-[#E8F0F9]',
  };

  const renderFilterBar = (placeholder) => (
    <SurfaceCard className="mb-6">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={placeholder}
              className="h-11 rounded-xl border-slate-200 pl-11"
            />
          </div>
          <div className="relative min-w-[190px]">
            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Registered">Registered</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </SurfaceCard>
  );

  const renderSubmissionList = (items, emptyTitle, emptyBody) => {
    if (submissionsLoading) {
      return (
        <SurfaceCard>
          <CardContent className="py-16 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-500" />
            <p className="mt-4 text-sm text-slate-500">Loading items...</p>
          </CardContent>
        </SurfaceCard>
      );
    }

    if (items.length === 0) {
      return (
        <SurfaceCard>
          <CardContent className="py-16 text-center">
            <DeptIcon className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{emptyTitle}</h3>
            <p className="mt-2 text-sm text-slate-500">{emptyBody}</p>
          </CardContent>
        </SurfaceCard>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <SurfaceCard key={item.id} className="overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">{item.subject || 'Untitled submission'}</h3>
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                      <Hash className="h-3.5 w-3.5" />
                      {item.id}
                    </span>
                    <span>{item.citizenName || 'Unknown applicant'}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                    <span>{item.citizenEmail || 'No email'}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                    <span>{item.submittedDate || formatDate(item.createdAt)}</span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.description || 'No description provided.'}</p>

                  {item.adminNotes ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin notes</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{item.adminNotes}</p>
                    </div>
                  ) : null}

                  {item.reviewedBy ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      <CheckCheck className="h-3.5 w-3.5" />
                      Reviewed by {item.reviewedBy} on {formatDate(item.reviewedAt)}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-5">
                {selectedSubmission === item.id ? (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <Input
                      value={adminNote}
                      onChange={(event) => setAdminNote(event.target.value)}
                      placeholder="Add an internal note before updating the item..."
                      className="h-11 rounded-xl border-slate-200"
                      disabled={submissionsLoading}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddNote(item.id)}
                        disabled={submissionsLoading || !adminNote.trim()}
                        className="h-11 rounded-xl"
                      >
                        {submissionsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setSelectedSubmission(null);
                          setAdminNote('');
                        }}
                        className="h-11 rounded-xl text-slate-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedSubmission(item.id)}
                      className="h-10 rounded-xl border-slate-200"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>

                    {item.status === 'Submitted' && (
                      <Button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'Under Review')}
                        className="h-10 rounded-xl text-white"
                        style={{ backgroundColor: BRAND.navy }}
                        disabled={submissionsLoading}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Start Review
                      </Button>
                    )}

                    {(item.status === 'Submitted' || item.status === 'Under Review') && (
                      <>
                        <Button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'Approved')}
                          className="h-10 rounded-xl text-white"
                          style={{ backgroundColor: BRAND.green }}
                          disabled={submissionsLoading}
                        >
                          <CheckCheck className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'Rejected')}
                          className="h-10 rounded-xl text-white"
                          style={{ backgroundColor: BRAND.red }}
                          disabled={submissionsLoading}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </SurfaceCard>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif' }}>
      <button
        type="button"
        onClick={() => setMobileSidebarOpen((previous) => !previous)}
        className="fixed left-4 top-4 z-[60] inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileSidebarOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AdminSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        user={user}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setSearchTerm('');
          setFilterStatus('all');
          if (view === 'applications') loadAllApplications();
        }}
        onDepartmentChange={(department) => {
          const updatedUser = { ...user, department };
          persistUser(updatedUser);
          setActiveView('submissions');
          setSearchTerm('');
          setFilterStatus('all');
          toast({ title: 'Department switched', description: `Now viewing ${DEPARTMENT_LABELS[department] || department}.` });
        }}
        onLogout={handleLogout}
      />

      <div className="lg:ml-[18rem]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-100/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <div className="pl-14 lg:pl-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Administrative workspace</p>
              <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">{headerTitle}</h1>
                  <p className="mt-1 text-sm text-slate-500">{headerDescription}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className={`border px-4 py-2 text-sm font-medium ${
                      user.adminLevel === 'superadmin'
                        ? 'border-violet-200 bg-violet-50 text-violet-700'
                        : 'border-sky-200 bg-sky-50 text-sky-700'
                    }`}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {user.adminLevel === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                    <DeptIcon className="mr-2 h-4 w-4" />
                    {DEPARTMENT_LABELS[user.department] || 'No department'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((item) => (
                  <StatTile key={item.label} {...item} />
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                <SurfaceCard>
                  <CardContent className="p-6 sm:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                      <BarChart3 className="h-3.5 w-3.5" style={{ color: BRAND.blue }} />
                      Overview
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">Department activity at a glance</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                      Review incoming submissions, monitor items awaiting action, and keep department operations organised through a clear mobile-ready administrative layout.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] p-5" style={{ backgroundColor: BRAND.tint }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Priority queue</p>
                        <p className="mt-3 text-3xl font-bold text-slate-950">{stats.highPriority || 0}</p>
                        <p className="mt-2 text-sm text-slate-600">High priority items that may require immediate review.</p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Current department</p>
                        <p className="mt-3 text-3xl font-bold text-slate-950">{DEPARTMENT_LABELS[user.department]?.split(' &')[0] || 'General'}</p>
                        <p className="mt-2 text-sm text-slate-600">Using BOCRA branded administrative surfaces and structured workflows.</p>
                      </div>
                    </div>
                  </CardContent>
                </SurfaceCard>

                <SurfaceCard>
                  <CardContent className="p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workflow shortcuts</p>
                    <div className="mt-5 space-y-4">
                      <button
                        type="button"
                        onClick={() => setActiveView('submissions')}
                        className="w-full rounded-[1.5rem] border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${BRAND.blue}18`, color: BRAND.blue }}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">Review department submissions</p>
                            <p className="text-sm text-slate-500">Go straight to the live queue.</p>
                          </div>
                        </div>
                      </button>

                      {user.adminLevel === 'superadmin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveView('users');
                            setShowUserForm(false);
                          }}
                          className="w-full rounded-[1.5rem] border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${BRAND.green}18`, color: BRAND.green }}>
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950">Manage users</p>
                              <p className="text-sm text-slate-500">Create, edit, or remove portal users.</p>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </CardContent>
                </SurfaceCard>
              </div>
            </div>
          )}

          {activeView === 'submissions' && (
            <>
              <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {dashboardStats.map((item) => (
                  <StatTile key={item.label} {...item} />
                ))}
              </div>
              {renderFilterBar('Search by applicant, subject, or reference token')}
              {renderSubmissionList(
                filteredSubmissions,
                'No submissions found',
                searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting the search or status filter.'
                  : 'No submissions have been received for this department yet.'
              )}
            </>
          )}

          {activeView === 'users' && user.adminLevel === 'superadmin' && (
            <>
              {showUserForm ? (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                    }}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    ← Back to users
                  </button>
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
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatTile label="Total Users" value={userStats.totalUsers} icon={Users} accent={BRAND.blue} helper="All registered accounts" />
                    <StatTile label="Admin Users" value={userStats.adminCount} icon={Shield} accent={BRAND.yellow} helper="Administrative access" />
                    <StatTile label="Citizen Users" value={userStats.citizenCount} icon={Users} accent={BRAND.green} helper="Client portal accounts" />
                  </div>

                  <div className="flex justify-start">
                    <Button
                      type="button"
                      onClick={() => setShowUserForm(true)}
                      className="h-11 rounded-xl text-white"
                      style={{ backgroundColor: BRAND.navy }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New User
                    </Button>
                  </div>

                  <UserList
                    users={users}
                    searchTerm={userSearchTerm}
                    onSearchChange={setUserSearchTerm}
                    onEdit={(nextUser) => {
                      setEditingUser(nextUser);
                      setShowUserForm(true);
                    }}
                    onDelete={handleDeleteUser}
                    onView={setViewingUser}
                    loading={userLoading}
                  />
                </div>
              )}
            </>
          )}

          {activeView === 'applications' && user.adminLevel === 'superadmin' && (
            <>
              <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatTile label="Total Applications" value={allApplications.length} icon={FileText} accent={BRAND.blue} helper="Across all departments" />
                <StatTile label="Pending Review" value={allApplications.filter((item) => item.status === 'Under Review').length} icon={Clock} accent={BRAND.yellow} helper="Currently under review" />
                <StatTile label="Approved" value={allApplications.filter((item) => item.status === 'Approved').length} icon={CheckCircle} accent={BRAND.green} helper="Completed successfully" />
                <StatTile label="Rejected" value={allApplications.filter((item) => item.status === 'Rejected').length} icon={XCircle} accent={BRAND.red} helper="Closed or declined" />
              </div>
              {renderFilterBar('Search by applicant, subject, or reference')}
              {renderSubmissionList(
                filteredApplications,
                'No applications found',
                searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting the search or status filter.'
                  : 'No applications have been received yet.'
              )}
            </>
          )}

          {activeView === 'settings' && user.adminLevel === 'superadmin' && (
            <SurfaceCard>
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">System settings</CardTitle>
                <CardDescription>Reserved for system-level configuration and administrative controls.</CardDescription>
              </CardHeader>
              <CardContent className="py-14 text-center">
                <Settings className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Settings coming soon</h3>
                <p className="mt-2 text-sm text-slate-500">This area is ready for future configuration modules and policy controls.</p>
              </CardContent>
            </SurfaceCard>
          )}
        </main>
      </div>

      {viewingUser ? <UserModal user={viewingUser} onClose={() => setViewingUser(null)} /> : null}
    </div>
  );
};

export default AdminDashboard;
