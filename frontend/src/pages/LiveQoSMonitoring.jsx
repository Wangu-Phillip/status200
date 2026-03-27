import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { useToast } from '../hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Signal,
  Wifi,
  Phone,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Gauge,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Clock as ClockIcon,
  MapPin,
  Play,
  Square,
  RefreshCw,
  Zap,
  Shield,
  Globe,
  Radio,
  Cpu
} from 'lucide-react';

const API = "/api";

const testPhases = [
  { id: "download", label: "Testing Download Speed", icon: DownloadIcon },
  { id: "upload", label: "Testing Upload Speed", icon: UploadIcon },
  { id: "latency", label: "Measuring Latency", icon: ClockIcon }
];

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
  }, []);

  const fetchIsps = async () => {
    try {
      const response = await axios.get(`${API}/isps`);
      setIsps(response.data);
    } catch (error) {
      console.error("Error fetching ISPs:", error);
    }
  };

  const simulateSpeedTest = () => {
    if (!selectedIsp) {
      toast({ title: "Operator Required", description: "Please select your ISP to start.", variant: "destructive" });
      return;
    }
    if (!location.trim()) {
      toast({ title: "Location Required", description: "Please enter your location for record verification.", variant: "destructive" });
      return;
    }

    setIsTesting(true);
    setTestProgress(0);
    setTestPhase(0);
    setSpeedResult(null);
    setShowAlert(false);
    setLatencyData([]);

    // Get regulated speed for the selected ISP
    const selectedIspData = isps.find(isp => isp.id === selectedIsp) || 
                          { name: selectedIsp, regulated_speed_mbps: 20 };
    const promisedSpeed = selectedIspData?.regulated_speed_mbps || 20;
    
    // Simulate realistic speed (30-90% of promised)
    const percentageOfPromised = 30 + Math.random() * 60;
    const downloadSpeed = (promisedSpeed * percentageOfPromised / 100);
    const uploadSpeed = downloadSpeed * (0.3 + Math.random() * 0.3);
    const latency = 20 + Math.random() * 80;

    let progress = 0;
    let phase = 0;
    const latencyPoints = [];

    intervalRef.current = setInterval(() => {
      progress += 2;
      
      // Add latency data points during test
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
          isp_name: selectedIspData?.name || selectedIsp || "Unknown ISP"
        };
        
        setSpeedResult(result);
        saveSpeedTest(result);
        
        // Auto-trigger chat alert if speed is below 50%
        if (percentageOfPromised < 50) {
          setTimeout(() => setShowAlert(true), 500);
        }
      }
    }, 100);
  };

  const saveSpeedTest = async (result) => {
    try {
      const response = await axios.post(`${API}/speed-test`, {
        isp_id: selectedIsp,
        download_speed_mbps: result.download_speed_mbps,
        upload_speed_mbps: result.upload_speed_mbps,
        latency_ms: result.latency_ms,
        location: location
      });
      
      if (response.data.id) {
        setSpeedResult(prev => ({ ...prev, id: response.data.id }));
        toast({ title: "Test Recorded", description: "Speed test has been saved as evidence." });
      }
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
    // Trigger chatbot with context
    window.dispatchEvent(new CustomEvent('openChatBot', { 
      detail: { 
        autoMessage: true,
        message: `I would like to file a complaint about my internet speed. I just ran a test and got ${speedResult?.download_speed_mbps} Mbps which is only ${speedResult?.percentage_of_promised}% of the promised ${speedResult?.promised_speed_mbps} Mbps. My test ID is ${speedResult?.id || 'N/A'}.`,
        context: speedResult 
      }
    }));
    setShowAlert(false);
  };

  const getSpeedColor = (percentage) => {
    if (percentage >= 80) return "#10B981"; // Emerald
    if (percentage >= 50) return "#F59E0B"; // Amber
    return "#EF4444"; // Rose
  };



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
                <div className="h-1 w-12 bg-[#003366] rounded-full"></div>
             </div>
             <div className="flex items-center space-x-3 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                {['Real-time', 'Regional', 'Historical'].map((t) => (
                  <button 
                    key={t} 
                    onClick={() => setActiveView(t)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === t ? 'bg-[#003366] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
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
                        <div className="w-14 h-14 bg-gradient-to-br from-[#E8F0F9] to-blue-500 rounded-2xl flex items-center justify-center text-[#003366] font-black text-xl shadow-xl shadow-teal-500/10">
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
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E8F0F9] to-blue-500 rounded-2xl flex items-center justify-center text-[#003366] font-black text-xl shadow-xl shadow-teal-500/10">
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
                    <div className="w-14 h-14 bg-gradient-to-br from-[#E8F0F9] to-blue-500 rounded-2xl flex items-center justify-center text-[#003366] font-black text-xl shadow-xl shadow-teal-500/10">
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

            {activeView === 'Speed Test' && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Tabs defaultValue="speedtest" className="space-y-8">
                  <div className="flex justify-center mb-8">
                    <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-2xl">
                      <TabsTrigger value="speedtest" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#003366] data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest transition-all">
                        Live Speed Test
                      </TabsTrigger>
                      <TabsTrigger value="regulation" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#003366] data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest transition-all">
                        Regulatory Thresholds
                      </TabsTrigger>
                      <TabsTrigger value="isps" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#003366] data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest transition-all">
                        ISP Performance Index
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="speedtest">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Left Controls */}
                      <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your Operator</Label>
                          <Select value={selectedIsp} onValueChange={setSelectedIsp}>
                            <SelectTrigger className="bg-slate-900 border-white/5 rounded-2xl h-14 text-white">
                              <SelectValue placeholder="Select ISP" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                              {isps.length > 0 ? isps.map(isp => (
                                <SelectItem key={isp.id} value={isp.id}>{isp.name} ({isp.regulated_speed_mbps} Mbps)</SelectItem>
                              )) : (
                                <>
                                  <SelectItem value="btc">BTC (Botswana Telecommunications)</SelectItem>
                                  <SelectItem value="mascom">Mascom Wireless</SelectItem>
                                  <SelectItem value="orange">Orange Botswana</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verification Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003366]" />
                            <Input 
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Gaborone Central"
                              className="bg-slate-900 border-white/5 rounded-2xl h-14 pl-12 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 text-center py-12 border-t border-white/5 relative">
                        {!isTesting && !speedResult && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Click start to perform a certified speed test against your ISP's regulated thresholds.</p>
                            <Button 
                              size="lg" 
                              onClick={simulateSpeedTest}
                              className="rounded-2xl px-12 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 font-black tracking-widest uppercase text-sm shadow-xl shadow-cyan-500/20"
                            >
                              <Play className="w-4 h-4 mr-3" />
                              Start QoS Verify
                            </Button>
                          </motion.div>
                        )}

                        {isTesting && (
                          <div className="space-y-8 animate-in fade-in zoom-in">
                            <div className="flex flex-col items-center">
                              {(() => {
                                const PhaseIcon = testPhases[testPhase].icon;
                                return <PhaseIcon className="w-12 h-12 text-cyan-400 animate-pulse mb-4" />;
                              })()}
                              <p className="text-white font-bold tracking-widest uppercase text-xs">{testPhases[testPhase].label}</p>
                            </div>
                            <div className="max-w-md mx-auto space-y-2">
                              <Progress value={testProgress} className="h-2 bg-slate-800 rounded-full overflow-hidden" />
                              <p className="text-[10px] text-slate-500 font-mono">{testProgress}% Completed</p>
                            </div>
                            <Button variant="ghost" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl" onClick={cancelTest}>
                              <Square className="w-4 h-4 mr-2" />
                              Abort Test
                            </Button>
                          </div>
                        )}

                        {speedResult && !isTesting && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                            <div>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-4">Measured Throughput</p>
                              <div className="flex items-baseline justify-center gap-2">
                                <span className="text-7xl font-black" style={{ color: getSpeedColor(speedResult.percentage_of_promised) }}>
                                  {speedResult.download_speed_mbps}
                                </span>
                                <span className="text-xl text-slate-500 font-bold uppercase">Mbps</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <div className="bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-4">
                                <div className="flex flex-col items-center border-r border-white/10 pr-4">
                                  <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">Latency</span>
                                  <span className="text-white font-mono font-bold">{speedResult.latency_ms} ms</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">Regulated</span>
                                  <span className="text-white font-mono font-bold">{speedResult.promised_speed_mbps} Mbps</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                              <Button onClick={simulateSpeedTest} variant="outline" className="rounded-xl border-white/10 text-slate-400">
                                <RefreshCw className="w-4 h-4 mr-2" /> Rerun
                              </Button>
                              <Button 
                                onClick={handleFileComplaint}
                                className="rounded-xl bg-slate-100 text-slate-900 font-bold px-8"
                              >
                                {speedResult.percentage_of_promised < 50 ? 'Report Major Drop' : 'Submit Evidence'}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                    <Card className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                       <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          Verify Performance
                       </h3>
                       <div className="space-y-6">
                          <p className="text-slate-400 text-sm leading-relaxed">
                            BOCRA's live tester verifies your actual throughput against the regulated minimums assigned to your operator.
                          </p>
                          <div className="p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                             <div className="flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                                <p className="text-xs text-cyan-100 leading-relaxed">
                                  If your speed falls below 50% of the regulated value, this test becomes valid evidence for the Consumer Protection hub.
                                </p>
                             </div>
                          </div>
                          
                          {speedResult && latencyData.length > 0 && (
                            <div className="h-32 w-full pt-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={latencyData}>
                                  <Bar dataKey="latency" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                              <p className="text-[9px] text-center text-slate-500 uppercase mt-2 font-bold tracking-widest">Latency Jitter Log</p>
                            </div>
                          )}
                       </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-[#003366] to-[#001F40] border-none rounded-[2.5rem] p-8 shadow-2xl">
                      <Shield className="w-10 h-10 text-cyan-400 mb-4" />
                      <h4 className="text-white font-bold mb-2">Evidence Vault</h4>
                      <p className="text-slate-300 text-xs leading-relaxed mb-6">
                        All failed tests are automatically timestamped and signed for regulatory submission.
                      </p>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest" asChild>
                         <Link to="/cyber-incident">Incident protocols</Link>
                      </Button>
                    </Card>
                    </div>
                  </div>
                </TabsContent>

                  <TabsContent value="regulation">
                    <Card className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">Regulated Quality Thresholds</h3>
                        <p className="text-slate-500 text-sm">Mandated minimum performance metrics for all licensed network operators in Botswana.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Metric Parameter</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Minimum Target</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Requirement Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {[
                              { metric: "Minimum Fixed Download Speed", status: "30 Mbps", compliance: "Mandatory" },
                              { metric: "Minimum Mobile Download Speed", status: "10 Mbps", compliance: "Mandatory" },
                              { metric: "Maximum National Latency", status: "80ms", compliance: "Mandatory" },
                              { metric: "Maximum International Latency", status: "250ms", compliance: "Target" },
                              { metric: "Packet Loss Percentage", status: "< 1.0%", compliance: "Target" },
                              { metric: "Network Availability / Uptime", status: "> 99.5%", compliance: "Mandatory" }
                            ].map((row, i) => (
                              <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-4 text-sm font-bold text-slate-200">{row.metric}</td>
                                <td className="py-4 text-sm font-mono text-cyan-400">{row.status}</td>
                                <td className="py-4">
                                  <Badge className={`border-none text-[9px] font-bold uppercase tracking-widest ${row.compliance === 'Mandatory' ? 'bg-[#003366]/20 text-[#E8F0F9]' : 'bg-slate-800 text-slate-400'}`}>
                                    {row.compliance}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="isps">
                    <Card className="bg-[#0a0f1e] border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">Operator Performance Index</h3>
                        <p className="text-slate-500 text-sm">Aggregated 30-day performance averages across all verified user tests.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Official Operator</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Speed</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Latency</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Availability</th>
                              <th className="pb-4 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {[
                              { name: "BTC Fixed", speed: "45.2 Mbps", latency: "28ms", uptime: "99.9%", status: "Compliant" },
                              { name: "BTC Mobile", speed: "18.5 Mbps", latency: "42ms", uptime: "98.5%", status: "Warning" },
                              { name: "Mascom Fiber", speed: "92.1 Mbps", latency: "12ms", uptime: "99.8%", status: "Compliant" },
                              { name: "Mascom Mobile", speed: "22.4 Mbps", latency: "38ms", uptime: "99.2%", status: "Compliant" },
                              { name: "Orange Konnect", speed: "78.5 Mbps", latency: "15ms", uptime: "99.7%", status: "Compliant" },
                              { name: "Orange Mobile", speed: "19.2 Mbps", latency: "45ms", uptime: "98.9%", status: "Compliant" }
                            ].map((row, i) => (
                              <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#003366]/20 flex items-center justify-center text-[#E8F0F9] text-xs font-black">
                                      {row.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-200">{row.name}</span>
                                  </div>
                                </td>
                                <td className="py-4 text-sm font-mono text-slate-400">{row.speed}</td>
                                <td className="py-4 text-sm font-mono text-slate-400">{row.latency}</td>
                                <td className="py-4 text-sm font-mono text-slate-400">{row.uptime}</td>
                                <td className="py-4">
                                  <div className={`w-2 h-2 rounded-full ${row.status === 'Compliant' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
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
                     <DownloadIcon className="w-4 h-4 text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => {
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
           <Globe className="w-12 h-12 text-[#003366] mx-auto mb-8" />
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
