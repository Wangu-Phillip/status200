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
import { newsItems } from '../mockData';

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
        <img
          src="/botswana_heritage.png"
          alt="Botswana Heritage"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F3]/95 via-[#F5F5F3]/88 to-[#F5F5F3]/96"></div>
      </div>

      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-[120%] bg-gradient-to-br from-[#003366]/8 via-[#E8F0F9] to-transparent -skew-y-6 origin-top-left -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#E8F0F9] text-[#003366] text-sm font-semibold border border-[#003366]/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47920] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F47920]"></span>
                </span>
                <span>Official Staff &amp; Citizen Portal</span>
              </span>

              <div>
                <p className="section-kicker mb-3">Botswana Communications Regulatory Authority</p>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.08] hero-title">
                  Connecting Botswana&apos;s <br className="hidden sm:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#003366] to-[#0A4D8C]">
                    Digital Future
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Regulatory services that are seamless, transparent, and citizen-centred —
                built to support trust, innovation, and national digital transformation.
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

            <div className="relative animate-in fade-in zoom-in duration-1000">
              <div className="absolute -top-16 -right-10 w-72 h-72 bg-[#E8F0F9] rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-14 -left-10 w-72 h-72 bg-[#FFF0E6] rounded-full blur-3xl opacity-60"></div>

              <div className="section-shell p-4 sm:p-8 relative overflow-hidden">
                <div className="heritage-overlay basket-pattern text-[#003366] opacity-[0.04]"></div>

                <div className="relative grid grid-cols-2 gap-5">
                  {quickLinks.map((link) => (
                    <Link key={link.title} to={link.path}>
                      <div className={`${link.tone} p-4 sm:p-6 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full`}>
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${link.iconTone} mb-4 shadow-sm`}>
                          <link.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1 leading-snug">{link.title}</h3>
                        <p className="text-sm text-slate-600">{link.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
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
                      Learn More <ArrowRight className="ml-1 w-4 h-4" />
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
                      Learn More <ArrowRight className="ml-1 w-4 h-4" />
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