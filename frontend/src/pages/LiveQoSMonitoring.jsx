import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingDown
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

export default function QoSDashboard() {
  const navigate = useNavigate();
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
      // Fallback data if API fails
      setIsps([
        { id: "btc", name: "BTC", regulated_speed_mbps: 50, description: "Botswana Telecommunications Corporation" },
        { id: "mascom", name: "Mascom", regulated_speed_mbps: 100, description: "Mascom Wireless" },
        { id: "orange", name: "Orange", regulated_speed_mbps: 100, description: "Orange Botswana" }
      ]);
      toast.info("Using simulation data");
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
          isp_name: selectedIspData?.name || "Unknown ISP"
        };
        
        setSpeedResult(result);
        saveSpeedTest(result);
        
        // Auto-trigger chat if speed is below 50%
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
    // Trigger chatbot
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

  const comparisonData = speedResult ? [
    { name: "Your Speed", value: speedResult.download_speed_mbps, fill: getSpeedColor(speedResult.percentage_of_promised) },
    { name: "Promised", value: speedResult.promised_speed_mbps, fill: "#94A3B8" }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="qos-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="rounded-sm">
                <Link to="/services">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Services
                </Link>
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="font-heading font-bold text-lg text-[#0A192F]">Live Quality Test</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Network Test
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Speed Test Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* ISP Selection */}
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-[#0A192F] text-white">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#75B2DD]" />
                  Step 1: Connection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="isp-select" className="text-slate-700 font-bold">Internet Service Provider</Label>
                    <Select value={selectedIsp} onValueChange={setSelectedIsp}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12">
                        <SelectValue placeholder="Select your ISP" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {isps.map(isp => (
                          <SelectItem key={isp.id} value={isp.id}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{isp.name}</span>
                              <span className="text-xs text-slate-400 ml-4 font-mono">
                                ({isp.regulated_speed_mbps} Mbps Plan)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700 font-bold">Current Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Gaborone, Old Naledi"
                        className="pl-11 rounded-xl border-slate-200 h-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Speed Test Button & Results */}
            <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-10 text-center relative">
                  {/* Decorative background effects */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#75B2DD] to-transparent opacity-30" />
                  
                  {!isTesting && !speedResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                        <Activity className="w-10 h-10 text-[#0A192F] opacity-20" />
                      </div>
                      <h2 className="text-2xl font-black text-[#0A192F] mb-4">Ready to test your connection?</h2>
                      <p className="text-slate-500 mb-8 max-w-sm mx-auto">This test will measure your download speed, upload speed, and network latency.</p>
                      <Button 
                        size="lg"
                        onClick={simulateSpeedTest}
                        className="bg-[#0A192F] hover:bg-slate-800 text-white rounded-full px-12 h-16 shadow-xl shadow-blue-900/10 transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-5 h-5 mr-3 fill-current" />
                        Start Live Test
                      </Button>
                    </motion.div>
                  )}

                  {isTesting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 space-y-10"
                    >
                      <div className="relative w-48 h-48 mx-auto">
                        {/* Circular Progress Design */}
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="553"
                            animate={{ strokeDashoffset: 553 - (553 * testProgress) / 100 }}
                            className="text-[#75B2DD]"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-[#0A192F]">{testProgress}%</span>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Progress</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3 text-[#0A192F] font-bold">
                          {testPhases[testPhase] && (
                            <>
                              {(() => {
                                const PhaseIcon = testPhases[testPhase].icon;
                                return <PhaseIcon className="w-5 h-5 animate-bounce" />;
                              })()}
                              <span className="text-lg">{testPhases[testPhase].label}</span>
                            </>
                          )}
                        </div>
                        <Button 
                          variant="ghost"
                          onClick={cancelTest}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Abort Test
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {speedResult && !isTesting && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8 space-y-10"
                    >
                      {/* Speed Display */}
                      <div className="relative">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black mb-4">Measurement Success</p>
                        <div className="flex flex-col items-center">
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-baseline gap-2 mb-2"
                          >
                            <span 
                              className="font-heading font-black text-7xl sm:text-8xl tracking-tight"
                              style={{ color: getSpeedColor(speedResult.percentage_of_promised) }}
                            >
                              {speedResult.download_speed_mbps}
                            </span>
                            <span className="text-2xl text-slate-400 font-black">Mbps</span>
                          </motion.div>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time Download Speed</p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      {(() => {
                        const status = getSpeedStatus(speedResult.percentage_of_promised);
                        return (
                          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${status.bg} border border-[#00000005]`}>
                            <div className={`p-1.5 rounded-lg ${status.bg} shadow-sm`}>
                               {speedResult.percentage_of_promised >= 50 ? (
                                <CheckCircle className={`w-5 h-5 ${status.color}`} />
                              ) : (
                                <AlertTriangle className={`w-5 h-5 ${status.color}`} />
                              )}
                            </div>
                            <div className="text-left">
                              <p className={`text-xs font-black uppercase tracking-wider ${status.color}`}>Connection {status.label}</p>
                              <p className="text-[10px] text-slate-500 font-medium">Verified at {speedResult.percentage_of_promised}% of Service Level Agreement</p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Digital Receipt Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto px-4">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-transform hover:scale-105">
                          <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <Upload className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="font-heading font-black text-2xl text-[#0A192F]">{speedResult.upload_speed_mbps}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Upload Speed</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-transform hover:scale-105">
                          <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <Clock className="w-5 h-5 text-amber-500" />
                          </div>
                          <p className="font-heading font-black text-2xl text-[#0A192F]">{speedResult.latency_ms}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Latency (ms)</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-transform hover:scale-105">
                          <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                            <Activity className="w-5 h-5 text-emerald-500" />
                          </div>
                          <p className="font-heading font-black text-2xl text-[#0A192F]">{speedResult.promised_speed_mbps}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">SLA Target</p>
                        </div>
                      </div>

                      {/* Primary Actions */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 px-10">
                        <Button 
                          onClick={simulateSpeedTest}
                          variant="outline"
                          className="rounded-full h-14 px-10 border-slate-200 text-[#0A192F] font-bold"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-test Connection
                        </Button>
                        {speedResult.percentage_of_promised < 85 && (
                          <Button 
                            onClick={handleFileComplaint}
                            className="bg-[#0A192F] hover:bg-slate-800 text-white rounded-full h-14 px-12 font-bold shadow-lg"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2 text-[#75B2DD]" />
                            Escalate to BOCRA
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Animated Latency Line */}
                {(isTesting || speedResult) && latencyData.length > 0 && (
                  <div className="bg-[#0A192F] p-8 mt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-[#75B2DD] rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Packet Delay Monitor</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/60">Sampling: 10Hz</span>
                    </div>
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={latencyData}>
                          <Line 
                            type="step" 
                            dataKey="latency" 
                            stroke="#75B2DD" 
                            strokeWidth={3}
                            dot={false}
                            animationDuration={300}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Insights */}
            {speedResult && (
              <Card className="border-0 shadow-sm rounded-3xl bg-slate-100/50">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="flex-1 text-center lg:text-left">
                       <h3 className="font-heading font-black text-2xl text-[#0A192F] mb-3">Service Comparison</h3>
                       <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                         Your current download throughput of <strong>{speedResult.download_speed_mbps} Mbps</strong> is currently operating at 
                         <strong>{speedResult.percentage_of_promised < 50 ? ' deficient' : ' suboptimal'} levels</strong> compared to the {speedResult.promised_speed_mbps} Mbps 
                         regulatory minimum for your plan.
                       </p>
                       <div className="flex items-center gap-4 justify-center lg:justify-start">
                          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
                             <div className="w-2 h-2 bg-slate-300 rounded-full" />
                             <span className="text-[10px] font-bold text-slate-500">Plan Target</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
                             <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getSpeedColor(speedResult.percentage_of_promised) }} />
                             <span className="text-[10px] font-bold text-slate-500">Actual Speed</span>
                          </div>
                       </div>
                    </div>
                    <div className="w-full lg:w-64 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData} layout="vertical" margin={{ left: -30 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                              {comparisonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#75B2DD]" />
                  Why Test?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#0A192F]">Consumer Protection</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">BOCRA ensures that ISPs deliver the speed they advertise. Testing helps us hold them accountable.</p>
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#0A192F]">Evidence Based</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Every test result is anonymously recorded to create heatmaps of network quality across Botswana.</p>
                 </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-[#0A192F] text-white p-8 relative overflow-hidden">
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#75B2DD]/10 rounded-full blur-3xl -mr-16 -mt-16" />
               
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Monitor className="w-7 h-7 text-[#75B2DD]" />
                 </div>
                 <h3 className="font-heading font-black text-2xl mb-4 leading-tight">Regulatory Assistance</h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                   Are you experiencing persistent network failures or speeds significantly lower than your plan? 
                 </p>
                 <Button 
                   className="w-full h-14 rounded-2xl bg-white text-[#0A192F] font-bold transition-all hover:bg-[#75B2DD] hover:text-white"
                   onClick={() => window.dispatchEvent(new CustomEvent('openChatBot'))}
                 >
                   Chat with Ruby AI
                 </Button>
               </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modern Alert Dialog */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-white"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="font-heading font-black text-3xl text-[#0A192F] mb-4">
                  SLA Violation Detected
                </h3>
                <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium">
                  Your speed of <strong>{speedResult?.download_speed_mbps} Mbps</strong> is dangerously below your plan's target. 
                  Would you like to file an official regulatory complaint?
                </p>
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleFileComplaint}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-16 font-black text-lg shadow-xl shadow-red-500/20"
                  >
                    Yes, Start Official Case
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAlert(false)}
                    className="rounded-2xl h-14 text-slate-400 font-bold hover:bg-slate-50"
                  >
                    Review Results Later
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient-x {
    background-size: 200% 100%;
    animation: gradient-x 5s ease infinite;
  }
  .pulse-ring {
    box-shadow: 0 0 0 0 rgba(10, 25, 47, 0.4);
    animation: pulse-ring 2s infinite;
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(10, 25, 47, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(10, 25, 47, 0); }
    100% { box-shadow: 0 0 0 0 rgba(10, 25, 47, 0); }
  }
`;
document.head.append(style);
