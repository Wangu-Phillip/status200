import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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
  Upload,
  Check,
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
  const [tenderView, setTenderView] = useState('submissions'); // 'submissions' or 'postings'
  const [tenderPostings, setTenderPostings] = useState([]);
  const [tenderPostingsLoading, setTenderPostingsLoading] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [editingTender, setEditingTender] = useState(null);
  const [tenderDocumentsLoading, setTenderDocumentsLoading] = useState(false);
  const [formDocuments, setFormDocuments] = useState([]); // Files to upload with tender
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
  const [departmentStats, setDepartmentStats] = useState({
    licensing: { total: 0, pending: 0, approved: 0, rejected: 0 },
    complaints: { total: 0, pending: 0, approved: 0, rejected: 0 },
    tenders: { total: 0, pending: 0, approved: 0, rejected: 0 },
    qos: { total: 0, pending: 0, approved: 0, rejected: 0 },
  });
  const [systemStatsLoading, setSystemStatsLoading] = useState(false);
  
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
    // Load users and system stats if superadmin
    if (user.adminLevel === 'superadmin') {
      loadUsers();
      loadSystemStats();
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

  const loadSystemStats = async () => {
    setSystemStatsLoading(true);
    try {
      const depts = ['licensing', 'complaints', 'tenders', 'qos'];
      const statsData = {};

      for (const dept of depts) {
        try {
          console.log(`Fetching stats for department: ${dept}`);
          const data = await adminApi.getAdminStats(dept);
          console.log(`✓ ${dept} stats:`, data);
          
          statsData[dept] = {
            total: data.total || 0,
            pending: (data.pending || 0) + (data.underReview || 0),
            approved: data.approved || 0,
            rejected: data.rejected || 0,
          };
        } catch (error) {
          console.error(`✗ Failed to load ${dept} stats:`, error.message);
          statsData[dept] = { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
      }

      console.log('Final system stats:', statsData);
      setDepartmentStats(statsData);
    } catch (error) {
      console.error('Failed to load system stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system statistics',
        variant: 'destructive',
      });
    } finally {
      setSystemStatsLoading(false);
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

  const loadTenderPostings = async () => {
    setTenderPostingsLoading(true);
    try {
      const data = await adminApi.getTenderPostings({ page: 1, limit: 100 });
      setTenderPostings(data.postings || []);
    } catch (error) {
      console.error('Failed to load tender postings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tender postings',
        variant: 'destructive',
      });
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleCreateTenderPosting = async (submitFormData) => {
    setTenderPostingsLoading(true);
    try {
      const response = await adminApi.createTenderPosting(submitFormData);
      const newTenderId = response.posting?.id;

      // Upload documents if any
      if (formDocuments.length > 0 && newTenderId) {
        for (const file of formDocuments) {
          const docData = {
            filename: file.name,
            fileType: file.type,
            filePath: `tenders/${newTenderId}/${file.name}`,
            fileSize: file.size,
          };
          await adminApi.uploadTenderPostingDocument(newTenderId, docData);
        }
      }

      toast({
        title: 'Success',
        description: formDocuments.length > 0 
          ? `Tender posting created with ${formDocuments.length} document(s)` 
          : 'Tender posting created successfully',
      });
      handleFormReset();
      loadTenderPostings();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleDeleteTenderPosting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tender posting?')) {
      return;
    }
    setTenderPostingsLoading(true);
    try {
      await adminApi.deleteTenderPosting(id);
      toast({
        title: 'Success',
        description: 'Tender posting deleted successfully',
      });
      loadTenderPostings();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleEditTender = (tender) => {
    setFormData({
      tenderNumber: tender.tenderNumber,
      title: tender.title,
      category: tender.category,
      closingDate: tender.closingDate,
      estimatedValue: tender.estimatedValue || '',
      location: tender.location || '',
      description: tender.description,
    });
    setEditingTender(tender);
    setShowTenderForm(true);
    setFormDocuments([]);
    setDocumentsToDeleteAfterSave([]);
  };

  const handleUpdateTenderPosting = async (formDataToUpdate) => {
    setTenderPostingsLoading(true);
    try {
      // Update the tender posting
      await adminApi.updateTenderPosting(editingTender.id, formDataToUpdate);
      
      // Delete marked documents
      for (const docId of documentsToDeleteAfterSave) {
        await adminApi.deleteTenderDocument(docId);
      }
      
      // Upload new documents
      for (const file of formDocuments) {
        const docData = {
          filename: file.name,
          fileType: file.type,
          filePath: `tenders/${editingTender.id}/${file.name}`,
          fileSize: file.size,
        };
        await adminApi.uploadTenderPostingDocument(editingTender.id, docData);
      }
      
      toast({
        title: 'Success',
        description: 'Tender posting updated successfully',
      });
      setShowTenderForm(false);
      setEditingTender(null);
      setFormDocuments([]);
      setDocumentsToDeleteAfterSave([]);
      loadTenderPostings();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTenderPostingsLoading(false);
    }
  };

  const handleFormReset = () => {
    setFormData({
      tenderNumber: '',
      title: '',
      category: '',
      closingDate: '',
      estimatedValue: '',
      location: '',
      description: '',
    });
    setFormDocuments([]);
    setDocumentsToDeleteAfterSave([]);
    setEditingTender(null);
    setShowTenderForm(false);
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
      'Approved': { className: 'bg-emerald-500 hover:bg-emerald-600', icon: CheckCircle },
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
                ? 'Dashboard' 
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
                ? `Welcome back, ${user.name}. Here's what's happening in your department.`
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
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.approved || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          /* Dashboard View - Always visible */
          <>
            {user?.adminLevel === 'superadmin' ? (
              /* Superadmin Dashboard */
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
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

                  <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
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

                  <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Citizen Users</p>
                          <p className="text-3xl font-bold text-teal-600 mt-1">{userStats.citizenCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-teal-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Charts */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">System Analytics</h2>
                    <Button
                      onClick={loadSystemStats}
                      disabled={systemStatsLoading}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {systemStatsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <BarChart3 className="h-4 w-4" />
                      )}
                      Refresh Data
                    </Button>
                  </div>
                  
                  {systemStatsLoading ? (
                    <Card className="bg-white border-0 shadow-md">
                      <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003366] mx-auto" />
                        <p className="text-slate-500 mt-4">Loading system analytics...</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Applications by Department */}
                      <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">Applications by Department</CardTitle>
                          <CardDescription>Total submissions per department</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                              { name: 'Licensing', value: departmentStats.licensing?.total || 0, fill: '#3b82f6' },
                              { name: 'Complaints', value: departmentStats.complaints?.total || 0, fill: '#f97316' },
                              { name: 'Tenders', value: departmentStats.tenders?.total || 0, fill: '#10b981' },
                              { name: 'QoS', value: departmentStats.qos?.total || 0, fill: '#a855f7' },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Applications by Status */}
                      <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">Applications by Status</CardTitle>
                          <CardDescription>Overall submission status distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={[
                                  { 
                                    name: 'Pending', 
                                    value: (departmentStats.licensing?.pending || 0) + (departmentStats.complaints?.pending || 0) + (departmentStats.tenders?.pending || 0) + (departmentStats.qos?.pending || 0),
                                    fill: '#f59e0b'
                                  },
                                  { 
                                    name: 'Approved', 
                                    value: (departmentStats.licensing?.approved || 0) + (departmentStats.complaints?.approved || 0) + (departmentStats.tenders?.approved || 0) + (departmentStats.qos?.approved || 0),
                                    fill: '#10b981'
                                  },
                                  { 
                                    name: 'Rejected', 
                                    value: (departmentStats.licensing?.rejected || 0) + (departmentStats.complaints?.rejected || 0) + (departmentStats.tenders?.rejected || 0) + (departmentStats.qos?.rejected || 0),
                                    fill: '#ef4444'
                                  },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#f59e0b" />
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* User Distribution */}
                      <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">User Distribution</CardTitle>
                          <CardDescription>System users by type</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Admin Users', value: userStats.adminCount, fill: '#3b82f6' },
                                  { name: 'Citizen Users', value: userStats.citizenCount, fill: '#14b8a6' },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#14b8a6" />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Department Status Breakdown */}
                      <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">Department Status Summary</CardTitle>
                          <CardDescription>Status breakdown by department</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(departmentStats).map(([dept, stats]) => (
                            <div key={dept} className="border-b border-slate-100 pb-4 last:border-b-0">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-slate-900 capitalize">{dept}</h4>
                                <span className="text-sm font-bold text-slate-600">{stats.total} total</span>
                              </div>
                              <div className="flex gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                  <span className="text-slate-600">Pending: {stats.pending}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <span className="text-slate-600">Approved: {stats.approved}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="text-slate-600">Rejected: {stats.rejected}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </>
            ) : user?.adminLevel === 'admin' && !user?.department ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-16 text-center">
                  <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Department Selected</h3>
                  <p className="text-slate-500">
                    Please select a department from your profile to access submissions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Dashboard</h2>
                <p className="text-slate-500 mb-6">
                  Navigate to Submissions to review current submissions.
                </p>
              </div>
            )}
          </>
        )}

        {/* Submissions View - Only show when department is selected */}
        {activeView === 'submissions' && user?.department && (
          <>
            {/* Tender View Toggle - Only for Tenders Department */}
            {user?.department === DEPARTMENTS.TENDERS && (
              <div className="mb-6 flex gap-2">
                <Button
                  onClick={() => {
                    setTenderView('submissions');
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  variant={tenderView === 'submissions' ? 'default' : 'outline'}
                  className={`gap-2 ${
                    tenderView === 'submissions'
                      ? 'bg-[#003366] hover:bg-[#0A4D8C]'
                      : 'border-slate-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Tender Submissions
                </Button>
                <Button
                  onClick={() => {
                    setTenderView('postings');
                    loadTenderPostings();
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  variant={tenderView === 'postings' ? 'default' : 'outline'}
                  className={`gap-2 ${
                    tenderView === 'postings'
                      ? 'bg-[#003366] hover:bg-[#0A4D8C]'
                      : 'border-slate-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Tender Postings
                </Button>
              </div>
            )}

            {/* Tender Postings View */}
            {tenderView === 'postings' && user?.department === DEPARTMENTS.TENDERS ? (
              <>
                {/* Create Button */}
                {!showTenderForm && (
                  <div className="mb-6">
                    <Button
                      onClick={() => setShowTenderForm(true)}
                      className="bg-[#003366] hover:bg-[#0A4D8C] text-white gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Tender
                    </Button>
                  </div>
                )}

                {/* Create/Edit Tender Form */}
                {showTenderForm && (
                  <Card className="border-0 shadow-md mb-6 bg-slate-50">
                    <CardHeader>
                      <CardTitle>{editingTender ? 'Edit Tender Posting' : 'Create New Tender Posting'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Tender Number *</label>
                          <Input
                            placeholder="e.g., TND-2026-001"
                            className="border-slate-200"
                            value={formData.tenderNumber}
                            onChange={(e) => setFormData({...formData, tenderNumber: e.target.value})}
                            disabled={editingTender}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
                          <Input
                            placeholder="Tender title"
                            className="border-slate-200"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Category *</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                          >
                            <option value="">Select a category</option>
                            <option value="Goods">Goods</option>
                            <option value="Services">Services</option>
                            <option value="Works">Works</option>
                            <option value="Consultancy">Consultancy</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Closing Date *</label>
                          <Input
                            type="datetime-local"
                            className="border-slate-200"
                            value={formData.closingDate}
                            onChange={(e) => setFormData({...formData, closingDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Estimated Value</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="border-slate-200"
                            value={formData.estimatedValue}
                            onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Location</label>
                          <Input
                            placeholder="Tender location"
                            className="border-slate-200"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                        <textarea
                          placeholder="Tender description and requirements"
                          className="w-full h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>

                      {/* Existing Documents (Edit Mode) */}
                      {editingTender && editingTender.documents && editingTender.documents.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="font-semibold text-slate-900 mb-2">Existing Documents</h4>
                          <div className="space-y-2">
                            {editingTender.documents
                              .filter(doc => !documentsToDeleteAfterSave.includes(doc.id))
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-600" />
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">{doc.filename}</p>
                                      <p className="text-xs text-slate-500">{(doc.fileSize / 1024).toFixed(2)} KB</p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDocumentsToDeleteAfterSave([...documentsToDeleteAfterSave, doc.id])}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* New Documents Upload */}
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-3">Upload Documents</h4>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#003366] transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="formDocumentUpload"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              setFormDocuments([...formDocuments, ...files]);
                              e.target.value = '';
                            }}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                          />
                          <label htmlFor="formDocumentUpload" className="flex flex-col items-center cursor-pointer">
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX, XLS, XLSX, PPT, ZIP</p>
                          </label>
                        </div>
                        
                        {/* Selected Files List */}
                        {formDocuments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-slate-700">Selected Documents ({formDocuments.length})</p>
                            {formDocuments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-slate-600" />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setFormDocuments(formDocuments.filter((_, i) => i !== index))}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={handleFormReset}
                          variant="outline"
                          disabled={tenderPostingsLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (!formData.tenderNumber || !formData.title || !formData.category || !formData.closingDate || !formData.description) {
                              toast({
                                title: 'Error',
                                description: 'Please fill in all required fields',
                                variant: 'destructive',
                              });
                              return;
                            }

                            const submitData = {
                              tenderNumber: formData.tenderNumber,
                              title: formData.title,
                              category: formData.category,
                              closingDate: formData.closingDate,
                              description: formData.description,
                              estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
                              location: formData.location || null,
                            };

                            if (editingTender) {
                              handleUpdateTenderPosting(submitData);
                            } else {
                              handleCreateTenderPosting(submitData);
                            }
                          }}
                          disabled={tenderPostingsLoading}
                          className="bg-[#003366] hover:bg-[#0A4D8C] text-white"
                        >
                          {tenderPostingsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : editingTender ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Update Tender
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Tender
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tender Postings List */}
                <div className="space-y-4">
                  {tenderPostingsLoading && !showTenderForm ? (
                    <Card className="border-0 shadow-md">
                      <CardContent className="py-16 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003366] mx-auto" />
                        <p className="text-slate-500 mt-4">Loading tender postings...</p>
                      </CardContent>
                    </Card>
                  ) : tenderPostings.length === 0 ? (
                    <Card className="border-0 shadow-md">
                      <CardContent className="py-16 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Tender Postings</h3>
                        <p className="text-slate-500">
                          Create your first tender posting to get started.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    tenderPostings.map((tender) => (
                      <Card key={tender.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">{tender.title}</h3>
                                <Badge className={`${
                                  tender.status === 'Open' ? 'bg-green-500' :
                                  tender.status === 'Closed' ? 'bg-amber-500' :
                                  'bg-slate-500'
                                }`}>
                                  {tender.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                                <span className="flex items-center gap-1.5">
                                  <Hash className="h-3.5 w-3.5" />
                                  <span className="font-mono font-semibold text-[#003366]">{tender.tenderNumber}</span>
                                </span>
                                <span>•</span>
                                <span>{tender.category}</span>
                                <span>•</span>
                                <span>Closes: {new Date(tender.closingDate).toLocaleDateString()}</span>
                              </div>
                              {tender.estimatedValue && (
                                <div className="text-sm text-slate-600 font-semibold">
                                  Estimated Value: ${tender.estimatedValue.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-slate-600 mb-4 line-clamp-2">{tender.description}</p>

                          {/* Documents Section */}
                          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-slate-900">Documents ({tender.documents?.length || 0})</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-sm gap-1"
                                onClick={() => {
                                  // TODO: Show upload modal
                                  toast({
                                    title: 'Upload Documents',
                                    description: 'Document upload functionality coming soon',
                                  });
                                }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Document
                              </Button>
                            </div>
                            {tender.documents && tender.documents.length > 0 ? (
                              <div className="space-y-2">
                                {tender.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-2 bg-white rounded border border-slate-200"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-slate-600" />
                                      <div>
                                        <p className="text-sm font-medium text-slate-900">{doc.filename}</p>
                                        <p className="text-xs text-slate-500">{(doc.fileSize / 1024).toFixed(2)} KB</p>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => {
                                        if (window.confirm('Delete this document?')) {
                                          adminApi.deleteTenderDocument(doc.id).then(() => {
                                            toast({
                                              title: 'Success',
                                              description: 'Document deleted successfully',
                                            });
                                            loadTenderPostings();
                                          });
                                        }
                                      }}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500">No documents uploaded yet</p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={tenderPostingsLoading}
                              onClick={() => handleEditTender(tender)}
                              className="text-slate-600 border-slate-200"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={tenderPostingsLoading}
                              onClick={() => handleDeleteTenderPosting(tender.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Original Submissions View */}
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
                            {/* Status buttons vary by department */}
                            {user?.department === 'complaints' ? (
                              <>
                                {sub.status === 'Registered' && (
                                  <Button
                                    size="sm"
                                    disabled={submissionsLoading}
                                    className="bg-[#003366] hover:bg-[#003366] text-white"
                                    onClick={() => handleStatusChange(sub.id, 'Acknowledged')}
                                  >
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    Acknowledge
                                  </Button>
                                )}
                                {(sub.status === 'Registered' || sub.status === 'Acknowledged') && (
                                  <Button
                                    size="sm"
                                    disabled={submissionsLoading}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={() => handleStatusChange(sub.id, 'In Progress')}
                                  >
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    In Progress
                                  </Button>
                                )}
                                {(sub.status === 'Registered' || sub.status === 'Acknowledged' || sub.status === 'In Progress') && (
                                  <Button
                                    size="sm"
                                    disabled={submissionsLoading}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => handleStatusChange(sub.id, 'Resolved')}
                                  >
                                    <CheckCheck className="h-4 w-4 mr-1.5" />
                                    Resolve
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
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
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
                          <p className="text-3xl font-bold text-teal-600 mt-1">{userStats.citizenCount}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-teal-600" />
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
                      <p className="text-3xl font-bold text-emerald-600 mt-1">
                        {allApplications.filter(a => a.status === 'Approved').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
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
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
