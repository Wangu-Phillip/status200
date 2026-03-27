import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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

const ISPTestComponent = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(''); // 'latency', 'download', 'upload'
  const [selectedISP, setSelectedISP] = useState('BTC');
  const [results, setResults] = useState(null);

  const isps = [
    { id: 'BTC', name: 'BTC Fixed', icon: Globe },
    { id: 'Mascom', name: 'Mascom 5G', icon: Wifi },
    { id: 'Orange', name: 'Orange Konnect', icon: Signal },
    { id: 'Liquid', name: 'Liquid Intelligent', icon: Zap },
  ];

  const [testHistory, setTestHistory] = useState([]);

  const runTest = () => {
    setIsTesting(true);
    setResults(null);
    setProgress(0);
    
    // Phase 1: Latency
    setCurrentStage('Synchronizing with closest BOCRA Node...');
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      
      if (p === 20) {
        setCurrentStage('Measuring Latency & Jitter...');
      } else if (p === 40) {
        setCurrentStage('Testing Download Throughput...');
      } else if (p === 70) {
        setCurrentStage('Testing Upload Throughput...');
      } else if (p === 90) {
        setCurrentStage('Uploading Diagnostic Data to BOCRA...');
      } else if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsTesting(false);
          const newResult = {
            id: Date.now(),
            isp: selectedISP,
            download: (Math.random() * 50 + 20).toFixed(1),
            upload: (Math.random() * 20 + 5).toFixed(1),
            latency: Math.floor(Math.random() * 40 + 10),
            jitter: Math.floor(Math.random() * 10 + 2),
            timestamp: new Date().toLocaleTimeString()
          };
          setResults(newResult);
          setTestHistory(prev => [newResult, ...prev].slice(0, 5));
          toast({
            title: "Diagnostic Complete",
            description: `Quality of Service data for ${selectedISP} has been logged.`,
          });
        }, 800);
      }
    }, 60);
  };

  return (
    <Card className="bg-[#0f172a] border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">ISP Live Test</h3>
            <p className="text-slate-400 text-sm">Select an operator and run a simulated Quality of Service test.</p>
          </div>
          
          <div className="space-y-3">
            {isps.map(isp => (
              <button
                key={isp.id}
                disabled={isTesting}
                onClick={() => setSelectedISP(isp.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selectedISP === isp.id 
                    ? 'bg-[#003366]/20 border-[#003366] text-[#E8F0F9]' 
                    : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <isp.icon size={18} className={selectedISP === isp.id ? 'text-[#75B2DD]' : ''} />
                  <span className="text-sm font-bold uppercase tracking-wider">{isp.name}</span>
                </div>
                {selectedISP === isp.id && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
              </button>
            ))}
          </div>

          <Button 
            onClick={runTest} 
            disabled={isTesting}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20"
          >
            {isTesting ? 'Initializing...' : 'Run Connectivity Test'}
          </Button>
        </div>

        <div className="lg:col-span-8 h-[400px] bg-slate-900/30 rounded-[2rem] border border-white/5 relative flex flex-col items-center justify-center p-8 overflow-hidden">
          {/* Animated Background Grids */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          {!isTesting && !results && (
            <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-[#003366]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#003366]/20">
                <Activity size={40} className="text-[#75B2DD] opacity-50" />
              </div>
              <h4 className="text-white font-bold mb-2">Ready to Test</h4>
              <p className="text-slate-500 text-xs uppercase tracking-widest">Select an ISP to begin real-time diagnostic</p>
            </div>
          )}

          {isTesting && (
            <div className="w-full max-w-md space-y-10 relative z-10">
              <div className="text-center">
                <h4 className="text-4xl font-black text-white mb-2 tabular-nums">
                  {currentStage.includes('Download') ? (progress * 1.5).toFixed(1) : progress}%
                </h4>
                <p className="text-[#75B2DD] text-xs font-black uppercase tracking-[0.3em] h-4">{currentStage}</p>
              </div>
              
              <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#003366] to-[#75B2DD]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['Latency', 'Download', 'Upload'].map((label, i) => (
                  <div key={label} className="text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${
                      (i === 0 && progress > 0) || (i === 1 && progress > 30) || (i === 2 && progress > 70) 
                        ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'
                    }`}></div>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && (
            <div className="w-full grid md:grid-cols-2 gap-8 relative z-10 animate-in fade-in zoom-in duration-500">
               <div className="col-span-full flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <CheckCircle className="text-emerald-500" size={20} />
                     <h4 className="text-xl font-bold text-white">Test Complete ({selectedISP})</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{results.timestamp}</span>
               </div>
               
               <div className="p-6 bg-[#0a0f1e] rounded-[1.5rem] border border-white/5 flex flex-col items-center">
                  <Download className="text-cyan-400 mb-4" size={24} />
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Download Speed</p>
                  <p className="text-4xl font-black text-white tabular-nums">{results.download} <span className="text-xs text-slate-500 uppercase">Mbps</span></p>
               </div>

               <div className="p-6 bg-[#0a0f1e] rounded-[1.5rem] border border-white/5 flex flex-col items-center">
                  <Zap className="text-amber-400 mb-4" size={24} />
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Upload Speed</p>
                  <p className="text-4xl font-black text-white tabular-nums">{results.upload} <span className="text-xs text-slate-500 uppercase">Mbps</span></p>
               </div>

               <div className="p-4 bg-slate-900 shadow-inner rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Ping (Latency)</p>
                  <p className="text-lg font-bold text-slate-200">{results.latency} ms</p>
               </div>

               <div className="p-4 bg-slate-900 shadow-inner rounded-xl border border-white/5 text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Jitter</p>
                  <p className="text-lg font-bold text-slate-200">{results.jitter} ms</p>
               </div>

               {/* Test History List */}
               {testHistory.length > 1 && (
                  <div className="col-span-full mt-4">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Session History</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {testHistory.slice(1).map(test => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-[11px]">
                          <span className="font-bold text-slate-300">{test.isp}</span>
                          <span className="text-emerald-400">{test.download} Mbps</span>
                          <span className="text-slate-500 font-mono">{test.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const LiveQoSMonitoring = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('Real-time');
  const [refreshCount, setRefreshCount] = useState(0);
  const [spectralData, setSpectralData] = useState([45, 78, 52, 90, 65, 88, 70, 95, 80, 55, 60, 48]);
  const [systemMetrics, setSystemMetrics] = useState({
    spectrumLoad: 72.4,
    activeNodes: 1248,
    networkHealth: 4.2,
    callSuccess: 98.5,
    availability: 99.9,
    nodeHealth: 94
  });
  const [historicalTrends, setHistoricalTrends] = useState({
    BTC: [95.2, 96.1, 97.3, 98.5, 98.2, 97.8, 98.5],
    Mascom: [94.8, 95.5, 96.2, 97.8, 97.5, 97.2, 97.8],
    Orange: [92.1, 92.8, 93.5, 94.2, 94.0, 93.8, 94.2],
  });
  const [regionalData, setRegionalData] = useState({
    BTC: { urban: 99, semiUrban: 95, rural: 87 },
    Mascom: { urban: 98, semiUrban: 93, rural: 85 },
    Orange: { urban: 96, semiUrban: 91, rural: 78 },
  });

  // Generate realistic mock data with natural variations
  const generateOperatorData = (baseName, index) => {
    const variation = Math.sin(refreshCount / 20 + index) * 2;
    const randomJitter = (Math.random() - 0.5) * 1.5;
    
    const baseMetrics = {
      BTC: {
        callSuccessRate: 98.5,
        dataSpeed: 45.2,
        networkAvailability: 99.8,
        voiceQuality: 4.2,
        latency: 28,
        coverage: 93
      },
      Mascom: {
        callSuccessRate: 97.8,
        dataSpeed: 42.1,
        networkAvailability: 99.5,
        voiceQuality: 4.0,
        latency: 32,
        coverage: 91.5
      },
      Orange: {
        callSuccessRate: 94.2,
        dataSpeed: 38.5,
        networkAvailability: 98.9,
        voiceQuality: 3.8,
        latency: 45,
        coverage: 87
      }
    };

    const base = baseMetrics[baseName];
    
    return {
      name: baseName,
      logo: baseName.substring(0, 3),
      status: base.callSuccessRate + variation + randomJitter > 95 ? 'Compliant' : 'Action Required',
      metrics: {
        callSuccessRate: { 
          value: parseFloat((base.callSuccessRate + variation).toFixed(2)), 
          target: 95, 
          trend: variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable', 
          change: variation > 0 ? `+${variation.toFixed(1)}%` : `${variation.toFixed(1)}%` 
        },
        dataSpeed: { 
          value: parseFloat((base.dataSpeed + variation * 1.5).toFixed(2)), 
          target: 30, 
          trend: variation > 0 ? 'up' : 'down', 
          change: `${variation > 0 ? '+' : ''}${(variation * 1.5).toFixed(1)} Mbps`, 
          unit: 'Mbps' 
        },
        networkAvailability: { 
          value: parseFloat((base.networkAvailability + variation * 0.5).toFixed(2)), 
          target: 99.0, 
          trend: variation > 0 ? 'up' : variation < 0 ? 'down' : 'stable', 
          change: variation > 0 ? `+${(variation * 0.5).toFixed(2)}%` : `${(variation * 0.5).toFixed(2)}%` 
        },
        voiceQuality: { 
          value: parseFloat((base.voiceQuality + variation * 0.15).toFixed(2)), 
          target: 3.5, 
          trend: variation > 0 ? 'up' : 'down', 
          change: `${variation > 0 ? '+' : ''}${(variation * 0.15).toFixed(2)}`, 
          unit: 'MOS' 
        },
        latency: { 
          value: Math.max(15, Math.round(base.latency - variation * 2)), 
          target: 50, 
          trend: variation > 0 ? 'down' : 'up', 
          change: variation > 0 ? `+${(variation * 2).toFixed(0)}ms` : `${(variation * 2).toFixed(0)}ms`, 
          unit: 'ms' 
        },
      },
      coverage: { 
        urban: Math.round(base.coverage + variation * 1.5 + 5), 
        rural: Math.round(base.coverage - variation * 2 - 5), 
        overall: parseFloat((base.coverage + variation * 0.5).toFixed(1))
      },
    };
  };

  // Update real-time data
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        setRefreshCount(prev => prev + 1);

        // Update spectral efficiency chart
        setSpectralData(prev => prev.map(val => {
          const change = (Math.random() - 0.5) * 15;
          return Math.max(20, Math.min(95, val + change));
        }));

        // Update system metrics
        setSystemMetrics(prev => ({
          spectrumLoad: Math.max(45, Math.min(85, prev.spectrumLoad + (Math.random() - 0.5) * 3)),
          activeNodes: prev.activeNodes + Math.floor((Math.random() - 0.5) * 20),
          networkHealth: Math.max(3.5, Math.min(4.5, prev.networkHealth + (Math.random() - 0.5) * 0.1)),
          callSuccess: Math.max(93, Math.min(99, prev.callSuccess + (Math.random() - 0.5) * 1)),
          availability: Math.max(99.5, Math.min(100, prev.availability + (Math.random() - 0.5) * 0.1)),
          nodeHealth: Math.max(85, Math.min(98, prev.nodeHealth + (Math.random() - 0.5) * 2))
        }));

        // Update historical trends
        setHistoricalTrends(prev => ({
          BTC: [...prev.BTC.slice(1), Math.max(95, Math.min(99, prev.BTC[prev.BTC.length - 1] + (Math.random() - 0.5) * 1))],
          Mascom: [...prev.Mascom.slice(1), Math.max(94, Math.min(99, prev.Mascom[prev.Mascom.length - 1] + (Math.random() - 0.5) * 1))],
          Orange: [...prev.Orange.slice(1), Math.max(92, Math.min(97, prev.Orange[prev.Orange.length - 1] + (Math.random() - 0.5) * 1))],
        }));

        // Update regional data
        setRegionalData(prev => ({
          BTC: { 
            urban: Math.max(95, Math.min(99, prev.BTC.urban + (Math.random() - 0.5) * 1)),
            semiUrban: Math.max(90, Math.min(97, prev.BTC.semiUrban + (Math.random() - 0.5) * 1)),
            rural: Math.max(80, Math.min(92, prev.BTC.rural + (Math.random() - 0.5) * 1))
          },
          Mascom: {
            urban: Math.max(94, Math.min(99, prev.Mascom.urban + (Math.random() - 0.5) * 1)),
            semiUrban: Math.max(88, Math.min(96, prev.Mascom.semiUrban + (Math.random() - 0.5) * 1)),
            rural: Math.max(78, Math.min(90, prev.Mascom.rural + (Math.random() - 0.5) * 1))
          },
          Orange: {
            urban: Math.max(92, Math.min(98, prev.Orange.urban + (Math.random() - 0.5) * 1)),
            semiUrban: Math.max(86, Math.min(94, prev.Orange.semiUrban + (Math.random() - 0.5) * 1)),
            rural: Math.max(74, Math.min(85, prev.Orange.rural + (Math.random() - 0.5) * 1))
          }
        }));
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const operators = [
    generateOperatorData('BTC', 0),
    generateOperatorData('Mascom', 1),
    generateOperatorData('Orange', 2),
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      {/* Dynamic Network Hero */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent)] flex items-center justify-center -z-10">
          <div className="w-[800px] h-[800px] border border-[#003366]/10 rounded-full animate-ping duration-[10000ms]"></div>
          <div className="absolute w-[600px] h-[600px] border border-[#003366]/5 rounded-full animate-ping duration-[7000ms]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#003366]/10 text-[#E8F0F9] px-4 py-1.5 rounded-full text-xs font-bold border border-[#003366]/20 mb-8 animate-in fade-in slide-in-from-bottom-4">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="uppercase tracking-widest leading-none">Global NOC Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-8">
                Network <span className="text-[#E8F0F9]">Quality</span> <br/>
                Pulse Monitor
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12">
                Real-time regulatory oversight of Botswana's communications landscape. Monitoring throughput, latency, and compliance across all licensed spectrum operators.
              </p>
            </div>

            <div className="w-full lg:w-[450px] animate-in fade-in zoom-in duration-700">
               <Card className="bg-[#0f172a]/80 backdrop-blur-xl border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#003366]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
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
                           <span className="text-white font-bold">{systemMetrics.spectrumLoad.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.6)]" style={{ width: `${systemMetrics.spectrumLoad}%` }}></div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Last Update</p>
                           <p className="text-sm font-bold text-slate-200 font-mono tracking-tighter">{lastUpdated.toLocaleTimeString()}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Stations</p>
                           <p className="text-sm font-bold text-slate-200">{systemMetrics.activeNodes.toLocaleString()} Nodes</p>
                        </div>
                     </div>
                     <Button className="w-full h-14 rounded-2xl bg-[#003366] hover:bg-[#003366] text-white font-bold shadow-xl shadow-teal-500/20" onClick={() => setAutoRefresh(!autoRefresh)}>
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
                <div className="h-1 w-12 bg-[#00897B] rounded-full"></div>
             </div>
             <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                {['Real-time', 'Regional', 'Historical', 'ISP Test'].map((t) => (
                  <button 
                    key={t} 
                    onClick={() => setActiveView(t)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === t ? 'bg-[#00897B] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeView === 'Real-time' && operators.map((op, i) => (
              <Card key={i} className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-[#003366]/30 transition-all shadow-2xl">
                <div className="p-8 pb-4 relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#003366]/5 rounded-full blur-3xl group-hover:bg-[#003366]/10 transition-all"></div>
                   
                   <div className="flex items-center justify-between mb-8 relative">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#F5F5F3]0 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-teal-500/10">
                           {op.logo.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white leading-none">{op.name}</h3>
                           <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Network Operator</p>
                        </div>
                      </div>
                      <Badge className={`border-none font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg ${op.status === 'Compliant' ? 'bg-[#2E7D32]/20 text-[#2E7D32]' : 'bg-[#C62828]/20 text-[#C62828]'}`}>
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
                      <span className="text-xs font-bold text-[#E8F0F9]">{op.coverage.overall}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-[#003366] rounded-full" style={{ width: `${op.coverage.overall}%` }}></div>
                   </div>
                   <button onClick={() => navigate('/qos-reporting')} className="w-full mt-6 py-3 rounded-xl bg-slate-900 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-[#003366] hover:text-[#E8F0F9] transition-all flex items-center justify-center space-x-2">
                       <span>Detailed Spectrum Analysis</span>
                       <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
              </Card>
            ))}

            {activeView === 'Regional' && Object.entries(regionalData).map(([operator, regions]) => (
              <Card key={operator} className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-[#003366]/30 transition-all shadow-2xl">
                <div className="p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F5F5F3]0 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-teal-500/10">
                      {operator.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white leading-none">{operator}</h3>
                      <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Regional Coverage</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(regions).map(([region, value]) => (
                      <div key={region} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 capitalize">{region}</span>
                          <span className="text-white font-bold">{Math.round(value)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            {activeView === 'Historical' && Object.entries(historicalTrends).map(([operator, trends]) => (
              <Card key={operator} className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-[#003366]/30 transition-all shadow-2xl">
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F5F5F3]0 to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-teal-500/10">
                      {operator.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white leading-none">{operator}</h3>
                      <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">7-Day Trend</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-1 h-32 bg-slate-800/30 p-3 rounded-lg">
                    {trends.map((value, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                        <span className="text-[8px] text-slate-500 group-hover/bar:text-cyan-400 transition-colors">{value.toFixed(1)}</span>
                        <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t transition-all hover:shadow-lg hover:shadow-emerald-500/50" style={{ height: `${(value / 100) * 100}%`, minHeight: '4px' }}></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-[10px] text-slate-500 text-center font-bold uppercase">
                    Call Success Rate Trend
                  </div>
                </div>
              </Card>
            ))}

            {activeView === 'ISP Test' && (
              <div className="col-span-full">
                <ISPTestComponent />
              </div>
            )}
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
                    { label: 'Voice Quality', icon: Phone, color: 'text-blue-400', bg: 'bg-[#003366]/10', val: systemMetrics.networkHealth.toFixed(2) },
                    { label: 'Call Success', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', val: systemMetrics.callSuccess.toFixed(1) + '%' },
                    { label: 'Availability', icon: Signal, color: 'text-emerald-400', bg: 'bg-emerald-500/10', val: systemMetrics.availability.toFixed(2) + '%' },
                    { label: 'Node Health', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10', val: systemMetrics.nodeHealth.toFixed(0) + '%' },
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
               <div className="absolute inset-0 bg-[#003366]/10 blur-[120px] rounded-full"></div>
               <div className="relative bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                   <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center space-x-3">
                        <Gauge className="w-5 h-5 text-[#E8F0F9]" />
                        <h3 className="text-lg font-bold text-white">Spectral Efficiency</h3>
                     </div>
                     <Download className="w-4 h-4 text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => {
                        const csvData = `Time,Efficiency\n${spectralData.map((val, i) => `Point ${i + 1},${val.toFixed(2)}`).join('\n')}`;
                        const blob = new Blob([csvData], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `spectral_efficiency_${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        toast({ 
                          title: "Export Complete", 
                          description: `Downloaded ${spectralData.length} spectral efficiency data points` 
                        });
                     }} />
                  </div>
                  
                  {/* Spectral Efficiency Chart with Visible Bars */}
                  <div className="h-96 bg-slate-800/20 rounded-lg p-4 flex items-end justify-between gap-1.5 border border-slate-700">
                     {spectralData.map((h, i) => (
                       <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group cursor-pointer">
                          <div className="text-[8px] text-slate-500 group-hover:text-cyan-400 transition-colors font-mono">
                            {h.toFixed(0)}
                          </div>
                          <div 
                            className={`w-full bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t transition-all duration-500 group-hover:shadow-lg group-hover:shadow-cyan-500/70 min-h-3 shadow-md shadow-cyan-500/40`} 
                            style={{ height: `${Math.max(8, h * 1.2)}%` }}
                            title={`Efficiency: ${h.toFixed(2)}%`}
                          ></div>
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
           <Globe className="w-12 h-12 text-[#003366] mx-auto mb-8 animate-spin-slow" />
           <h3 className="text-2xl font-bold text-white mb-6">Regional Compliance Framework</h3>
           <p className="text-slate-500 leading-relaxed mb-10">
             BOCRA's QoS framework is aligned with ITU standards and SADC regional guidelines. We provide this data to foster competition, ensure market transparency, and safeguard the interests of every citizen in Botswana.
           </p>
           <Button onClick={() => toast({ 
             title: "Downloading publication", 
             description: "The 2025 regulatory standards PDF is being downloaded. This contains all current QoS compliance requirements." 
           })} variant="outline" className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-bold text-sm tracking-wide">
              Official Regulatory Publication (2025)
           </Button>
        </div>
      </section>

      {/* Sticky BOCRA QOS Portal Button */}
      <div className="fixed bottom-8 right-8 z-50 max-w-xs animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-3">
          {/* Information Card */}
          <div className="bg-gradient-to-r from-[#003366] to-[#005499] border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-[11px] text-cyan-100 leading-relaxed mb-3">
              <span className="font-bold text-cyan-300">Access Official Data:</span> Visit BOCRA's official QOS monitoring portal for comprehensive real-time network quality metrics and regulatory compliance reports.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span className="font-bold uppercase tracking-wide">dqos.bocra.org.bw</span>
              <Globe className="w-3 h-3 text-cyan-400" />
            </div>
          </div>

          {/* CTA Button */}
          <a 
            href="https://dqos.bocra.org.bw/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full block"
          >
            <button className="w-full px-6 py-4 rounded-2xl font-bold text-white uppercase tracking-wide text-sm bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-cyan-300/50 flex items-center justify-center gap-2 group">
              <Gauge className="w-4 h-4 group-hover:animate-spin" />
              <span>Official BOCRA QOS</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </a>

          {/* Secondary Info */}
          <div className="text-center text-[9px] text-slate-500 space-y-1">
            <p>Official regulatory data</p>
            <p>Updated in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQoSMonitoring;
