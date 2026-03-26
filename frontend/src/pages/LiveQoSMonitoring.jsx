import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Activity, 
  ArrowLeft, 
  Play, 
  Square, 
  Download, 
  Upload, 
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Wifi,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Monitor,
  RefreshCw,
  Search,
  Signal,
  Phone,
  Zap,
  Globe,
  Radio,
  Cpu,
  ArrowUpRight,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const API = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000") + "/api";

const testPhases = [
  { id: "download", label: "Testing Download Speed", icon: Download },
  { id: "upload", label: "Testing Upload Speed", icon: Upload },
  { id: "latency", label: "Measuring Latency", icon: Clock }
];

const LiveQoSMonitoring = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitor');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeView, setActiveView] = useState('Real-time');

  // Speed Test State
  const [isps, setIsps] = useState([]);
  const [selectedIsp, setSelectedIsp] = useState("");
  const [location, setLocation] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testPhase, setTestPhase] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [speedResult, setSpeedResult] = useState(null);
  const [latencyData, setLatencyData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchIsps();
    if (autoRefresh && activeView === 'Real-time') {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); 
      return () => clearInterval(interval);
    }
  }, [autoRefresh, activeView]);

  const fetchIsps = async () => {
    try {
      const response = await axios.get(`${API}/isps`);
      setIsps(response.data);
    } catch (error) {
      console.error("Error fetching ISPs:", error);
      setIsps([
        { id: "btc", name: "BTC", regulated_speed_mbps: 50, description: "Botswana Telecommunications Corporation" },
        { id: "mascom", name: "Mascom", regulated_speed_mbps: 100, description: "Mascom Wireless" },
        { id: "orange", name: "Orange", regulated_speed_mbps: 100, description: "Orange Botswana" }
      ]);
    }
  };

  const simulateSpeedTest = () => {
    if (!selectedIsp) {
      toast.error("Please select your ISP");
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter your location");
      return;
    }

    setIsTesting(true);
    setTestProgress(0);
    setTestPhase(0);
    setSpeedResult(null);
    setShowAlert(false);
    setLatencyData([]);

    const selectedIspData = isps.find(isp => isp.id === selectedIsp);
    const promisedSpeed = selectedIspData?.regulated_speed_mbps || 20;
    
    const percentageOfPromised = 30 + Math.random() * 60;
    const downloadSpeed = (promisedSpeed * percentageOfPromised / 100);
    const uploadSpeed = downloadSpeed * (0.3 + Math.random() * 0.3);
    const latency = 20 + Math.random() * 80;

    let progress = 0;
    let phase = 0;
    const latencyPoints = [];

    intervalRef.current = setInterval(() => {
      progress += 2;
      
      if (progress % 10 === 0) {
        latencyPoints.push({
          time: `${progress}%`,
          latency: Math.round(latency + (Math.random() - 0.5) * 20)
        });
        setLatencyData([...latencyPoints]);
      }
      
      if (progress >= 33 && phase === 0) {
        phase = 1;
        setTestPhase(1);
      }
      if (progress >= 66 && phase === 1) {
        phase = 2;
        setTestPhase(2);
      }
      
      setTestProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalRef.current);
        setIsTesting(false);
        
        const result = {
          download_speed_mbps: Math.round(downloadSpeed * 10) / 10,
          upload_speed_mbps: Math.round(uploadSpeed * 10) / 10,
          latency_ms: Math.round(latency),
          promised_speed_mbps: promisedSpeed,
          percentage_of_promised: Math.round(percentageOfPromised),
          isp_name: selectedIspData?.name || "Unknown ISP"
        };
        
        setSpeedResult(result);
        saveSpeedTest(result);
        
        if (percentageOfPromised < 50) {
          setTimeout(() => setShowAlert(true), 500);
        }
      }
    }, 100);
  };

  const saveSpeedTest = async (result) => {
    try {
      await axios.post(`${API}/speed-test`, {
        isp_id: selectedIsp,
        download_speed_mbps: result.download_speed_mbps,
        upload_speed_mbps: result.upload_speed_mbps,
        latency_ms: result.latency_ms,
        location: location
      });
      toast.success("Speed test recorded");
    } catch (error) {
      console.error("Error saving speed test:", error);
    }
  };

  const cancelTest = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTesting(false);
    setTestProgress(0);
    setTestPhase(0);
  };

  const handleFileComplaint = () => {
    navigate(`/complaints`);
    window.dispatchEvent(new CustomEvent('openChatBot', { 
      detail: { 
        autoMessage: true,
        context: speedResult 
      }
    }));
  };

  const getSpeedColor = (percentage) => {
    if (percentage >= 80) return "#16A34A";
    if (percentage >= 50) return "#F59E0B";
    return "#DC2626";
  };

  const getSpeedStatus = (percentage) => {
    if (percentage >= 80) return { label: "Good", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 50) return { label: "Fair", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  const operators = [
    {
      name: 'BTC',
      logo: 'BTC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 98.5, target: 95, trend: 'up', change: '+0.3%' },
        dataSpeed: { value: 45.2, target: 30, trend: 'up', change: '+2.1 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.8, target: 99.0, trend: 'stable', change: '0%' },
        latency: { value: 28, target: 50, trend: 'down', change: '-3ms', unit: 'ms' },
      },
      coverage: { overall: 93 },
    },
    {
      name: 'Mascom',
      logo: 'MSC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 97.8, target: 95, trend: 'up', change: '+0.5%' },
        dataSpeed: { value: 42.1, target: 30, trend: 'stable', change: '0 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.5, target: 99.0, trend: 'up', change: '+0.2%' },
        latency: { value: 32, target: 50, trend: 'up', change: '+2ms', unit: 'ms' },
      },
      coverage: { overall: 91.5 },
    },
    {
      name: 'Orange',
      logo: 'ORG',
      status: 'Action Required',
      metrics: {
        callSuccessRate: { value: 94.2, target: 95, trend: 'down', change: '-0.8%' },
        dataSpeed: { value: 38.5, target: 30, trend: 'down', change: '-1.5 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 98.9, target: 99.0, trend: 'down', change: '-0.3%' },
        latency: { value: 45, target: 50, trend: 'stable', change: '0ms', unit: 'ms' },
      },
      coverage: { overall: 87 },
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      {/* Dynamic Network Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,51,102,0.2),transparent)] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-[#003366]/20 text-[#75B2DD] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#003366]/30 mb-8"
              >
                <Activity className="w-3 h-3 animate-pulse" />
                <span>National QoS Sentinel</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[0.9]">
                Live Network <br/>
                <span className="text-[#75B2DD]">Performance</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Real-time regulatory oversight of Botswana's telecommunications landscape. Transparency-driven metrics for national connectivity.
              </p>
            </div>

            <div className="w-full lg:w-[450px]">
               <Card className="bg-[#0f172a]/80 backdrop-blur-xl border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#003366]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">National Spectrum Load</span>
                        <div className="flex items-center space-x-1.5">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                           <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Live Feed</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-4xl font-black text-white">72.4%</span>
                           <span className="text-slate-500 text-[10px] font-bold uppercase pb-1">Operational Density</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '72.4%' }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             className="h-full bg-gradient-to-r from-[#003366] to-[#75B2DD] rounded-full"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Last Update</p>
                           <p className="text-sm font-black text-slate-200 font-mono">{lastUpdated.toLocaleTimeString()}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Active Nodes</p>
                           <p className="text-sm font-black text-slate-200">1,248 Core</p>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Toggle */}
      <section className="py-12 bg-slate-900/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Technical Insight HUB</h2>
                <div className="h-1 w-12 bg-[#75B2DD] rounded-full"></div>
              </div>
              <TabsList className="bg-slate-900 border border-white/10 p-1.5 h-auto rounded-2xl">
                <TabsTrigger 
                  value="monitor" 
                  className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#003366] data-[state=active]:text-white"
                >
                  <Signal className="w-4 h-4 mr-2" />
                  National Monitor
                </TabsTrigger>
                <TabsTrigger 
                  value="test" 
                  className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#003366] data-[state=active]:text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Live Speed Test
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monitor" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {operators.map((op, i) => (
                  <Card key={i} className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-[#003366]/30 transition-all shadow-2xl">
                    <div className="p-8 pb-4 relative overflow-hidden">
                       <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#003366]/5 rounded-full blur-3xl group-hover:bg-[#003366]/10 transition-all"></div>
                       
                       <div className="flex items-center justify-between mb-8 relative">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#75B2DD] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/10">
                               {op.logo.charAt(0)}
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-white leading-none">{op.name}</h3>
                               <p className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest">Network Operator</p>
                            </div>
                          </div>
                          <Badge className={`border-none font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-lg ${op.status === 'Compliant' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                             {op.status}
                          </Badge>
                       </div>

                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Throughput</p>
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
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Latency</p>
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
                          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">National Coverage</span>
                          <span className="text-[10px] font-black text-[#75B2DD]">{op.coverage.overall}%</span>
                       </div>
                       <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003366] rounded-full" style={{ width: `${op.coverage.overall}%` }}></div>
                       </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="test" className="mt-0">
               <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] overflow-hidden">
                      <div className="p-8">
                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1. Select Provider</Label>
                            <Select value={selectedIsp} onValueChange={setSelectedIsp}>
                              <SelectTrigger className="bg-slate-900/50 border-slate-800 h-14 rounded-2xl text-white">
                                <SelectValue placeholder="Choose ISP" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a0f1e] border-slate-800">
                                {isps.map(isp => (
                                  <SelectItem key={isp.id} value={isp.id} className="text-slate-300">
                                    {isp.name} ({isp.regulated_speed_mbps} Mbps)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2. Your Location</Label>
                            <Input 
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Gaborone" 
                              className="bg-slate-900/50 border-slate-800 h-14 rounded-2xl text-white pl-6"
                            />
                          </div>
                        </div>

                        <div className="text-center py-10">
                          {!isTesting && !speedResult && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <Button 
                                onClick={simulateSpeedTest}
                                className="bg-[#003366] hover:bg-[#004488] text-white font-black h-20 px-16 rounded-3xl text-lg shadow-2xl shadow-blue-500/20"
                              >
                                <Play className="w-6 h-6 mr-3 fill-current" />
                                START LIVE TEST
                              </Button>
                              <p className="mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest">Click to measure actual throughput</p>
                            </motion.div>
                          )}

                          {isTesting && (
                            <div className="space-y-10">
                               <div className="relative w-40 h-40 mx-auto">
                                  <svg className="w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="75" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                                    <motion.circle 
                                      cx="80" cy="80" r="75" stroke="#75B2DD" strokeWidth="6" fill="transparent"
                                      strokeDasharray="471"
                                      animate={{ strokeDashoffset: 471 - (471 * testProgress) / 100 }}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                     <span className="text-4xl font-black">{testProgress}%</span>
                                  </div>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                  <div className="flex items-center gap-3 text-[#75B2DD] font-black uppercase text-[10px] tracking-widest">
                                     {testPhases[testPhase]?.icon && React.createElement(testPhases[testPhase].icon, { className: "w-4 h-4 animate-bounce" })}
                                     <span>{testPhases[testPhase]?.label}</span>
                                  </div>
                                  <Button onClick={cancelTest} variant="ghost" className="text-rose-500 hover:text-rose-400 text-xs font-black uppercase tracking-widest mt-2">Abort</Button>
                               </div>
                            </div>
                          )}

                          {speedResult && !isTesting && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10">
                               <div className="flex flex-col items-center">
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Measured Download</div>
                                  <div className="flex items-baseline gap-2">
                                     <span className="text-8xl font-black tracking-tighter" style={{ color: getSpeedColor(speedResult.percentage_of_promised) }}>
                                        {speedResult.download_speed_mbps}
                                     </span>
                                     <span className="text-xl text-slate-500 font-black uppercase">Mbps</span>
                                  </div>
                               </div>

                               <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                                  {[
                                    { val: speedResult.upload_speed_mbps, unit: 'Mbps', label: 'Upload' },
                                    { val: speedResult.latency_ms, unit: 'ms', label: 'Latency' },
                                    { val: speedResult.promised_speed_mbps, unit: 'Mbps', label: 'Plan' }
                                  ].map((s, i) => (
                                    <div key={i} className="p-5 bg-slate-900/50 rounded-2xl border border-white/5">
                                      <p className="text-xl font-black leading-none mb-1">{s.val}</p>
                                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label} ({s.unit})</p>
                                    </div>
                                  ))}
                               </div>

                               <div className="flex gap-4 justify-center">
                                  <Button onClick={simulateSpeedTest} className="bg-white/5 hover:bg-white/10 text-slate-300 font-black h-14 px-10 rounded-2xl border border-white/5">Retest</Button>
                                  {speedResult.percentage_of_promised < 85 && (
                                    <Button onClick={handleFileComplaint} className="bg-rose-600 hover:bg-rose-500 text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-rose-900/20">File Complaint</Button>
                                  )}
                               </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="space-y-6">
                     <Card className="bg-[#0f172a] border-slate-800 rounded-3xl p-8 relative overflow-hidden h-full">
                        <Gauge className="w-10 h-10 text-[#75B2DD] mb-6" />
                        <h3 className="text-xl font-black text-white mb-4">SLA Compliance</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-10">
                           Every test result helps BOCRA monitor ISP performance across the country. Data is used for regulatory reviews and consumer protection audits.
                        </p>
                        <ul className="space-y-4">
                           {['Anonymized Data', 'Location Aware', 'Instant Verification'].map((feat, i) => (
                             <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                <CheckCircle className="w-4 h-4 text-[#75B2DD]" />
                                {feat}
                             </li>
                           ))}
                        </ul>
                     </Card>
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Persistence of previous visualizations */}
      <section className="py-24 bg-[#020617]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-6 leading-tight">National Node <br/> Intelligence</h2>
                    <p className="text-slate-400 text-lg">BOCRA leverages an extensive network of physical and virtual sensors to ensure the integrity of the nation's digital infrastructure.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     {[
                       { label: 'Network MOS', val: '4.2 Avg', icon: Phone },
                       { label: 'Call Success', val: '98.5%', icon: Zap },
                       { label: 'Uptime', val: '99.99%', icon: Signal },
                       { label: 'Node Health', val: 'Optimal', icon: Cpu }
                     ].map((stat, i) => (
                       <div key={i} className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5">
                          <stat.icon className="w-6 h-6 text-[#75B2DD] mb-3" />
                          <p className="text-2xl font-black text-white">{stat.val}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="relative bg-[#0f172a] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                         <Globe className="w-5 h-5 text-[#75B2DD]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Spectral Efficiency Trend</span>
                      </div>
                   </div>
                   <div className="h-48 flex items-end justify-between gap-1.5">
                      {[40, 65, 45, 80, 55, 90, 70, 95, 85, 60, 75, 50].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          className="flex-1 bg-[#003366] rounded-t-lg opacity-40 hover:opacity-100 transition-opacity"
                        />
                      ))}
                   </div>
                   <div className="mt-6 flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-600">
                      <span>Jan</span>
                      <span>Real-time Pulse</span>
                      <span>Mar</span>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* Auto Alert Modal for Speed Test */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0f1e] rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-white/5"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="font-black text-3xl text-white mb-4 tracking-tighter">Performance Deficit</h3>
                <p className="text-slate-400 mb-10 leading-relaxed text-lg font-medium">
                  Your measured throughput of <strong>{speedResult?.download_speed_mbps} Mbps</strong> is significantly below your plan's target. File a case?
                </p>
                <div className="flex flex-col gap-4">
                  <Button onClick={handleFileComplaint} className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl h-16 font-black text-lg">YES, FILE COMPLAINT</Button>
                  <Button variant="ghost" onClick={() => setShowAlert(false)} className="rounded-2xl h-14 text-slate-500 font-bold">CLOSE</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveQoSMonitoring;
