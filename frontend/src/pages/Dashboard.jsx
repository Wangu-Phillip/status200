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
  Upload
} from 'lucide-react';
import { userApplications, userComplaints } from '../mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getStatusBadge = (status) => {
    if (status === 'Under Review') {
      return (
        <Badge variant="outline" className="border-teal-500 text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Clock className="h-3 w-3 mr-1" />
          Under Review
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-800 text-slate-300 border-slate-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
        {status}
      </Badge>
    );
  };

  const ComplaintTimeline = ({ status }) => {
    const steps = ['Submitted', 'Under Review', 'Response Sent', 'Resolved'];
    const currentStep = steps.indexOf(status);
    
    return (
      <div className="flex items-center w-full mt-6 space-x-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-3 h-3 rounded-full mb-2 ${idx <= currentStep ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-slate-800 border border-slate-700'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${idx <= currentStep ? 'text-teal-400' : 'text-slate-600'}`}>{step}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-[2px] flex-1 mb-5 ${idx <= currentStep ? 'bg-teal-500/50' : 'bg-slate-800'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'applications', label: 'My Applications', icon: FileText, path: '/dashboard' },
    { id: 'complaints', label: 'My Complaints', icon: MessageSquare, path: '/dashboard' },
    { id: 'documents', label: 'My Documents', icon: Files, path: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard' },
  ];

  const statCards = [
    { label: 'Total Applications', value: userApplications.length, trend: '+2', color: 'text-teal-400' },
    { label: 'Under Review', value: userApplications.filter(a => a.status === 'Under Review').length, trend: '0', color: 'text-amber-400' },
    { label: 'Approved', value: userApplications.filter(a => a.status === 'Approved').length, trend: '+1', color: 'text-emerald-400' },
    { label: 'Complaints', value: userComplaints.length, trend: '+1', color: 'text-rose-400' },
  ];

  const recentActivity = [
    { id: 1, title: 'Application Update', desc: 'APP003 status changed to "Pending Documents"', time: '2025-03-01T10:00:00', type: 'app' },
    { id: 2, title: 'New Message', desc: 'Case officer sent a reply to C-124', time: '2025-02-28T14:30:00', type: 'complaint' },
    { id: 3, title: 'Document Verified', desc: 'ID Copy for License Application approved', time: '2025-02-27T09:15:00', type: 'doc' },
    { id: 4, title: 'Fee Payment', desc: 'Type Approval fee verified for APP002', time: '2025-02-26T16:45:00', type: 'app' },
    { id: 5, title: 'Complaint Filed', desc: 'C-125 submitted against Mascom', time: '2025-02-25T11:20:00', type: 'complaint' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden dark">
      {/* Sidebar */}
      <aside id="sidebar-nav" className="w-72 bg-[#0a0f1e] border-r border-[#1e293b] flex flex-col h-full z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">B</div>
            <span className="text-xl font-bold tracking-tight">BOCRA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-600/10 text-teal-400 border border-teal-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info Bottom */}
        <div className="p-6 border-t border-[#1e293b]">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center font-bold text-sm shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">Citizen Portal</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-500 hover:text-rose-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-[#1e293b] px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋🏽</h1>
            <p className="text-slate-500 text-sm mt-1">Citizen Services Console • {formatDate(new Date())}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group lg:block hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
            <button className="p-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-slate-400 hover:text-teal-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
            </button>
            <Button variant="outline" className="rounded-xl border-[#1e293b] bg-[#0a0f1e] hover:bg-slate-800 text-slate-100 h-11 px-6 font-bold shadow-sm">
              Settings
            </Button>
          </div>
        </header>

        <div className="p-10 space-y-8">
          {/* Stat Cards */}
          <div id="stats-section" className="grid md:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <div key={i} className="bg-[#0a0f1e] border border-[#1e293b] p-6 rounded-[1.5rem] hover:border-teal-500/30 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-teal-500/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{card.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between relative">
                  <div className={`text-4xl font-bold tracking-tight ${card.color}`}>{card.value}</div>
                  <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/10 uppercase tracking-wider">
                    {card.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alert Banner */}
          <div id="alert-banner" className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-amber-500/10 transition-all">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 animate-pulse">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-200">Pending Action Required</h3>
                <p className="text-slate-500 text-sm mt-0.5 max-w-md">Mobile Network Infrastructure (APP003) is awaiting your documents for further verification.</p>
              </div>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8 h-12 shadow-xl shadow-amber-500/20 font-bold group-hover:scale-105 transition-transform">
              Submit Now
            </Button>
          </div>

          {/* Dashboard Body Container */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity Feed & Tracker */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold tracking-tight">System Portal Feed</h2>
                <div className="flex items-center space-x-4">
                   <button className="text-xs text-slate-500 font-bold uppercase tracking-wider hover:text-white transition-colors">Filters</button>
                   <button className="text-xs text-teal-400 font-bold uppercase tracking-wider hover:text-teal-300 transition-colors">View All Activities</button>
                </div>
              </div>
              
              <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="divide-y divide-[#1e293b]">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="p-8 hover:bg-slate-800/30 transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${
                          item.type === 'app' ? 'bg-teal-500/10 text-teal-400' : 
                          item.type === 'complaint' ? 'bg-orange-500/10 text-orange-400' : 
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {item.type === 'app' ? <FileText className="w-6 h-6" /> : 
                           item.type === 'complaint' ? <MessageSquare className="w-6 h-6" /> : 
                           <Files className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-slate-200 group-hover:text-teal-400 transition-colors flex items-center gap-3">
                            {item.title}
                            {item.id === 1 && getStatusBadge('Under Review')}
                          </p>
                          <p className="text-slate-500 mt-1">{item.desc}</p>
                          {(item.id === 2 || item.type === 'complaint') && <ComplaintTimeline status={item.id === 2 ? 'Under Review' : 'Submitted'} />}
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-slate-400 font-bold text-sm tracking-tight">{formatDate(item.time)}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 px-2 py-1 bg-slate-900 rounded-lg">Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar Area */}
            <div className="space-y-8">
              <div className="px-2">
                <h2 className="text-xl font-bold tracking-tight">Direct Access</h2>
              </div>
              <div className="space-y-5">
                {[
                  { to: '/license-application', icon: Plus, color: 'teal', label: 'New Application', desc: 'Start a new regulatory process' },
                  { to: '/complaints', icon: MessageSquare, color: 'orange', label: 'File Complaint', desc: 'Resolve disputes with providers' },
                  { to: '#', icon: Upload, color: 'blue', label: 'Upload Document', desc: 'Add evidence to your profile' }
                ].map((action, i) => (
                  <Link key={i} to={action.to} className="block group">
                    <div className={`bg-[#0a0f1e] border border-[#1e293b] p-8 rounded-[2rem] transition-all cursor-pointer relative overflow-hidden active:scale-95 border-b-4 border-b-transparent hover:border-b-teal-500/50 shadow-inner`}>
                      <div className={`w-14 h-14 bg-${action.color}-500/10 rounded-2xl flex items-center justify-center text-${action.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">{action.label}</h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{action.desc}</p>
                      <ArrowRight className={`absolute bottom-8 right-8 w-5 h-5 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all`} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Completion Progress Card */}
              <div className="bg-[#0a0f1e] border border-[#1e293b] p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Profile Completion</h3>
                  <span className="text-teal-400 font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[75%] rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
                </div>
                <p className="text-[10px] text-slate-600 mt-4 leading-relaxed font-bold uppercase tracking-wider">7/10 steps complete</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
