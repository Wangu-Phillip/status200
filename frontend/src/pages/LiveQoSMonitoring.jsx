import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Signal,
  Wifi,
  Phone,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  Zap,
  Globe,
  Radio,
  Cpu,
  ArrowUpRight,
  Gauge
} from 'lucide-react';

const LiveQoSMonitoring = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); 
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const operators = [
    {
      name: 'BTC',
      logo: 'BTC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 98.5, target: 95, trend: 'up', change: '+0.3%' },
        dataSpeed: { value: 45.2, target: 30, trend: 'up', change: '+2.1 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.8, target: 99.0, trend: 'stable', change: '0%' },
        voiceQuality: { value: 4.2, target: 3.5, trend: 'up', change: '+0.1', unit: 'MOS' },
        latency: { value: 28, target: 50, trend: 'down', change: '-3ms', unit: 'ms' },
      },
      coverage: { urban: 99, rural: 87, overall: 93 },
    },
    {
      name: 'Mascom',
      logo: 'MSC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 97.8, target: 95, trend: 'up', change: '+0.5%' },
        dataSpeed: { value: 42.1, target: 30, trend: 'stable', change: '0 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.5, target: 99.0, trend: 'up', change: '+0.2%' },
        voiceQuality: { value: 4.0, target: 3.5, trend: 'stable', change: '0', unit: 'MOS' },
        latency: { value: 32, target: 50, trend: 'up', change: '+2ms', unit: 'ms' },
      },
      coverage: { urban: 98, rural: 85, overall: 91.5 },
    },
    {
      name: 'Orange',
      logo: 'ORG',
      status: 'Action Required',
      metrics: {
        callSuccessRate: { value: 94.2, target: 95, trend: 'down', change: '-0.8%' },
        dataSpeed: { value: 38.5, target: 30, trend: 'down', change: '-1.5 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 98.9, target: 99.0, trend: 'down', change: '-0.3%' },
        voiceQuality: { value: 3.8, target: 3.5, trend: 'down', change: '-0.2', unit: 'MOS' },
        latency: { value: 45, target: 50, trend: 'stable', change: '0ms', unit: 'ms' },
      },
      coverage: { urban: 96, rural: 78, overall: 87 },
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      {/* Dynamic Network Hero */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent)] flex items-center justify-center -z-10">
          <div className="w-[800px] h-[800px] border border-teal-500/10 rounded-full animate-ping duration-[10000ms]"></div>
          <div className="absolute w-[600px] h-[600px] border border-teal-500/5 rounded-full animate-ping duration-[7000ms]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-teal-500/10 text-teal-400 px-4 py-1.5 rounded-full text-xs font-bold border border-teal-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="uppercase tracking-widest leading-none">Global NOC Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-8">
                Network <span className="text-teal-400">Quality</span> <br/>
                Pulse Monitor
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12">
                Real-time regulatory oversight of Botswana's communications landscape. Monitoring throughput, latency, and compliance across all licensed spectrum operators.
              </p>
            </div>

            <div className="w-full lg:w-[450px] animate-in fade-in zoom-in duration-700">
               <Card className="bg-[#0f172a]/80 backdrop-blur-xl border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">System Health</span>
                        <div className="flex items-center space-x-1.5">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                           <span className="text-emerald-500 text-xs font-bold uppercase">Operational</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-400">National Spectrum Load</span>
                           <span className="text-white font-bold">72.4%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 w-[72%] rounded-full shadow-[0_2px_10px_rgba(20,184,166,0.5)]"></div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Last Update</p>
                           <p className="text-sm font-bold text-slate-200 font-mono tracking-tighter">{lastUpdated.toLocaleTimeString()}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Stations</p>
                           <p className="text-sm font-bold text-slate-200">1,248 Nodes</p>
                        </div>
                     </div>
                     <Button className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-xl shadow-teal-500/20" onClick={() => setAutoRefresh(!autoRefresh)}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                        {autoRefresh ? 'Watching Pulse...' : 'Resume Monitor'}
                     </Button>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modern High-Performance Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
             <div>
                <h2 className="text-3xl font-bold text-white mb-2">Technical Insight</h2>
                <div className="h-1 w-12 bg-teal-500 rounded-full"></div>
             </div>
             <div className="flex items-center space-x-3 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                {['Real-time', 'Regional', 'Historical'].map((t) => (
                  <button key={t} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${t === 'Real-time' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operators.map((op, i) => (
              <Card key={i} className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-teal-500/30 transition-all shadow-2xl">
                <div className="p-8 pb-4 relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-all"></div>
                   
                   <div className="flex items-center justify-between mb-8 relative">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-teal-500/10">
                           {op.logo.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white leading-none">{op.name}</h3>
                           <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Network Operator</p>
                        </div>
                      </div>
                      <Badge className={`border-none font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg ${op.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                         {op.status}
                      </Badge>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Throughput</p>
                        <div className="flex items-baseline space-x-1">
                           <span className="text-2xl font-black text-slate-100">{op.metrics.dataSpeed.value}</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase">{op.metrics.dataSpeed.unit}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-emerald-400 font-bold">
                           <TrendingUp className="w-3 h-3 mr-1" />
                           {op.metrics.dataSpeed.change}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Latency</p>
                        <div className="flex items-baseline space-x-1">
                           <span className="text-2xl font-black text-slate-100">{op.metrics.latency.value}</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase">{op.metrics.latency.unit}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-rose-400 font-bold">
                           <TrendingDown className="w-3 h-3 mr-1" />
                           {op.metrics.latency.change}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mt-auto border-t border-white/5 p-8 pt-6 bg-white/[0.01]">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 tracking-wider">National Coverage</span>
                      <span className="text-xs font-bold text-teal-400">{op.coverage.overall}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${op.coverage.overall}%` }}></div>
                   </div>
                   <button className="w-full mt-6 py-3 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-teal-500 hover:text-teal-400 transition-all flex items-center justify-center space-x-2">
                       <span>Detailed Spectrum Analysis</span>
                       <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Global Metrics Visualization */}
      <section className="py-24 bg-slate-900/[0.15] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <div>
                  <h2 className="text-4xl font-bold text-white mb-6">Transparency 2.0</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Our monitoring protocols leverage edge computing and node-level sensors to deliver the most accurate Quality of Service metrics in the SADC region.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Voice Quality', icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10', val: '4.2' },
                    { label: 'Call Success', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', val: '98.5%' },
                    { label: 'Availability', icon: Signal, color: 'text-emerald-400', bg: 'bg-emerald-500/10', val: '99.9%' },
                    { label: 'Node Health', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10', val: '94%' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center space-x-4 p-5 bg-[#0a0f1e] rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all">
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
                          <p className="text-lg font-black text-white">{stat.val}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-teal-500/10 blur-[120px] rounded-full"></div>
               <div className="relative bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center space-x-3">
                        <Gauge className="w-5 h-5 text-teal-400" />
                        <h3 className="text-lg font-bold text-white">Spectral Efficiency</h3>
                     </div>
                     <Download className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                  </div>
                  
                  {/* Decorative Chart Placeholder with Modern Aesthetic */}
                  <div className="h-64 flex items-end justify-between gap-2">
                     {[45, 78, 52, 90, 65, 88, 70, 95, 80, 55, 60, 48].map((h, i) => (
                       <div key={i} className="flex-1 space-y-2">
                          <div 
                            className={`w-full bg-gradient-to-t from-teal-600/20 to-teal-500 rounded-t-lg transition-all duration-1000 delay-${i * 100} hover:brightness-110`} 
                            style={{ height: `${h}%` }}
                          ></div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-10 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                     <span>Jan 2025</span>
                     <span>Current Q1 Trend</span>
                     <span>Mar 2025</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center px-4">
           <Globe className="w-12 h-12 text-teal-500 mx-auto mb-8 animate-spin-slow" />
           <h3 className="text-2xl font-bold text-white mb-6">Regional Compliance Framework</h3>
           <p className="text-slate-500 leading-relaxed mb-10">
             BOCRA's QoS framework is aligned with ITU standards and SADC regional guidelines. We provide this data to foster competition, ensure market transparency, and safeguard the interests of every citizen in Botswana.
           </p>
           <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-bold text-sm tracking-wide">
              Official Regulatory Publication (2025)
           </Button>
        </div>
      </section>
    </div>
  );
};

export default LiveQoSMonitoring;
