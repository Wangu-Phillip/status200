import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  getSubmissionsByDepartment,
  getDepartmentStats,
  updateSubmissionStatus,
  addAdminNote,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  DEPARTMENT_COLORS,
} from '../utils/persistence';
import { qosMetrics } from '../mockData';
import Analytics from '../components/Analytics';
import {
  Users,
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
  RefreshCw,
} from 'lucide-react';

import { Menu, X as XIcon } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

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
    if (!user?.department) return;
    refreshData();
  }, [user]);

  const refreshData = () => {
    if (!user?.department) return;
    const dept = user.department;
    setSubmissions(getSubmissionsByDepartment(dept));
    setStats(getDepartmentStats(dept));
  };

  const handleStatusChange = (token, newStatus) => {
    updateSubmissionStatus(token, newStatus, user.name);
    refreshData();
    setSelectedSubmission(null);
    toast({
      title: 'Status Updated',
      description: `Submission ${token} has been moved to ${newStatus}.`,
    });
  };

  const handleAddNote = (token) => {
    if (!adminNote.trim()) return;
    addAdminNote(token, adminNote);
    setAdminNote('');
    refreshData();
    toast({
      title: 'Note Added',
      description: `Internal admin note saved for ${token}.`,
    });
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

  const filteredSubmissions = submissions.filter((sub) => {
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>
          <button onClick={() => handleDisabledMock('Detailed Submissions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors">
            <FileText className="h-4 w-4" />
            Submissions
          </button>
          <button onClick={() => handleDisabledMock('Staff Directory')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors">
            <Users className="h-4 w-4" />
            Staff Directory
          </button>

          <p className="px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold mt-6 mb-3">Quick Actions</p>
          <button
            onClick={() => { refreshData(); toast({ title: 'Data Refreshed', description: 'Latest submissions loaded.' }); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
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
              {DEPARTMENT_LABELS[user.department] || 'Admin'} Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back, {user.name}. Here's what's happening in your department.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              value={user.department || ''}
              onChange={(e) => {
                const newDept = e.target.value;
                const newName = `Admin (${DEPARTMENT_LABELS[newDept].split(' ')[0]})`;
                const updatedUser = { 
                  ...user, 
                  department: newDept,
                  name: newName,
                  email: `${newDept}@bocra.org.bw`
                };
                localStorage.setItem('bocra_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast({
                  title: 'Department Switched',
                  description: `You are now viewing the ${DEPARTMENT_LABELS[newDept]} dashboard.`,
                });
              }}
              className={`flex h-9 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] transition-colors cursor-pointer hover:bg-slate-50 font-medium`}
            >
              <option value={DEPARTMENTS.LICENSING}>🛡️ Licensing</option>
              <option value={DEPARTMENTS.COMPLAINTS}>⚖️ Complaints</option>
              <option value={DEPARTMENTS.QOS}>📊 Quality of Service</option>
              <option value={DEPARTMENTS.TENDERS}>💼 Tenders</option>
            </select>
            <Badge variant="outline" className="text-sm px-3 py-1.5 border-[#003366]/20 text-[#0A4D8C] bg-[#E8F0F9]">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
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
                <option value="Pending Review">Pending Review</option>
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
                          className="flex-1 text-sm h-9"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { handleAddNote(sub.id); }}
                          className="text-[#003366]"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
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
                          className="text-slate-600 border-slate-200"
                          onClick={() => setSelectedSubmission(sub.id)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          Add Note
                        </Button>
                        {sub.status === 'Pending Review' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-[#003366] hover:bg-[#003366] text-white"
                              onClick={() => handleStatusChange(sub.id, 'Under Review')}
                            >
                              <Clock className="h-4 w-4 mr-1.5" />
                              Start Review
                            </Button>
                          </>
                        )}
                        {(sub.status === 'Pending Review' || sub.status === 'Under Review') && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              onClick={() => handleStatusChange(sub.id, 'Approved')}
                            >
                              <CheckCheck className="h-4 w-4 mr-1.5" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
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
      </div>
    </div>
  );
};

export default AdminDashboard;
