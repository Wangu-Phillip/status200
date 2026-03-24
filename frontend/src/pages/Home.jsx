import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon, Radio, Tv, Mail, Wifi, FileText, AlertCircle, 
  ArrowRight, Download, ShieldCheck, Zap, 
  BarChart3, LifeBuoy, Globe, MessageSquare, Briefcase
} from 'lucide-react';
import { newsItems, documents } from '../mockData';

const Home = () => {
  const mandates = [
    {
      title: 'TELECOMMUNICATIONS',
      icon: Radio,
      description: 'Regulating cellular networks and infrastructure for a connected Botswana.',
      color: 'text-[#00897B]',
      bg: 'bg-[#4DB6AC]/10',
    },
    {
      title: 'BROADCASTING',
      icon: Tv,
      description: 'Managing commercial radio and television broadcasting services.',
      color: 'text-[#1565C0]',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'POSTAL',
      icon: Mail,
      description: 'Ensuring safe, reliable, and affordable postal delivery services.',
      color: 'text-[#00695C]',
      bg: 'bg-[#00695C]/10',
    },
    {
      title: 'INTERNET',
      icon: Wifi,
      description: 'Management of .bw registry and ICT infrastructure regulation.',
      color: 'text-[#F9A825]',
      bg: 'bg-amber-500/10',
    },
  ];

  const quickLinks = [
    { title: 'Apply for License', description: 'Telecom & Broadcasting', icon: Zap, path: '/license-application' },
    { title: 'Report a Complaint', description: 'Consumer Protection', icon: ShieldCheck, path: '/complaints' },
    { title: 'Type Approval', description: 'Equipment Certification', icon: Globe, path: '/type-approval' },
    { title: 'Live Monitoring', description: 'Real-time QoS Data', icon: BarChart3, path: '/live-qos' },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Global Heritage Background Pattern */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden opacity-40">
        <img 
          src="/botswana_heritage.png" 
          alt="Botswana Heritage" 
          className="w-full h-full object-cover object-center scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80"></div>
      </div>
        
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[120%] bg-gradient-to-br from-[#00695C]/5 via-[#00897B]/5 to-transparent -skew-y-6 origin-top-left -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div className="space-y-8">
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6 animate-fade-in border border-teal-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>Official Staff & Citizen Portal</span>
              </span>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
                Modernizing Botswana's <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00695C] to-[#4DB6AC]">
                  Digital Frontier
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Experience the next generation of regulatory services. Seamless, transparent, and 
                citizen-centric solutions for a connected Botswana.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button className="h-14 px-8 rounded-2xl bg-[#00897B] hover:bg-[#4DB6AC] text-white text-lg font-semibold shadow-xl shadow-teal-500/20 group transition-all duration-300">
                    Access Portal
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/tenders">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-teal-100 bg-white/50 backdrop-blur-sm text-slate-700 text-lg font-semibold hover:bg-teal-50 transition-all duration-300">
                    <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
                    Tenders Hub
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Illustration/Quick Links */}
            <div className="relative lg:block hidden animate-in fade-in zoom-in duration-1000">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl opacity-50"></div>
              <div className="relative glass border-slate-200 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="heritage-overlay basket-pattern text-slate-900"></div>
                <div className="relative grid grid-cols-2 gap-6">
                  {quickLinks.map((link, i) => (
                    <Link key={link.title} to={link.path}>
                      <div className="group p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-teal-200 cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                          <link.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{link.title}</h3>
                        <p className="text-sm text-slate-500">{link.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notion-style Core Services Section */}
      <section className="py-24 border-y border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Regulatory Domains</h2>
              <p className="text-lg text-slate-600">
                We manage and oversee critical communication sectors to ensure global standards and locally relevant services.
              </p>
            </div>
            <Link to="/services">
              <Button variant="link" className="text-teal-600 font-semibold p-0 h-auto text-lg underline-offset-4 decoration-2">
                Explore all services →
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mandates.map((mandate) => (
              <div key={mandate.title} className="stripe-card p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm group relative overflow-hidden">
                <div className="heritage-overlay basket-pattern text-slate-900 opacity-[0.02]"></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl ${mandate.bg} flex items-center justify-center ${mandate.color} mb-6`}>
                    <mandate.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{mandate.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{mandate.description}</p>
                  <div className="inline-flex items-center text-sm font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                    Learn more <ArrowRight className="ml-1.5 w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency & Data Section - BEREC Inspired */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="glass border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="heritage-overlay basket-pattern text-teal-900 opacity-[0.05]"></div>
                <div className="relative">
                  <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-slate-400 text-sm font-mono tracking-wider uppercase">Live Network Pulse</span>
                  </div>
                  <div className="p-8 space-y-6 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">National Thru-put</span>
                      <span className="text-teal-600 font-bold">124.5 GB/s</span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[72%] rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">99.9%</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Uptime Avg</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">42ms</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Avg Latency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Transparency Matters</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                As a regulatory body, we believe in open data. We provide real-time insights into the performance and quality of service (QoS) across all operators in Botswana.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time network quality tracking',
                  'Operator compliance scorecards',
                  'Public safety and spectrum alerts',
                  'Market performance annual reports'
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/live-qos">
                  <Button size="lg" className="rounded-xl px-8 bg-slate-900 hover:bg-slate-800">
                    Explore Transparency Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern News & Resources */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-bold text-slate-900">News & Insights</h2>
            <Link to="/media">
              <Button variant="outline" className="rounded-xl px-6">View Archive</Button>
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {newsItems.slice(0, 3).map((news) => (
              <div key={news.id} className="group cursor-pointer">
                <div className="aspect-[16/10] bg-slate-200 rounded-[2rem] mb-6 overflow-hidden relative">
                  <img 
                    src={news.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm font-semibold text-teal-600">
                    <span>{news.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{news.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-2">
                    {news.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The static chatbot assistant is removed in favor of the site-wide Chatbot component in App.js */}
    </div>
  );
};

export default Home;

