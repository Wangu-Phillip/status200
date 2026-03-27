import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Globe,
  Briefcase,
  Radio,
  Tv,
  Mail,
  Wifi,
  CheckCircle2
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { newsItems } from '../mockData';

const ConnectivityNodes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
        {/* Connection Lines */}
        <motion.path
          d="M100 100 L400 300 L700 100"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#75B2DD]"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path
          d="M100 500 L400 300 L700 500"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#F47920]"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
        {/* Pinging Particles */}
        <motion.circle
          r="3"
          fill="#F47920"
          animate={{
            offsetDistance: ["0%", "100%"]
          }}
          style={{ offsetPath: "path('M100 100 L400 300 L700 100')" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="3"
          fill="#75B2DD"
          animate={{
            offsetDistance: ["0%", "100%"]
          }}
          style={{ offsetPath: "path('M100 500 L400 300 L700 500')" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </svg>
    </div>
  );
};

const PulsingLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex items-center justify-center p-4 bg-white/40 backdrop-blur-md rounded-full shadow-2xl border border-white/60 mb-8 w-fit mx-auto lg:mx-0"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#75B2DD]/20 rounded-full blur-xl"
      />
      <img src="/logo.png" alt="BOCRA Logo" className="h-16 w-auto relative z-10" />
    </motion.div>
  );
};

