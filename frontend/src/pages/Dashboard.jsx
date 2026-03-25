import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Files, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  AlertCircle,
  Clock,
  ArrowRight,
  MoreVertical,
  Upload,
  ChevronRight,
  ChevronLeft,
  Menu,
  X as XIcon,
  Loader2
} from 'lucide-react';
import ApplicationsView from '../components/dashboard/ApplicationsView';
import ComplaintsView from '../components/dashboard/ComplaintsView';
import DocumentsView from '../components/dashboard/DocumentsView';
import SettingsView from '../components/dashboard/SettingsView';
import * as api from '../services/api';
import TenderSubmission from './TenderSubmission';
import PortalTour from '../components/PortalTour';
import Chatbot from '../components/Chatbot';

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
    } else {
      setUser(JSON.parse(userData));
    }

    const hasSeenTour = localStorage.getItem('bocra_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1500);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
        setRecentActivity(data.recentActivity || []);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats({
          totalApplications: 0,
          activeComplaints: 0,
          nodeTrustScore: 82,
          verifiedDevices: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const onTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('bocra_tour_seen', 'true');
    setChatGreeting("You’re all set! What would you like to do first?");
    setOpenChat(true);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('bocra_user');
    localStorage.removeItem('bocra_token');
    navigate('/login');
  };

  const formatDate = (dateString = new Date()) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare },
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
                </div>
                <div className="flex items-end justify-between relative">
                  <div className={`text-4xl font-black tracking-tight ${card.color}`}>{card.value}</div>
                  <div className="flex items-center text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/10 uppercase tracking-widest">
                    {card.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="alert-banner" className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-amber-500/40 transition-all shadow-xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center space-x-6 text-center md:text-left">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white">Action Required</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-md font-medium">Check your applications and complaints for any pending actions.</p>
              </div>
            </div>
            <Button 
                onClick={() => setActiveTab('applications')}
                className="w-full md:w-auto bg-[#F47920] hover:bg-[#C25E00] text-white rounded-2xl px-10 h-14 shadow-xl shadow-[#F47920]/20 font-black uppercase tracking-widest text-xs group-hover:scale-105 transition-all"
            >
              View Items
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                   Recent Activity
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </h2>
                <div className="flex items-center space-x-6">
                   <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Archive</button>
                   <button onClick={() => setActiveTab('applications')} className="text-[10px] text-teal-400 font-bold uppercase tracking-widest hover:text-teal-300 transition-colors">View All →</button>
                </div>
              </div>
              
              <div className="bg-[#0a0f1e]/50 backdrop-blur-xl border border-[#1e293b] rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="divide-y divide-[#1e293b]">
                  {loading ? (
                    <div className="p-8 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                    </div>
                  ) : recentActivity && recentActivity.length > 0 ? (
                    recentActivity.slice(0, 4).map((item) => {
                      const IconComponent = getActivityIcon(item.actionType);
                      return (
                        <div key={item.id} className="p-8 hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border ${getActivityColor(item.actionType)}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <p className="font-black text-lg text-slate-100 group-hover:text-teal-400 transition-colors tracking-tight">
                                  {item.description}
                                </p>
                              </div>
                              <p className="text-slate-500 mt-1 text-sm font-medium">{item.action}</p>
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-slate-400 font-black text-xs tracking-tight">{formatDate(item.timestamp)}</p>
                            <div className="mt-3 inline-flex items-center px-3 py-1 bg-slate-950 rounded-lg border border-white/5 space-x-2">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(item.status) }}></div>
                               <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-widest">{item.status}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No recent activity
                    </div>
                  )}
                </div>
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
                  { tab: 'tender-submission', icon: Files, color: 'blue', label: 'Submit Tender', desc: 'Upload a proposal for open tenders' },
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

              <div className="bg-gradient-to-br from-[#0a0f1e] to-slate-900 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                 <div className="absolute inset-0 bg-[#003366]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Node Trust Score</h3>
                      <span className="text-teal-400 font-black text-sm">{stats?.nodeTrustScore || 82}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)]" style={{ width: `${stats?.nodeTrustScore || 82}%` }}></div>
                    </div>
                    <Button variant="ghost" className="w-full mt-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5" onClick={() => setActiveTab('settings')}>Audit Credentials</Button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden dark font-sans">
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-slate-800 text-[#E8F0F9] rounded-xl shadow-lg border border-white/10"
      >
        {mobileSidebarOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside 
        id="sidebar-nav" 
        className={`bg-[#0a0f1e] border-r border-[#1e293b] flex flex-col h-full z-50 transition-all duration-500 ease-in-out 
          ${isSidebarCollapsed ? 'w-24' : 'w-80'}
          fixed lg:relative
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-[#003366] rounded-full items-center justify-center text-white border-4 border-[#020617] hover:bg-[#003366] transition-all z-[60] shadow-xl group/toggle hover:scale-110 active:scale-90"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 mb-8 transition-all duration-500 flex items-center justify-center`}>
          <Link to="/" className="group">
            <img 
              src="/logo.png" 
              alt="BOCRA Logo" 
              className={`object-contain transition-all duration-500 ${isSidebarCollapsed ? 'h-8' : 'h-14'}`} 
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar font-bold">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-2xl transition-all duration-300 relative group ${
                isSidebarCollapsed ? 'justify-center p-4' : 'px-6 py-4 space-x-4'
              } ${
                activeTab === item.id 
                  ? 'bg-[#003366]/10 text-[#E8F0F9] border border-[#003366]/20 shadow-lg' 
                  : 'text-slate-500 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#003366] rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-6 border-t border-white/5 ${isSidebarCollapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center justify-between rounded-[1.5rem] bg-white/[0.02] border border-white/5 ${isSidebarCollapsed ? 'p-3 flex-col gap-2' : 'p-4'}`}>
            <div onClick={() => setActiveTab('settings')} className="flex items-center space-x-4 cursor-pointer min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center font-black text-sm text-white shrink-0 capitalize">
                {user.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-slate-100">{user.name}</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button onClick={handleLogout} className="p-2 ml-2 text-slate-500 hover:text-rose-500 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative">
        <header className="sticky top-0 z-40 bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white">
              Hello, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {formatDate()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <Button onClick={() => setActiveTab('settings')} className="rounded-xl bg-[#003366] hover:bg-[#004488] text-white h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/10 transition-all">
                Settings
              </Button>
          </div>
        </header>

        <div className="p-4 sm:p-8 lg:p-12 pb-24 space-y-8 sm:space-y-12">
          {renderContent()}
        </div>
      </main>
      
      <Chatbot isOpen={openChat} initialMessage={chatGreeting} />
      {showTour && <PortalTour onComplete={onTourComplete} />}
    </div>
  );
};

export default Dashboard;
