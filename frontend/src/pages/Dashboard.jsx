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
  X as XIcon
} from 'lucide-react';
import { userApplications, userComplaints } from '../mockData';
import ApplicationsView from '../components/dashboard/ApplicationsView';
import ComplaintsView from '../components/dashboard/ComplaintsView';
import DocumentsView from '../components/dashboard/DocumentsView';
import SettingsView from '../components/dashboard/SettingsView';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('bocra_user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'applications', label: 'My Applications', icon: FileText, path: '/dashboard' },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare, path: '/dashboard' },
    { id: 'documents', label: 'My Documents', icon: Files, path: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard' },
  ];

  if (!user) return null;

  const statCards = [
    { label: 'Total Applications', value: '42', trend: '+12%', color: 'text-[#003366]' },
    { label: 'Active Complaints', value: '08', trend: '-2%', color: 'text-amber-500' },
    { label: 'Node Trust Score', value: '82%', trend: '+5%', color: 'text-blue-500' },
    { label: 'Verified Devices', value: '154', trend: '+18%', color: 'text-emerald-500' },
  ];

  const recentActivity = [
    { id: 1, title: 'Network License Renewal', desc: 'BOCRA-INFRA (APP003) is awaiting documents.', status: 'Pending Documents', type: 'app', time: '2024-03-24' },
    { id: 2, title: 'Broadcasting Complaint', desc: 'Complaint registered against Regional Operator.', status: 'Under Review', type: 'complaint', time: '2024-03-23' },
    { id: 3, title: 'Type Approval Granted', desc: 'Device TP-502 has been successfully verified.', status: 'Approved', type: 'system', time: '2024-03-22' },
    { id: 4, title: 'Spectrum Fee Flagged', desc: 'Unpaid dues detected for Q1 2024.', status: 'Rejected / Flagged', type: 'app', time: '2024-03-21' },
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

  const renderContent = () => {
    // ... (rest of renderContent remains same, but I'll ensure it's not truncated)
    switch (activeTab) {
      case 'applications': return <ApplicationsView />;
      case 'complaints': return <ComplaintsView />;
      case 'documents': return <DocumentsView />;
      case 'settings': return <SettingsView />;
      default: return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stat Cards */}
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

          {/* Alert Banner */}
          <div id="alert-banner" className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-amber-500/40 transition-all shadow-xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center space-x-6 text-center md:text-left">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-xl text-white">Action Required</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-md font-medium">BOCRA-INFRA (APP003) is awaiting technical compliance documents for final review.</p>
              </div>
            </div>
            <Button 
                onClick={() => setActiveTab('applications')}
                className="w-full md:w-auto bg-[#F47920] hover:bg-[#C25E00] text-white rounded-2xl px-10 h-14 shadow-xl shadow-[#F47920]/20 font-black uppercase tracking-widest text-xs group-hover:scale-105 transition-all"
            >
              Resolve Now
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                   System Activity
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </h2>
                <div className="flex items-center space-x-6">
                   <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors">Archive</button>
                   <button onClick={() => setActiveTab('applications')} className="text-[10px] text-[#E8F0F9] font-bold uppercase tracking-widest hover:text-[#E8F0F9] transition-colors">Comprehensive Feed →</button>
                </div>
              </div>
              
              <div className="bg-[#0a0f1e]/50 backdrop-blur-xl border border-[#1e293b] rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="divide-y divide-[#1e293b]">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="p-8 hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ${
                          item.type === 'app' ? 'bg-[#003366]/10 text-[#E8F0F9] border border-[#003366]/20' : 
                          item.type === 'complaint' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                          'bg-[#003366]/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {item.type === 'app' ? <FileText className="w-6 h-6" /> : 
                           item.type === 'complaint' ? <MessageSquare className="w-6 h-6" /> : 
                           <Files className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-black text-lg text-slate-100 group-hover:text-[#E8F0F9] transition-colors tracking-tight">
                              {item.title}
                            </p>
                            {item.id === 1 && <Badge className="bg-amber-500/10 text-amber-500 border-none text-[8px] font-black uppercase tracking-widest">Urgent</Badge>}
                          </div>
                          <p className="text-slate-500 mt-1 text-sm font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-slate-400 font-black text-xs tracking-tight">{formatDate(item.time)}</p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-slate-950 rounded-lg border border-white/5 space-x-2">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(item.status) }}></div>
                           <span className="text-[9px] text-slate-300 font-extrabold uppercase tracking-widest">{item.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="px-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Power Actions</h2>
              </div>
              <div className="space-y-5">
                {[
                  { tab: 'applications', icon: Plus, color: 'teal', label: 'Start Application', desc: 'Secure new sector licenses' },
                  { tab: 'complaints', icon: MessageSquare, color: 'orange', label: 'Consumer Rights', desc: 'Report service violations' },
                  { path: '/tender-submission', icon: Files, color: 'blue', label: 'Submit Tender', desc: 'Upload a proposal for open tenders' },
                ].map((action, i) => (
                  <button key={i} onClick={() => action.path ? navigate(action.path) : setActiveTab(action.tab)} className="block w-full text-left group">
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
                      <span className="text-[#E8F0F9] font-black text-sm">82%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-[#003366] to-[#0A4D8C] w-[82%] rounded-full shadow-[0_0_15px_rgba(0,51,102,0.4)]"></div>
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
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-slate-800 text-[#E8F0F9] rounded-xl shadow-lg border border-white/10"
      >
        {mobileSidebarOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Retractable Sidebar */}
      <aside 
        id="sidebar-nav" 
        className={`bg-[#0a0f1e] border-r border-[#1e293b] flex flex-col h-full z-50 transition-all duration-500 ease-in-out 
          ${isSidebarCollapsed ? 'w-24' : 'w-80'}
          fixed lg:relative
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Toggle Button */}
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

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-2xl transition-all duration-300 relative group ${
                isSidebarCollapsed ? 'justify-center p-4' : 'px-6 py-4 space-x-4'
              } ${
                activeTab === item.id 
                  ? 'bg-[#003366]/10 text-[#E8F0F9] border border-[#003366]/20 shadow-lg shadow-teal-500/5' 
                  : 'text-slate-500 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <item.icon className={`transition-transform duration-300 ${isSidebarCollapsed ? 'w-6 h-6 group-hover:scale-110' : 'w-5 h-5'}`} />
              {!isSidebarCollapsed && (
                <span className="font-bold text-sm tracking-tight animate-in fade-in slide-in-from-left-2 duration-500">{item.label}</span>
              )}
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#003366] rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
              )}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-2xl border border-white/5">
                   {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Info Bottom */}
        <div className={`p-6 border-t border-white/5 transition-all duration-500 ${isSidebarCollapsed ? 'px-4' : ''}`}>
          <div 
             className={`flex items-center justify-between rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all shadow-sm ${
               isSidebarCollapsed ? 'p-3 flex-col gap-2' : 'p-4'
             }`}
          >
            <div 
              onClick={() => setActiveTab('settings')}
              className="flex items-center space-x-4 cursor-pointer flex-1 min-w-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F5F3]0/20 to-blue-500/20 border border-white/5 flex items-center justify-center font-black text-sm shadow-xl text-[#E8F0F9] shrink-0 hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-500">
                  <p className="text-sm font-black truncate text-slate-100">{user.name}</p>
                  <p className="text-[9px] text-[#003366] font-extrabold uppercase tracking-widest leading-none mt-1">Tier 1 Citizen</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 ml-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {/* Modern Glass Header */}
        <header className="sticky top-0 z-40 bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700 pl-12 lg:pl-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white">
              Hello, {user.name.split(' ')[0]}
              <span className="text-[#003366] ml-1">.</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Portal • {formatDate(currentTime)}
            </p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="relative group lg:block hidden animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#E8F0F9] transition-colors" />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-white/5 border border-white/5 rounded-[1.25rem] pl-10 pr-4 py-3 text-xs font-bold w-48 lg:w-72 focus:ring-1 focus:ring-[#003366] outline-none transition-all placeholder:text-slate-700 text-slate-100"
              />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
              {user.userType === 'admin' && (
                <Button 
                   onClick={() => navigate('/admin')}
                   variant="outline"
                   className="rounded-[1.25rem] border-[#003366]/30 text-[#E8F0F9] hover:bg-[#003366]/10 h-10 sm:h-12 px-4 sm:px-6 font-bold text-xs shadow-xl active:scale-95 transition-all"
                >
                  Admin Portal
                </Button>
              )}
              <button className="hidden sm:flex p-3 sm:p-3.5 bg-white/5 border border-white/5 rounded-[1.25rem] text-slate-500 hover:text-[#E8F0F9] relative group transition-all">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617] shadow-lg shadow-rose-500/40"></span>
              </button>
              <Button 
                 onClick={() => setActiveTab('settings')}
                 className="hidden sm:flex rounded-[1.25rem] bg-[#003366] hover:bg-[#003366] text-white h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
              >
                Access Settings
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 lg:p-12 pb-24 space-y-8 sm:space-y-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
