import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  FileText,
  Briefcase,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, 
  BarChart, Bar, Cell, Tooltip, Legend,
  PieChart, Pie
} from "recharts";

const API = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000") + "/api";

const COLORS = ['#0A192F', '#75B2DD', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

const licenseTypeNames = {
  telecom: "Telecommunications",
  broadcasting: "Broadcasting",
  postal: "Postal Services",
  type_approval: "Type Approval"
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#0A192F] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const processingData = [
    { name: "Licenses", days: analytics?.processing_times?.license_avg_days || 14, fill: "#0A192F" },
    { name: "Tenders", days: analytics?.processing_times?.tender_avg_days || 21, fill: "#75B2DD" },
    { name: "Complaints", days: analytics?.processing_times?.complaint_avg_days || 7, fill: "#F59E0B" }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="analytics-page">
      {/* Header */}
      <header className="bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 rounded-sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="font-heading font-bold text-lg">Analytics Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#0A192F] text-white pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#75B2DD] text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              BOCRA Insights
            </p>
            <h2 className="font-heading font-bold text-3xl mb-4">
              Application Trends & Processing Times
            </h2>
            <p className="text-slate-300 max-w-2xl">
              Understand typical timelines, approval rates, and application trends to help plan your submissions.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: "Total Applications", 
              value: analytics?.total_applications || 0, 
              icon: FileText, 
              color: "from-blue-500 to-blue-600",
              delay: 0
            },
            { 
              label: "Pending Review", 
              value: analytics?.pending_review || 0, 
              icon: Clock, 
              color: "from-amber-500 to-amber-600",
              delay: 0.1
            },
            { 
              label: "License Approval Rate", 
              value: `${analytics?.approval_rates?.license || 85}%`, 
              icon: CheckCircle, 
              color: "from-green-500 to-green-600",
              delay: 0.2
            },
            { 
              label: "Avg Processing Time", 
              value: `${analytics?.processing_times?.license_avg_days || 14} days`, 
              icon: TrendingUp, 
              color: "from-purple-500 to-purple-600",
              delay: 0.3
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: metric.delay }}
            >
              <Card className="border-0 shadow-lg rounded-sm overflow-hidden">
                <CardContent className={`p-0 bg-gradient-to-br ${metric.color}`}>
                  <div className="p-5 text-white">
                    <metric.icon className="w-8 h-8 mb-3 opacity-80" />
                    <motion.p 
                      className="text-3xl font-heading font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: metric.delay + 0.2 }}
                    >
                      {metric.value}
                    </motion.p>
                    <p className="text-white/80 text-sm mt-1">{metric.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border border-slate-200 rounded-sm shadow-none h-full">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#75B2DD]" />
                  Application Trends (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64" style={{ width: '100%', minHeight: '256px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.monthly_trends || []}>
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0A192F', 
                          border: 'none', 
                          borderRadius: '4px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="licenses" 
                        stroke="#0A192F" 
                        strokeWidth={3}
                        dot={{ fill: '#0A192F', strokeWidth: 2 }}
                        name="Licenses"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tenders" 
                        stroke="#75B2DD" 
                        strokeWidth={3}
                        dot={{ fill: '#75B2DD', strokeWidth: 2 }}
                        name="Tenders"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="complaints" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                        name="Complaints"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Processing Times */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border border-slate-200 rounded-sm shadow-none h-full">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#75B2DD]" />
                  Average Processing Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64" style={{ width: '100%', minHeight: '256px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processingData} layout="vertical">
                      <XAxis type="number" stroke="#94A3B8" fontSize={12} unit=" days" />
                      <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0A192F', 
                          border: 'none', 
                          borderRadius: '4px',
                          color: 'white'
                        }}
                        formatter={(value) => [`${value} days`, 'Processing Time']}
                      />
                      <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                        {processingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-sm">
                  <p className="text-sm text-slate-600">
                    <strong>Note:</strong> Processing times are estimates based on historical data. 
                    Actual times may vary based on application complexity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* License Types Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border border-slate-200 rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-[#75B2DD]" />
                  License Applications by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.license_by_type?.length > 0 ? (
                  <div className="h-48" style={{ width: '100%', minHeight: '192px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.license_by_type.map((item, i) => ({
                            name: licenseTypeNames[item.type] || item.type,
                            value: item.count
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.license_by_type.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400">
                    No data available
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {analytics?.license_by_type?.map((item, index) => (
                    <div key={item.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-600">{licenseTypeNames[item.type] || item.type}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Approval Rates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border border-slate-200 rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#75B2DD]" />
                  Approval & Award Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">License Approval Rate</span>
                      <span className="text-sm font-bold text-green-600">{analytics?.approval_rates?.license || 85}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics?.approval_rates?.license || 85}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">Tender Award Rate</span>
                      <span className="text-sm font-bold text-blue-600">{analytics?.approval_rates?.tender || 15}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics?.approval_rates?.tender || 15}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">License Rejection Rate</span>
                      <span className="text-sm font-bold text-red-600">{analytics?.rejection_rates?.license || 5}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics?.rejection_rates?.license || 5}%` }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="border border-slate-200 rounded-sm shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#75B2DD]" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0A192F] rounded-sm flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">License Applications</p>
                        <p className="font-bold text-[#0A192F]">{analytics?.license_by_status?.reduce((sum, s) => sum + s.count, 0) || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#75B2DD] rounded-sm flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Tender Applications</p>
                        <p className="font-bold text-[#0A192F]">{analytics?.tender_by_status?.reduce((sum, s) => sum + s.count, 0) || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-sm flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">QoS Complaints</p>
                        <p className="font-bold text-[#0A192F]">{analytics?.complaints_by_isp?.reduce((sum, s) => sum + s.count, 0) || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Card className="border-0 shadow-lg rounded-sm overflow-hidden bg-gradient-to-r from-[#0A192F] to-slate-800">
            <CardContent className="p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-2">Ready to Submit?</h3>
                  <p className="text-slate-300">
                    Now that you understand typical timelines, start your application today.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    asChild 
                    className="bg-white text-[#0A192F] hover:bg-slate-100 rounded-sm"
                  >
                    <Link to="/license-application">Apply for License</Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-sm"
                  >
                    <Link to="/tenders">View Tenders</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
