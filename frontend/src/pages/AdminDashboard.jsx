import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import UserForm from "../components/admin/UserForm";
import UserList from "../components/admin/UserList";
import UserModal from "../components/admin/UserModal";
import {
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  DEPARTMENT_COLORS,
} from "../utils/persistence";
import { qosMetrics } from "../mockData";
import Analytics from "../components/Analytics";
import * as adminApi from "../services/api";
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
  RefreshCw,
  LayoutDashboard,
  Layers,
  Settings,
  Bell,
  ArrowUpRight,
  UserCheck,
  Users,
  Plus,
  Loader2,
} from "lucide-react";

import { Menu, X as XIcon } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submissions, setSubmissions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // 'dashboard', 'submissions', 'users', 'applications', or 'settings'
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // User management state (for superadmin)
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
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
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    const userData = localStorage.getItem("bocra_user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== "admin") {
      navigate("/dashboard");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  // Load department-specific data
  useEffect(() => {
    if (!user) return;
    // For non-superadmin, department must be set
    if (user.adminLevel === "admin" && !user.department) {
      navigate("/login");
      return;
    }
    refreshData();
    // Load users if superadmin
    if (user.adminLevel === "superadmin") {
      loadUsers();
    }
  }, [user, navigate]);

  const loadUsers = async () => {
    setUserLoading(true);
    const token = localStorage.getItem("bocra_token");
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();
      setUsers(data.users || []);

      // Calculate stats
      const adminCount = (data.users || []).filter(
        (u) => u.userType === "admin",
      ).length;
      const citizenCount = (data.users || []).filter(
        (u) => u.userType === "client",
      ).length;

      setUserStats({
        totalUsers: data.users?.length || 0,
        adminCount,
        citizenCount,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserSubmit = async (formData) => {
    setUserLoading(true);
    const token = localStorage.getItem("bocra_token");

    try {
      const method = editingUser ? "PUT" : "POST";
      const endpoint = editingUser
        ? `${API_URL}/users/${editingUser.id}`
        : `${API_URL}/users`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save user");
      }

      toast({
        title: "Success",
        description: editingUser
          ? "User updated successfully"
          : "User created successfully",
      });

      setShowUserForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setUserLoading(true);
    const token = localStorage.getItem("bocra_token");

    try {
      const response = await fetch(`${API_URL}/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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
          department: "licensing",
          page: 1,
          limit: 100,
        });
        if (licensingData.submissions) {
          allApps = [...allApps, ...licensingData.submissions];
        }
      } catch (error) {
        console.error("Failed to load licensing applications:", error);
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
        console.error("Failed to load complaints:", error);
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
        console.error("Failed to load tenders:", error);
      }

      setAllApplications(allApps);
    } catch (error) {
      console.error("Failed to load applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const refreshData = async () => {
    if (!user) return;
    // For superadmin, only load if a department is selected
    if (user.adminLevel === "superadmin" && !user.department) {
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
      if (dept === "licensing") {
        const submissionsData = await adminApi.getSubmissions({
          department: dept,
          page: 1,
          limit: 100,
        });
        setSubmissions(submissionsData.submissions || []);
        setComplaints([]);
        setTenders([]);
      } else if (dept === "complaints") {
        const complaintsData = await adminApi.getAdminComplaints({
          page: 1,
          limit: 100,
        });
        setComplaints(complaintsData.complaints || []);
        setSubmissions([]);
        setTenders([]);
      } else if (dept === "tenders") {
        const tendersData = await adminApi.getAdminTenders({
          page: 1,
          limit: 100,
        });
        setTenders(tendersData.tenders || []);
        setSubmissions([]);
        setComplaints([]);
      } else if (dept === "qos") {
        // QoS doesn't have submissions yet
        setSubmissions([]);
        setComplaints([]);
        setTenders([]);
      }

      // Fetch stats from backend
      const statsData = await adminApi.getAdminStats(dept);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load department data",
        variant: "destructive",
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleStatusChange = async (token, newStatus) => {
    try {
      setSubmissionsLoading(true);
      const dept = user?.department;

      if (dept === "complaints") {
        await adminApi.updateComplaintStatus(token, newStatus);
      } else if (dept === "tenders") {
        await adminApi.updateTenderStatus(token, newStatus);
      } else {
        await adminApi.updateSubmissionStatus(token, newStatus);
      }

      await refreshData();
      setSelectedSubmission(null);
      toast({
        title: "Status Updated",
        description: `Item ${token} has been moved to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
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

      if (dept === "complaints") {
        await adminApi.addComplaintNotes(token, adminNote);
      } else if (dept === "tenders") {
        await adminApi.addTenderNotes(token, adminNote);
      } else {
        await adminApi.addSubmissionNotes(token, adminNote);
      }

      setAdminNote("");
      await refreshData();
      setSelectedSubmission(null);
      toast({
        title: "Note Added",
        description: `Internal admin note saved for ${token}.`,
      });
    } catch (error) {
      console.error("Failed to add note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bocra_user");
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const config = {
      Approved: {
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        dot: "bg-emerald-500",
        icon: CheckCircle,
      },
      "Under Review": {
        className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        dot: "bg-blue-500",
        icon: Clock,
      },
      "Pending Review": {
        className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        icon: Clock,
      },
      Rejected: {
        className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        dot: "bg-rose-500",
        icon: XCircle,
      },
      Flagged: {
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        dot: "bg-orange-500",
        icon: AlertCircle,
      },
    };
    const c = config[status] || config["Pending Review"];
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${c.className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`}
        ></span>
        {status}
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: "bg-rose-50 text-rose-600 border-rose-100 font-bold",
      Medium: "bg-amber-50 text-amber-600 border-amber-100 font-bold",
      Low: "bg-emerald-50 text-emerald-600 border-emerald-100 font-bold",
    };
    return (
      <Badge
        variant="outline"
        className={`text-[10px] rounded-md ${colors[priority]}`}
      >
        {priority} Priority
      </Badge>
    );
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
    if (dept === "complaints") return complaints;
    if (dept === "tenders") return tenders;
    return submissions;
  };

  const activeData = getActiveData();

  const filteredSubmissions = activeData.filter((sub) => {
    const matchesSearch =
      sub.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  const DeptIcon = getDeptIcon(user.department);
  const deptColor = DEPARTMENT_COLORS[user.department] || {
    bg: "bg-[#003366]",
    text: "text-[#003366]",
    light: "bg-[#E8F0F9]",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#003366] selection:text-white">
      {/* Sidebar - Pro Glassmorphic */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-slate-950 text-slate-400 z-50 flex flex-col transition-all duration-500 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="B" className="h-6 w-auto" />
            </div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-xl">
                BOCRA
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Admin Control
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* Department Selector in Sidebar */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-slate-500">
              Active Department
            </label>
            <button
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-white relative group transition-all hover:bg-white/10`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${deptColor.bg} flex items-center justify-center text-white shadow-lg`}
              >
                <DeptIcon className="h-5 w-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-black truncate">
                  {DEPARTMENT_LABELS[user.department]?.split(" &")[0]}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
              <select
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={user.department}
                onChange={(e) => {
                  const newDept = e.target.value;
                  const updatedUser = {
                    ...user,
                    department: newDept,
                    name: `Admin (${DEPARTMENT_LABELS[newDept].split(" ")[0]})`,
                    email: `${newDept}@bocra.org.bw`,
                  };
                  localStorage.setItem(
                    "bocra_user",
                    JSON.stringify(updatedUser),
                  );
                  setUser(updatedUser);
                  toast({
                    title: "Department Switched",
                    description: `Viewing ${DEPARTMENT_LABELS[newDept]} data.`,
                  });
                }}
              >
                {Object.entries(DEPARTMENTS).map(([key, val]) => (
                  <option key={key} value={val}>
                    {DEPARTMENT_LABELS[val]}
                  </option>
                ))}
              </select>
            </button>
          </div>

          <nav className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-slate-500">
              Management
            </label>
            <button
              onClick={() => setActiveView("submissions")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                activeView === "submissions"
                  ? "bg-[#003366] text-white shadow-xl shadow-[#003366]/20"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileText className="h-5 w-5" />
              Submissions
              {stats.pending > 0 && (
                <span className="ml-auto w-5 h-5 bg-rose-500 text-white rounded-md flex items-center justify-center text-[10px] font-black">
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                activeView === "analytics"
                  ? "bg-[#003366] text-white shadow-xl shadow-[#003366]/20"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </button>
            {user?.adminLevel === "superadmin" && (
              <>
                <button
                  onClick={() => setActiveView("users")}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                    activeView === "users"
                      ? "bg-[#003366] text-white shadow-xl shadow-[#003366]/20"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  User Management
                </button>
                <button
                  onClick={() => {
                    setActiveView("applications");
                    loadAllApplications();
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                    activeView === "applications"
                      ? "bg-[#003366] text-white shadow-xl shadow-[#003366]/20"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Layers className="h-5 w-5" />
                  All Applications
                </button>
              </>
            )}
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all font-bold text-sm text-slate-500">
              <Users className="h-5 w-5" />
              Staff Directory
            </button>
          </nav>

          <nav className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-slate-500">
              System
            </label>
            <button
              onClick={() => setActiveView("settings")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                activeView === "settings"
                  ? "bg-[#003366] text-white shadow-xl shadow-[#003366]/20"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all font-bold text-sm text-slate-500">
              <Bell className="h-5 w-5" />
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-3xl p-4 flex items-center gap-4 border border-white/5 group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#003366] flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform shadow-lg">
              {user.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 min-h-screen overflow-hidden flex flex-col">
        {/* Header - Pro */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {activeView === "submissions"
                  ? "Worklist Queue"
                  : activeView === "users"
                    ? "User Management"
                    : activeView === "applications"
                      ? "All Applications"
                      : activeView === "settings"
                        ? "System Settings"
                        : "Departmental Insights"}
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2 group">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
                  System Live
                </Badge>
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
                Tracking {submissions.length} total entries and {stats.pending}{" "}
                items requiring attention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9 px-4 font-black text-[10px] uppercase tracking-widest text-[#003366] bg-white shadow-sm"
              >
                Real-time
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-9 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600"
              >
                Archived
              </Button>
            </div>
            <button className="w-10 h-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8 max-w-[1400px] mx-auto w-full">
          {activeView === "submissions" && (
            <>
              {/* Stats Bar - High Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Volume",
                    value: stats.total,
                    icon: FileText,
                    color: "text-slate-900",
                    bg: "bg-slate-100",
                  },
                  {
                    label: "Awaiting Action",
                    value: stats.pending,
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-100/50",
                    active: true,
                  },
                  {
                    label: "High Priority",
                    value: stats.highPriority,
                    icon: AlertCircle,
                    color: "text-rose-600",
                    bg: "bg-rose-100/50",
                  },
                  {
                    label: "Successfully Proc.",
                    value: stats.approved,
                    icon: UserCheck,
                    color: "text-emerald-600",
                    bg: "bg-emerald-100/50",
                  },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className={`border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
                  >
                    <CardContent className="p-6 relative">
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500`}
                      ></div>
                      <div className="flex justify-between items-start mb-4 relative">
                        <div
                          className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shadow-sm`}
                        >
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        {stat.active && (
                          <div className="px-2 py-0.5 bg-amber-500 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                            Action Needed
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <p className="text-3xl font-black text-slate-900 tracking-tight">
                          {stat.value || 0}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Worklist Controls */}
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1 w-full relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003366] transition-colors" />
                  <Input
                    placeholder="Search submissions by Citizen, Reference or Keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-16 pl-14 pr-8 bg-white border-slate-200 rounded-[1.5rem] shadow-sm text-sm font-medium focus:ring-4 focus:ring-[#003366]/5 focus:border-[#003366] transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="h-16 bg-white border border-slate-200 rounded-[1.5rem] flex items-center px-4 gap-3 shadow-sm">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 pr-8"
                    >
                      <option value="all">Every Status</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Flagged">Flagged</option>
                    </select>
                  </div>
                  <Button
                    onClick={refreshData}
                    variant="outline"
                    className="h-16 w-16 rounded-[1.5rem] border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                  >
                    <RefreshCw className="h-5 w-5 text-[#003366]" />
                  </Button>
                </div>
              </div>

              {/* Submissions Feed */}
              <div className="space-y-6">
                {filteredSubmissions.length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-[3rem]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <FileText className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Zero Matches Found
                    </h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-xs text-center">
                      We couldn't find any submissions matching your current
                      search parameters.
                    </p>
                    <Button
                      variant="link"
                      className="mt-4 text-[#003366] font-black uppercase text-[10px] tracking-widest"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {filteredSubmissions.map((sub) => (
                      <Card
                        key={sub.id}
                        className={`group bg-white border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2.5rem] overflow-hidden ${selectedSubmission === sub.id ? "ring-2 ring-[#003366]" : ""}`}
                      >
                        <CardContent className="p-0 flex flex-col h-full">
                          <div className="p-8 pb-4 flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                {getPriorityBadge(sub.priority)}
                                <span className="text-[10px] font-black text-[#003366] bg-[#003366]/5 px-2 py-0.5 rounded-md tracking-widest uppercase font-mono">
                                  {sub.id}
                                </span>
                              </div>
                              <h3 className="text-xl font-black text-slate-900 group-hover:text-[#003366] transition-colors leading-tight">
                                {sub.subject}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5">
                                  <Users className="h-3.5 w-3.5" />
                                  {sub.citizenName}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {sub.submittedDate}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(sub.status)}
                          </div>

                          <div className="px-8 pb-6">
                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                              {sub.description}
                            </p>
                          </div>

                          {sub.adminNotes && (
                            <div className="mx-8 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group/note">
                              <div className="absolute -top-2 left-4 px-2 bg-slate-100 rounded text-[8px] font-black uppercase tracking-widest text-slate-400">
                                Internal Note
                              </div>
                              <p className="text-xs text-slate-700 italic">
                                "{sub.adminNotes}"
                              </p>
                            </div>
                          )}

                          <div
                            className={`mt-auto p-4 px-8 border-t border-slate-50 flex items-center justify-between transition-all ${selectedSubmission === sub.id ? "bg-[#003366]/5" : "bg-slate-50/50"}`}
                          >
                            {selectedSubmission === sub.id ? (
                              <div className="w-full space-y-4 py-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="Add professional feedback or internal notes..."
                                    value={adminNote}
                                    onChange={(e) =>
                                      setAdminNote(e.target.value)
                                    }
                                    className="h-12 rounded-xl bg-white border-slate-200 text-sm font-medium"
                                  />
                                  <Button
                                    onClick={() => handleAddNote(sub.id)}
                                    className="h-12 px-6 bg-[#003366] hover:bg-[#04488] text-white rounded-xl shadow-lg shadow-blue-500/10"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                  <Button
                                    onClick={() =>
                                      handleStatusChange(sub.id, "Approved")
                                    }
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-xl h-10"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleStatusChange(sub.id, "Under Review")
                                    }
                                    className="bg-[#003366] text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-xl h-10"
                                  >
                                    Mark in Review
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleStatusChange(sub.id, "Rejected")
                                    }
                                    variant="destructive"
                                    className="font-black text-[10px] uppercase tracking-widest px-8 rounded-xl h-10"
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="text-slate-400 font-black text-[10px] uppercase tracking-widest px-6"
                                    onClick={() => setSelectedSubmission(null)}
                                  >
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-6">
                                  <button
                                    onClick={() =>
                                      setSelectedSubmission(sub.id)
                                    }
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#003366] hover:text-[#F47920] transition-colors"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Full Review & Audit
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  {sub.status === "Pending Review" && (
                                    <Button
                                      onClick={() =>
                                        handleStatusChange(
                                          sub.id,
                                          "Under Review",
                                        )
                                      }
                                      size="sm"
                                      className="h-10 rounded-xl bg-[#003366] hover:bg-[#004488] text-white px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#003366]/10"
                                    >
                                      Start Review
                                    </Button>
                                  )}
                                  {sub.status === "Under Review" && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        onClick={() =>
                                          handleStatusChange(sub.id, "Approved")
                                        }
                                        size="sm"
                                        className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-6 font-black text-[10px] uppercase tracking-widest"
                                      >
                                        Quick Approve
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleStatusChange(sub.id, "Flagged")
                                        }
                                        size="sm"
                                        variant="outline"
                                        className="h-10 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 px-6 font-black text-[10px] uppercase tracking-widest"
                                      >
                                        Flag
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === "analytics" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                  <CardHeader className="p-10 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                          Performance Vectors
                        </CardTitle>
                        <CardDescription className="text-sm font-medium mt-1">
                          Real-time throughput for{" "}
                          {DEPARTMENT_LABELS[user.department]}
                        </CardDescription>
                      </div>
                      <select className="h-9 rounded-xl bg-slate-100 border-none text-[10px] font-black uppercase tracking-widest px-4">
                        <option>Last 30 Days</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <BarChart3 className="h-8 w-8 text-[#003366] animate-pulse" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        Consolidating metadata from regulatory nodes...
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-[#003366] text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <CardHeader className="p-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                        Efficiency Index
                      </p>
                      <CardTitle className="text-4xl font-black tracking-tighter mt-2">
                        94.2%
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-emerald-400 w-[94.2%] transition-all duration-1000"></div>
                      </div>
                      <p className="text-xs text-white/70 font-medium leading-relaxed">
                        Your department is performing 12% above the national
                        regulatory benchmark this week.
                      </p>
                      <Button className="w-full mt-6 bg-white text-[#003366] hover:bg-white/90 rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest">
                        Download Full Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
                        Top Reviewers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      {[
                        { name: "Admin (Staff-04)", items: 142, trend: "+8%" },
                        { name: "Senior Officer-A", items: 98, trend: "+12%" },
                        { name: "Reviewer-Beta", items: 64, trend: "-3%" },
                      ].map((staff, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[#003366] text-xs shadow-sm">
                              {staff.name.split("-")[1] || staff.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 tracking-tight">
                                {staff.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {staff.items} processed
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-black ${staff.trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}
                          >
                            {staff.trend}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* User Management View - Only for Superadmins */}
          {activeView === "users" && user?.adminLevel === "superadmin" && (
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
                            <p className="text-sm text-slate-500 font-medium">
                              Total Users
                            </p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              {userStats.totalUsers}
                            </p>
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
                            <p className="text-sm text-slate-500 font-medium">
                              Admin Users
                            </p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                              {userStats.adminCount}
                            </p>
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
                            <p className="text-sm text-slate-500 font-medium">
                              Citizen Users
                            </p>
                            <p className="text-3xl font-bold text-teal-600 mt-1">
                              {userStats.citizenCount}
                            </p>
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
          {activeView === "applications" &&
            user?.adminLevel === "superadmin" && (
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
                          <p className="text-sm font-medium text-slate-500">
                            Total Applications
                          </p>
                          <p className="text-3xl font-bold text-slate-900 mt-1">
                            {allApplications.length}
                          </p>
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
                          <p className="text-sm font-medium text-slate-500">
                            Pending
                          </p>
                          <p className="text-3xl font-bold text-amber-600 mt-1">
                            {
                              allApplications.filter(
                                (a) =>
                                  a.status === "Submitted" ||
                                  a.status === "Under Review",
                              ).length
                            }
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
                          <p className="text-sm font-medium text-slate-500">
                            Approved
                          </p>
                          <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {
                              allApplications.filter(
                                (a) => a.status === "Approved",
                              ).length
                            }
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
                          <p className="text-sm font-medium text-slate-500">
                            Rejected
                          </p>
                          <p className="text-3xl font-bold text-red-600 mt-1">
                            {
                              allApplications.filter(
                                (a) => a.status === "Rejected",
                              ).length
                            }
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
                        <p className="text-slate-500 mt-4">
                          Loading applications...
                        </p>
                      </CardContent>
                    </Card>
                  ) : allApplications.filter((app) => {
                      const matchesSearch =
                        app.citizenName
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        app.subject
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        app.id
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      const matchesFilter =
                        filterStatus === "all" || app.status === filterStatus;
                      return matchesSearch && matchesFilter;
                    }).length === 0 ? (
                    <Card className="border-0 shadow-md">
                      <CardContent className="py-16 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          No Applications Found
                        </h3>
                        <p className="text-slate-500">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No applications have been received yet."}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    allApplications
                      .filter((app) => {
                        const matchesSearch =
                          app.citizenName
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          app.subject
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          app.id
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        const matchesFilter =
                          filterStatus === "all" || app.status === filterStatus;
                        return matchesSearch && matchesFilter;
                      })
                      .map((app) => (
                        <Card
                          key={app.id}
                          className="border-0 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-slate-900">
                                    {app.subject}
                                  </h3>
                                  {getPriorityBadge(app.priority)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                                  <span className="flex items-center gap-1.5">
                                    <Hash className="h-3.5 w-3.5" />
                                    <span className="font-mono font-semibold text-[#003366]">
                                      {app.id}
                                    </span>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {app.citizenName} ({app.citizenEmail})
                                  </span>
                                  <span>•</span>
                                  <span>{app.submittedDate}</span>
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  Department:{" "}
                                  <span className="text-slate-600">
                                    {app.department
                                      ? app.department.toUpperCase()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                              {getStatusBadge(app.status)}
                            </div>

                            <p className="text-slate-600 mb-4 line-clamp-2">
                              {app.description}
                            </p>

                            {/* Admin Notes */}
                            {app.adminNotes && (
                              <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                  Admin Notes
                                </p>
                                <p className="text-sm text-slate-700">
                                  {app.adminNotes}
                                </p>
                              </div>
                            )}

                            {/* Review Info */}
                            {app.reviewedBy && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                <CheckCheck className="h-3.5 w-3.5" />
                                Reviewed by{" "}
                                <span className="font-semibold">
                                  {app.reviewedBy}
                                </span>{" "}
                                on{" "}
                                {new Date(app.reviewedAt).toLocaleDateString()}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                              {selectedSubmission === app.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    placeholder="Add a note..."
                                    value={adminNote}
                                    onChange={(e) =>
                                      setAdminNote(e.target.value)
                                    }
                                    disabled={submissionsLoading}
                                    className="flex-1 text-sm h-9"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={
                                      submissionsLoading || !adminNote.trim()
                                    }
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
                                    onClick={() =>
                                      setSelectedSubmission(app.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-1.5" />
                                    Add Note
                                  </Button>
                                  {app.status === "Submitted" && (
                                    <Button
                                      size="sm"
                                      disabled={submissionsLoading}
                                      className="bg-[#003366] hover:bg-[#003366] text-white"
                                      onClick={() =>
                                        handleStatusChange(
                                          app.id,
                                          "Under Review",
                                        )
                                      }
                                    >
                                      <Clock className="h-4 w-4 mr-1.5" />
                                      Start Review
                                    </Button>
                                  )}
                                  {(app.status === "Submitted" ||
                                    app.status === "Under Review") && (
                                    <>
                                      <Button
                                        size="sm"
                                        disabled={submissionsLoading}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() =>
                                          handleStatusChange(app.id, "Approved")
                                        }
                                      >
                                        <CheckCheck className="h-4 w-4 mr-1.5" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        disabled={submissionsLoading}
                                        variant="destructive"
                                        onClick={() =>
                                          handleStatusChange(app.id, "Rejected")
                                        }
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
          {activeView === "settings" && user?.adminLevel === "superadmin" && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Settings Management</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Settings Coming Soon
                </h3>
                <p className="text-slate-500">
                  System settings and configuration options will be available
                  here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {viewingUser && (
        <UserModal user={viewingUser} onClose={() => setViewingUser(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