const ShutterLogo = () => {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
      {/* Permanent Background Aura */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-x-0 inset-y-0 bg-[#E8F0F9] blur-[100px] rounded-full z-0 h-3/4 my-auto"
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* The Iris Shutter Effect */}
        <motion.div
          animate={{ 
            clipPath: [
              "circle(100% at 50% 50%)", 
              "circle(10% at 50% 50%)", 
              "circle(0% at 50% 50%)",
              "circle(0% at 50% 50%)",
              "circle(100% at 50% 50%)"
            ],
            opacity: [1, 1, 0, 0, 1]
          }}
          transition={{ 
            duration: 4, 
            times: [0, 0.35, 0.45, 0.65, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="relative z-20 w-3/4"
        >
          <img 
            src="/logo.png" 
            alt="BOCRA Logo" 
            className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,51,102,0.15)]"
          />
        </motion.div>

        {/* Connectivity Symbols - Revealed when shutter closes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0, 1, 1, 0],
            scale: [0.8, 0.8, 1, 1, 0.8]
          }}
          transition={{ 
            duration: 4, 
            times: [0, 0.4, 0.45, 0.6, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5
          }}
          className="absolute inset-0 grid grid-cols-2 gap-6 items-center justify-center p-16"
        >
          {[Wifi, Globe, Radio, ShieldCheck].map((Icon, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.1, 1],
                opacity: 1
              }}
              transition={{ 
                delay: 1.8 + (idx * 0.1),
                duration: 0.4
              }}
              className="p-6 bg-white/40 backdrop-blur-xl shadow-lg rounded-3xl border border-white/50 flex items-center justify-center"
            >
              <Icon className="w-10 h-10 text-[#003366]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const TypewriterText = ({ text, delay = 0 }) => {
  const API = "/api";
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-block", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className="inline-flex flex-wrap"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className={letter === " " ? "mr-4" : ""}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Home = () => {
  const mandates = [
    {
      title: 'TELECOMMUNICATIONS',
      icon: Radio,
      description: 'Regulating networks, infrastructure, market access, and service delivery for a connected Botswana.',
      colorClass: 'icon-badge-navy',
    },
    {
      title: 'BROADCASTING',
      icon: Tv,
      description: 'Managing sound and television broadcasting services in line with public interest and national standards.',
      colorClass: 'icon-badge-orange',
    },
    {
      title: 'POSTAL',
      icon: Mail,
      description: 'Promoting safe, reliable, and affordable postal services for citizens, businesses, and institutions.',
      colorClass: 'icon-badge-navy',
    },
    {
      title: 'INTERNET & ICT',
      icon: Wifi,
      description: 'Supporting digital access, domain administration, and ICT regulation for future-ready communication systems.',
      colorClass: 'icon-badge-orange',
    },
  ];

  const quickLinks = [
    {
      title: 'Apply for License',
      description: 'Telecom & broadcasting services',
      icon: Zap,
      path: '/license-application',
      tone: 'soft-panel-tint',
      iconTone: 'icon-badge-navy',
    },
    {
      title: 'Report a Complaint',
      description: 'Consumer protection support',
      icon: ShieldCheck,
      path: '/complaints',
      tone: 'soft-panel',
      iconTone: 'icon-badge-orange',
    },
    {
      title: 'Type Approval',
      description: 'Equipment certification portal',
      icon: Globe,
      path: '/type-approval',
      tone: 'soft-panel-tint',
      iconTone: 'icon-badge-navy',
    },
    {
      title: 'Live Monitoring',
      description: 'Real-time QoS insights',
      icon: BarChart3,
      path: '/live-qos',
      tone: 'soft-panel',
      iconTone: 'icon-badge-orange',
    },
  ];

  const newsCardTone = (category) => {
    const API_URL = '/api';
    const lower = category?.toLowerCase?.() || '';

    if (lower.includes('press')) {
      return {
        cover: 'news-cover-orange',
        line: 'bg-[#F47920]',
        text: 'text-[#F47920]',
      };
    }

    if (lower.includes('media')) {
      return {
        cover: 'news-cover-dark',
        line: 'bg-white',
        text: 'text-white',
      };
    }

    return {
      cover: 'news-cover-navy',
      line: 'bg-[#003366]',
      text: 'text-[#003366]',
    };
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] relative">
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden opacity-15">
        <div className="absolute inset-0 basket-pattern text-[#003366] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F3]/95 via-[#F5F5F3]/88 to-[#F5F5F3]/96"></div>
      </div>

      <section className="relative pt-24 sm:pt-40 pb-16 sm:pb-32 overflow-hidden">
        <ConnectivityNodes />
        <div className="absolute inset-0 subtle-grid opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-[120%] bg-gradient-to-br from-[#E8F0F9]/50 via-white to-transparent -skew-y-6 origin-top-left -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              {/* Removed redundant pulsing logo as requested */}

              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#E8F0F9] text-[#003366] text-xs font-black uppercase tracking-widest border border-[#003366]/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47920] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F47920]"></span>
                </span>
                <span>Official Staff &amp; Citizen Portal</span>
              </span>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
              >
                <p className="section-kicker mb-4 font-black tracking-[0.3em] text-[#003366] opacity-60">
                  NATIONAL REGULATORY GATEWAY
                </p>
                <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-[0.82] hero-title mb-6">
                  <TypewriterText text="Access BOCRA" />
                  <br className="hidden sm:block" />
                  <motion.span 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-[#003366] via-[#F47920] to-[#003366] bg-[length:200%_auto] animate-gradient-x"
                  >
                    Services In Minutes
                  </motion.span>
                </h1>
              </motion.div>

              <p className="text-base sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Apply, report, track, and manage all regulatory services in one secure platform designed for Botswana's citizens and businesses..
                How can we help you today?
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button
                    className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-semibold shadow-xl shadow-[#003366]/20 group w-full sm:w-auto"
                  >
                    Access Portal
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/tenders">
                  <Button
                    variant="outline"
                    className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl border-2 border-[#003366]/15 bg-white/70 backdrop-blur-sm text-slate-700 text-base sm:text-lg font-semibold hover:bg-[#E8F0F9] hover:border-[#003366]/35 w-full sm:w-auto"
                  >
                    <Briefcase className="mr-2 h-5 w-5 text-[#003366]" />
                    Tenders Hub
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  { label: 'Licensing', value: 'Digital applications' },
                  { label: 'Monitoring', value: 'QoS visibility' },
                  { label: 'Consumer Support', value: 'Complaints & resources' },
                ].map((item) => (
                  <div key={item.label} className="soft-panel px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-semibold mb-2">{item.label}</p>
                    <p className="text-sm font-bold text-[#003366]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden lg:block relative h-full min-h-[400px] mt-48 translate-y-8"
            >
              <ShutterLogo />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-shell-soft p-8 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
              <div className="max-w-2xl">
                <p className="section-kicker mb-3">What we regulate</p>
                <h2 className="section-title mb-4">Regulatory Domains</h2>
                <p className="text-lg text-slate-600">
                  We oversee strategic communication sectors to ensure quality, fairness, safety, and long-term national connectivity.
                </p>
              </div>

              <Link to="/mandate">
                <Button variant="link" className="text-[#003366] font-semibold p-0 h-auto text-lg underline-offset-4 decoration-2">
                  Explore all services →
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mandates.map((mandate) => (
                <div
                  key={mandate.title}
                  className="stripe-card soft-panel p-7 group relative overflow-hidden"
                >
                  <div className="heritage-overlay basket-pattern text-[#003366] opacity-[0.025]"></div>
                  <div className="relative">
                    <div className={`w-14 h-14 ${mandate.colorClass} mb-6`}>
                      <mandate.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{mandate.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm mb-4">{mandate.description}</p>
                    <Link to="/mandate" className="inline-flex items-center text-sm font-semibold text-[#003366] hover:text-[#F47920] transition-colors">
                      Explore Sector <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F5F3] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="section-shell overflow-hidden relative">
                <div className="heritage-overlay basket-pattern text-[#003366] opacity-[0.03]"></div>
                <div className="relative">
                  <div className="bg-[#001F40] px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-[#F47920]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#E8F0F9]"></div>
                      <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    </div>
                    <span className="text-white/65 text-sm font-mono tracking-wider uppercase">Live Network Pulse</span>
                  </div>

                  <div className="p-8 space-y-6 bg-[#F8FBFF]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">National Throughput</span>
                      <span className="text-[#003366] font-bold">124.5 GB/s</span>
                    </div>

                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#003366] w-[72%] rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="soft-panel p-4">
                        <div className="text-2xl font-bold text-slate-900">99.9%</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Uptime Avg</div>
                      </div>
                      <div className="soft-panel p-4">
                        <div className="text-2xl font-bold text-slate-900">42ms</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mt-1">Avg Latency</div>
                      </div>
                    </div>

                    <div className="soft-panel-tint p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#003366] font-semibold text-sm">Operator Compliance</span>
                        <span className="text-[#1A6B3C] font-bold text-sm">2/3 Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="section-kicker mb-3">Open data</p>
              <h2 className="section-title mb-6">Transparency Matters</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                As a regulatory authority, BOCRA promotes accountability through open access to quality-of-service insights, compliance information, and market-facing public data.
              </p>

              <div className="grid gap-4">
                {[
                  'Real-time network quality tracking',
                  'Operator compliance scorecards',
                  'Public safety and spectrum alerts',
                  'Market performance annual reports',
                ].map((item, idx) => (
                  <div key={item} className="soft-panel flex items-center gap-3 px-4 py-4">
                    <div className={idx % 2 === 0 ? 'w-9 h-9 icon-badge-navy' : 'w-9 h-9 icon-badge-orange'}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link to="/live-qos">
                  <Button size="lg" className="rounded-xl px-8 text-white">
                    Explore Transparency Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#E8F0F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <p className="section-kicker mb-2">Latest updates</p>
              <h2 className="section-title">News &amp; Insights</h2>
            </div>

            <Link to="/media">
              <Button variant="outline" className="rounded-xl px-6 border-[#003366]/20 text-[#003366] hover:bg-[#E8F0F9]">
                View Archive
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsItems.slice(0, 3).map((news) => {
              const tone = newsCardTone(news.category);

              return (
                <div
                  key={news.id}
                  className="group rounded-2xl overflow-hidden border border-[#d9e6f4] bg-white/95 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className={`aspect-[16/10] ${tone.cover} relative overflow-hidden`}>
                    <div className="absolute inset-0 subtle-grid opacity-20"></div>
                    <div className={`absolute top-0 left-0 h-full w-2 ${tone.line}`}></div>

                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <span className={`inline-flex w-fit rounded-full bg-white/82 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${tone.text}`}>
                        {news.category}
                      </span>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className={`text-xs uppercase tracking-[0.14em] font-semibold mb-2 ${tone.text}`}>
                            BOCRA Update
                          </p>
                          <div className="brand-divider w-16"></div>
                        </div>
                        <div className="w-14 h-14 rounded-full border border-white/40 bg-white/25 backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-sm font-semibold text-[#F47920]">
                      <span>{news.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium">{news.date}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#003366] transition-colors leading-snug">
                      {news.title}
                    </h3>

                    <p className="text-slate-600 line-clamp-2 mb-4">{news.excerpt}</p>
                    <Link to="/media" className="inline-flex items-center text-sm font-semibold text-[#003366] hover:text-[#F47920] transition-colors">
                      Read Full Update <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#001F40] relative overflow-hidden">
        <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-[#F47920] text-sm font-semibold uppercase tracking-[0.1em] mb-4">Get started today</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to access BOCRA services?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Apply for licences, file complaints, access resources, and track applications through a single digital service environment.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="cta" className="rounded-xl font-semibold px-8">
                Access Portal <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 px-8">
                Contact BOCRA
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;