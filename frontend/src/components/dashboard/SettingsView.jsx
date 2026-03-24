import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Settings, User, Bell, Shield, Key, Eye, Play, Trash2, LogOut, ChevronRight, 
  CheckCircle, Globe, Palette, Sliders, AlertTriangle 
} from 'lucide-react';

const SettingsView = () => {
  const [activeSubTab, setActiveSubTab] = useState('profile');

  const replayTour = () => {
    localStorage.removeItem('bocra_tour_seen');
    window.location.reload();
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'preferences', icon: Sliders, label: 'Interface' },
  ];

  const renderActiveTab = () => {
    switch (activeSubTab) {
      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-teal-500" />
                  Authentication Protocol
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold uppercase tracking-widest text-[10px]">Active: JWT (RS256)</Badge>
              </div>
              <div className="space-y-6 relative">
                <div className="p-6 bg-slate-900/50 border border-[#1e293b] rounded-3xl">
                  <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-slate-200">Session Token Rotation</p>
                     <span className="text-[10px] text-teal-400 font-bold bg-teal-500/5 px-2 py-1 rounded-lg">ENABLED</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">Your portal session uses stateless JSON Web Tokens (JWT) with automatic 15-minute rotation for maximum security.</p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-[#1e293b] rounded-3xl">
                  <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-slate-200">Active Sessions</p>
                     <span className="text-[10px] text-slate-500 font-bold">1 DEVICE</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400">
                           <Globe className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-300">Chrome on Windows (Gaborone)</p>
                           <p className="text-[10px] text-slate-600 uppercase font-bold">Current Session</p>
                        </div>
                     </div>
                     <Button variant="ghost" className="text-xs text-rose-500 hover:text-rose-400 font-bold">Terminate</Button>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-[#334155] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center">
                    <Key className="w-5 h-5 mr-3 text-blue-500" />
                    Two-Factor (2FA)
                  </h3>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Protected by SMS-based verification (+267 •••• 124). Switch to Authenticator App for higher security.</p>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-[#1e293b] bg-transparent hover:bg-blue-500/5 text-slate-300 hover:text-blue-400 font-bold text-sm shadow-inner transition-all">
                  Modify 2FA Settings
                </Button>
              </div>
              <div className="bg-[#0a0f1e] border border-rose-500/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center">
                    <Trash2 className="w-5 h-5 mr-3 text-rose-500" />
                    Archive Data
                  </h3>
                  <AlertTriangle className="w-5 h-5 text-rose-500/20" />
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Permanently wipe your regulatory record archive from the system portal.</p>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-rose-500/20 bg-transparent hover:bg-rose-500/10 text-rose-500/50 hover:text-rose-500 font-bold text-sm shadow-inner transition-all">
                  Wipe Records
                </Button>
              </div>
            </div>
          </div>
        );
      case 'profile':
      default:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-500">
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/[0.03] rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex items-center justify-between mb-10 relative">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Play className="w-5 h-5 mr-3 text-teal-500 fill-teal-500/20" />
                  Quick Onboarding
                </h3>
                <Badge className="bg-teal-500/10 text-teal-500 border-none font-bold uppercase tracking-widest text-[10px]">Portal Help</Badge>
              </div>
              <div className="flex items-start justify-between bg-slate-900/50 border border-[#1e293b] p-8 rounded-3xl group-hover:bg-slate-900 group-hover:border-teal-500/30 transition-all cursor-pointer relative overflow-hidden" onClick={replayTour}>
                 <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                 <div className="flex-1 max-w-lg relative">
                    <p className="font-bold text-slate-200 text-lg">Replay Ruby Tour</p>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">Want a refresher? This will reset your first-login tour and Ruby will guide you through the latest portal features again.</p>
                 </div>
                 <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all">
                    <Play className="w-6 h-6 fill-teal-400" />
                 </div>
              </div>
            </section>
            <section className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-100 flex items-center">
                  <Palette className="w-5 h-5 mr-3 text-purple-500" />
                  Interface Preferences
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Dark Mode (Dashdark-X)', desc: 'Optimized for high-contrast visibility and reduced eye strain', active: true },
                  { label: 'Compact Layout', desc: 'Fits more information into the active dashboard area', active: false },
                  { label: 'High Contrast Mode', desc: 'Enhanced accessibility for users with visual impairments', active: false }
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-900/30 rounded-3xl border border-[#1e293b] hover:border-[#334155] transition-all">
                    <div className="max-w-md">
                      <p className="font-bold text-slate-200">{pref.label}</p>
                      <p className="text-slate-500 text-sm mt-1">{pref.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${pref.active ? 'bg-teal-600' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${pref.active ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Console Settings</h2>
          <p className="text-slate-500 mt-2 leading-relaxed">Manage your citizen profile, security preferences, and dashboard interface.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="rounded-2xl border-[#1e293b] bg-[#0a0f1e] hover:bg-rose-500/10 hover:text-rose-400 group h-12 px-6 font-bold shadow-xl transition-all">
             <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
             Log Out
          </Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-2 lg:col-span-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group font-bold text-sm ${
                activeSubTab === item.id 
                  ? 'bg-teal-600/10 text-teal-400 border border-teal-600/20 shadow-lg shadow-teal-500/5' 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent hover:border-[#1e293b]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeSubTab === item.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </aside>
        <main className="lg:col-span-3">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default SettingsView;
