import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Files,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  X as XIcon,
  Loader2,
  Briefcase
} from 'lucide-react';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import ApplicationsView from '../components/dashboard/ApplicationsView';
import ComplaintsView from '../components/dashboard/ComplaintsView';
import DocumentsView from '../components/dashboard/DocumentsView';
import SettingsView from '../components/dashboard/SettingsView';
import TendersView from '../components/dashboard/TendersView';
import * as api from '../services/api';
import TenderSubmission from './TenderSubmission';
import PortalTour from '../components/PortalTour';
import Chatbot from '../components/Chatbot';
import TenderSubmission from './TenderSubmission';
import * as api from '../services/api';

const BRAND = {
  navy: '#003366',
  dark: '#001F40',
  blue: '#2C7DA0',
  green: '#2EAD6F',
  red: '#C62828',
  yellow: '#F2C94C',
  tint: '#E8F0F9',
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'complaints', label: 'My Complaints', icon: MessageSquare },
  { id: 'documents', label: 'My Documents', icon: Files },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const quickActions = [
  {
    id: 'applications',
    title: 'Start Application',
    description: 'Submit a new application and track progress online.',
    icon: Plus,
    accent: BRAND.blue,
  },
  {
    id: 'complaints',
    title: 'Submit Complaint',
    description: 'Report service issues and monitor response status.',
    icon: MessageSquare,
    accent: BRAND.red,
  },
  {
    id: 'tender-submission',
    title: 'Upload Tender',
    description: 'Send proposals for open tenders through the portal.',
    icon: Upload,
    accent: BRAND.green,
  },
];

const cardAccentByIndex = [BRAND.blue, BRAND.yellow, BRAND.green, BRAND.red];

const formatLongDate = (value = new Date()) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatShortTime = (value = new Date()) =>
  new Date(value).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return BRAND.green;
    case 'Under Review':
      return BRAND.blue;
    case 'Pending Documents':
      return BRAND.yellow;
    case 'Rejected / Flagged':
    case 'Rejected':
      return BRAND.red;
    default:
      return '#64748B';
  }
};

const getActivityTheme = (actionType) => {
  switch (actionType) {
    case 'application':
      return { icon: FileText, accent: BRAND.blue, background: '#EEF6FA' };
    case 'complaint':
      return { icon: MessageSquare, accent: BRAND.red, background: '#FBECEC' };
    case 'document':
      return { icon: Files, accent: BRAND.green, background: '#EDF8F2' };
    default:
      return { icon: AlertCircle, accent: BRAND.yellow, background: '#FFF8DF' };
  }
};

const SurfaceCard = ({ children, className = '' }) => (
  <div className={`rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
);

const StatCard = ({ label, value, meta, accent }) => (
  <SurfaceCard className="p-5 sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{meta}</p>
      </div>
      <div className="h-12 w-2 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  </SurfaceCard>
);

const SidebarNav = ({
  activeTab,
  collapsed,
  mobileSidebarOpen,
  onCloseMobile,
  onSelect,
  onToggleCollapse,
  onLogout,
  user,
}) => {
  const initials = user?.name
    ?.split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-white/10 transition-all duration-300',
          collapsed ? 'w-24' : 'w-[18rem]',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ backgroundColor: BRAND.dark }}
      >
        <div className="relative flex items-center justify-between px-5 pb-6 pt-6">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
              <img src="/logo.png" alt="BOCRA" className="h-9 w-auto object-contain" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">BOCRA</p>
                <p className="text-sm font-semibold text-white">Client Portal</p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-full border border-white/10 bg-white/10 p-2 text-slate-200 transition hover:bg-white/15 lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="px-4 pb-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            {!collapsed ? (
              <>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Citizen services</p>
                <h2 className="mt-2 text-lg font-semibold text-white">Quick access portal</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Manage applications, complaints, and documents from one secure workspace.
                </p>
                <div className="mt-4 flex gap-2">
                  {[BRAND.blue, BRAND.green, BRAND.yellow, BRAND.red].map((color) => (
                    <span key={color} className="h-2.5 w-8 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center gap-2 lg:flex-col lg:items-center">
                {[BRAND.blue, BRAND.green, BRAND.yellow, BRAND.red].map((color) => (
                  <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onCloseMobile();
                }}
                className={[
                  'group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all',
                  collapsed ? 'justify-center px-0' : '',
                  active ? 'text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')}
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.10)' : 'transparent' }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: active ? BRAND.yellow : 'rgba(255,255,255,0.06)', color: active ? BRAND.dark : '#E2E8F0' }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!collapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className={`rounded-[1.5rem] border border-white/10 bg-white/5 p-3 ${collapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-slate-950"
                style={{ backgroundColor: BRAND.yellow }}
              >
                {initials || 'CL'}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user?.name || 'Portal user'}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email || 'user@bocra.co.bw'}</p>
                </div>
              )}
              {!collapsed && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>

            {collapsed && (
              <button
                type="button"
                onClick={onLogout}
                className="mt-3 inline-flex rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatGreeting, setChatGreeting] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const hasSeenTour = localStorage.getItem('bocra_tour_seen');
    if (!hasSeenTour) {
      const timer = window.setTimeout(() => setShowTour(true), 1200);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [navigate]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
        setRecentActivity(data?.recentActivity || []);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats({
          totalApplications: 0,
          activeComplaints: 0,
          nodeTrustScore: 82,
          verifiedDevices: 0,
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = useMemo(
    () => [
      {
        label: 'Total Applications',
        value: stats?.totalApplications ?? 0,
        meta: 'Applications submitted through the portal',
      },
      {
        label: 'Active Complaints',
        value: stats?.activeComplaints ?? 0,
        meta: 'Items awaiting response or review',
      },
      {
        label: 'Trust Score',
        value: `${stats?.nodeTrustScore ?? 82}%`,
        meta: 'Portal integrity and account assurance',
      },
      {
        label: 'Verified Devices',
        value: stats?.verifiedDevices ?? 0,
        meta: 'Devices confirmed for secure access',
      },
    ],
    [stats]
  );

  const onTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('bocra_tour_seen', 'true');
    setChatGreeting('You’re all set. What would you like to do first?');
    setChatGreeting(`You’re all set, ${user?.name?.split(' ')[0] || 'Citizen'}! What would you like to do first?`);
    setOpenChat(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    localStorage.removeItem('bocra_token');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'applications':
        return <ApplicationsView />;
      case 'complaints':
        return <ComplaintsView />;
      case 'documents':
        return <DocumentsView />;
      case 'settings':
        return <SettingsView />;
      case 'tender-submission':
        return <TenderSubmission setActiveTab={setActiveTab} />;
      default:
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card, index) => (
                <StatCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  meta={card.meta}
                  accent={cardAccentByIndex[index]}
                />
              ))}
            </div>

            <SurfaceCard className="overflow-hidden">
              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_0.6fr] lg:p-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700" style={{ backgroundColor: '#FFF8DF' }}>
                    <AlertCircle className="h-3.5 w-3.5" style={{ color: BRAND.red }} />
                    Action centre
  const formatDate = (dateString = new Date()) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare },
    { id: 'tenders', label: 'Tenders', icon: Briefcase },
    { id: 'documents', label: 'My Documents', icon: Files },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) return null;

  const statCards = [
    { label: 'Total Applications', value: stats?.totalApplications || '0', trend: '+12%', color: 'text-teal-500' },
    { label: 'Active Complaints', value: stats?.activeComplaints || '0', trend: '-2%', color: 'text-amber-500' },
    { label: 'Node Trust Score', value: `${stats?.nodeTrustScore || 82}%`, trend: '+5%', color: 'text-blue-500' },
    { label: 'Verified Devices', value: stats?.verifiedDevices || '0', trend: '+18%', color: 'text-emerald-500' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#2E7D32';
      case 'Under Review': return '#1565C0';
      case 'Rejected / Flagged': return '#C62828';
      case 'Pending Documents': return '#F9A825';
      default: return '#1e293b';
    }
  };

  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'application': return FileText;
      case 'complaint': return MessageSquare;
      case 'document': return Files;
      default: return AlertCircle;
    }
  };

  const getActivityColor = (actionType) => {
    switch (actionType) {
      case 'application': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'complaint': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'document': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'applications': return <ApplicationsView />;
      case 'complaints': return <ComplaintsView />;
      case 'documents': return <DocumentsView />;
      case 'tenders': return <TendersView />;
      case 'settings': return <SettingsView />;
      case 'tender-submission': return <TenderSubmission setActiveTab={setActiveTab} />;
      default: return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div id="stats-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <div key={i} className="bg-[#0a0f1e] border border-[#1e293b] p-6 rounded-[1.5rem] hover:border-[#003366]/30 transition-all group overflow-hidden relative shadow-lg shadow-black/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#003366]/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-[#003366]/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{card.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center border border-white/5">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                    Continue where you left off
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Use the portal to submit applications, manage complaints, upload documents, and monitor updates without visiting a physical office.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      onClick={() => setActiveTab('applications')}
                      className="h-11 rounded-xl px-5 text-sm font-semibold text-white"
                      style={{ backgroundColor: BRAND.navy }}
                    >
                      View Applications
                    </Button>
                    <Button
                      onClick={() => setActiveTab('complaints')}
                      variant="outline"
                      className="h-11 rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-700"
                    >
                      Submit Complaint
                    </Button>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 p-5" style={{ backgroundColor: BRAND.tint }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Portal overview</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Current date</p>
                      <p className="text-lg font-semibold text-slate-950">{formatLongDate(currentTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last check</p>
                      <p className="text-lg font-semibold text-slate-950">{formatShortTime(currentTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Security status</p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-800">
                        <ShieldCheck className="h-4 w-4" style={{ color: BRAND.green }} />
                        Verified access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>

            <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
              <SurfaceCard className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Recent activity</p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Latest account updates</h3>
                  </div>
                  <Badge className="w-fit border-0 bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                    {loading ? 'Refreshing...' : `${recentActivity.length} items`}
                  </Badge>
                </div>

                <div className="mt-5 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center rounded-[1.5rem] border border-slate-200 py-16">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                    </div>
                  ) : recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((item, index) => {
                      const theme = getActivityTheme(item.actionType);
                      const Icon = theme.icon;
                      return (
                        <div
                          key={item.id || `${item.action}-${index}`}
                          className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 p-4 transition hover:border-slate-300 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="flex gap-4">
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                              style={{ backgroundColor: theme.background, color: theme.accent }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{item.description || item.action}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-500">{item.action || 'Portal activity update'}</p>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-sm text-slate-500">{formatLongDate(item.timestamp)}</p>
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getStatusColor(item.status) }} />
                              {item.status || 'Updated'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-center">
                      <p className="font-medium text-slate-900">No recent activity yet</p>
                      <p className="mt-2 text-sm text-slate-500">Your latest submissions and updates will appear here.</p>
                    </div>
                  )}
                </div>
              </SurfaceCard>

              <div className="space-y-6">
                <SurfaceCard className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Quick actions</p>
                  <div className="mt-5 space-y-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.title}
                          type="button"
                          onClick={() => setActiveTab(action.id)}
                          className="w-full rounded-[1.5rem] border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                              style={{ backgroundColor: `${action.accent}18`, color: action.accent }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{action.title}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-500">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </SurfaceCard>
              </div>
            </div>

            <div className="space-y-8">
              <div className="px-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Power Actions</h2>
              </div>
              <div className="space-y-5">
                {[
                  { tab: 'applications', icon: Plus, color: 'teal', label: 'Start Application', desc: 'Secure new sector licenses', id: 'new-app-button' },
                  { tab: 'complaints', icon: MessageSquare, color: 'orange', label: 'Consumer Rights', desc: 'Report service violations' },
                  { tab: 'tenders', icon: Briefcase, color: 'blue', label: 'Browse & Submit Tenders', desc: 'View open tenders and submit proposals' },
                ].map((action, i) => (
                  <button key={i} id={action.id} onClick={() => setActiveTab(action.tab)} className="block w-full text-left group">
                    <div className={`bg-[#0a0f1e] border border-white/5 p-8 rounded-[2.5rem] transition-all cursor-pointer relative overflow-hidden active:scale-95 hover:border-[#003366]/30 group-hover:shadow-[0_20px_40px_-15px_rgba(0,51,102,0.2)]`}>
                      <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 mb-6 group-hover:bg-[#003366] group-hover:text-white transition-all duration-500`}>
                        <action.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-black text-xl text-slate-100 tracking-tight group-hover:text-white">{action.label}</h3>
                      <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{action.desc}</p>
                      <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-[#003366] rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
                    </div>
                  </button>
                ))}
              </div>

                <SurfaceCard className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Trust score</p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{stats?.nodeTrustScore ?? 82}%</p>
                    </div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: '#EDF8F2', color: BRAND.green }}
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${stats?.nodeTrustScore ?? 82}%`, background: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.blue}, ${BRAND.green})` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your portal account is in good standing and ready for secure digital service access.
                  </p>
                </SurfaceCard>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) return null;

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

      <SidebarNav
        activeTab={activeTab}
        collapsed={isSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSelect={setActiveTab}
        onToggleCollapse={() => setIsSidebarCollapsed((previous) => !previous)}
        onLogout={handleLogout}
        user={user}
      />

      <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-[18rem]'}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-100/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="pl-14 lg:pl-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">BOCRA Digital Services</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">
                  {activeTab === 'dashboard'
                    ? `Welcome back, ${user.name?.split(' ')[0] || 'User'}`
                    : menuItems.find((item) => item.id === activeTab)?.label || 'Portal'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Access essential services, review updates, and manage your submissions in one secure place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search portal"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-slate-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <Badge className="border-0 bg-white px-4 py-2 text-slate-700 hover:bg-white">
                    <Clock3 className="mr-2 h-4 w-4" />
                    {formatLongDate(currentTime)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{renderContent()}</main>
      </div>

      {showTour && <PortalTour onComplete={onTourComplete} onClose={() => setShowTour(false)} />}
      <Chatbot isOpen={openChat} onClose={() => setOpenChat(false)} greeting={chatGreeting} />
    </div>
  );
};

export default Dashboard;
