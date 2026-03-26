import React, { useMemo, useState } from 'react';
import { documents } from '../mockData';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  ShieldCheck,
  Scale,
  ClipboardList,
  ArrowRight,
  Filter,
  Layers,
  Archive,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const categories = useMemo(() => {
    const unique = [...new Set(documents.map((doc) => doc.category))];
    return ['All', ...unique];
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        activeCategory === 'All' || doc.category === activeCategory;

      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const getCategoryStyles = (category) => {
    const styles = {
      Legislation: {
        color: 'from-[#0A192F] to-[#25406E]',
        accent: '#75B2DD',
        icon: Scale,
        label: 'Legal'
      },
      Framework: {
        color: 'from-[#16A34A] to-[#0D5A2E]',
        accent: '#16A34A',
        icon: Layers,
        label: 'Sector'
      },
      Guidelines: {
        color: 'from-[#F59E0B] to-[#B45309]',
        accent: '#F59E0B',
        icon: ShieldCheck,
        label: 'Technical'
      },
    };

    return styles[category] || {
      color: 'from-slate-700 to-slate-900',
      accent: '#94A3B8',
      icon: FileText,
      label: 'Other'
    };
  };

  const stats = [
    { label: 'Total Resources', value: documents.length, icon: Archive, delay: 0 },
    { label: 'Legislation', value: documents.filter(d => d.category === 'Legislation').length, icon: Scale, delay: 0.1 },
    { label: 'Frameworks', value: documents.filter(d => d.category === 'Framework').length, icon: Layers, delay: 0.2 },
    { label: 'Technical Guidelines', value: documents.filter(d => d.category === 'Guidelines').length, icon: ShieldCheck, delay: 0.3 },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[#0A192F]" style={{ maskImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', maskSize: '40px 40px' }} />
        </motion.div>
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[#75B2DD]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10">
        {/* Modern Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center lg:justify-start gap-2 mb-8"
              >
                {['#DC2626', '#16A34A', '#F59E0B', '#75B2DD'].map((color, i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[#0A192F] font-black tracking-[0.4em] uppercase text-[10px] mb-4"
              >
                Knowledge Repository
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading font-black text-5xl lg:text-8xl text-[#0A192F] mb-8 tracking-tighter leading-[0.85]"
              >
                Resource <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B2DD] via-[#0A192F] to-[#75B2DD] animate-gradient-x bg-[length:200%_auto]">
                  LIBRARY
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-xl"
              >
                Centralized access to Botswana's communications legislation, 
                regulatory frameworks, and technical guidelines.
              </motion.p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-[480px]">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                >
                  <Card className="border-0 shadow-[0_10px_30px_rgba(10,25,47,0.04)] rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/50 hover:bg-white transition-all duration-500 overflow-hidden group">
                    <CardContent className="p-8">
                       <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#0A192F]/5 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-white transition-all duration-500">
                             <stat.icon className="w-5 h-5" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#75B2DD] transition-colors" />
                       </div>
                       <p className="text-3xl font-black text-[#0A192F] tracking-tighter mb-1">{stat.value}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Global Filter */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
           <div className="bg-[#0A192F] rounded-[2.5rem] p-4 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-center gap-4 border border-white/10">
              <div className="relative w-full flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-hover:text-[#75B2DD]" />
                 <Input 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search regulatory documents..."
                   className="bg-slate-900/50 border-0 h-16 rounded-[1.5rem] pl-16 text-white text-lg placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-[#75B2DD]/50"
                 />
              </div>
              
              <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                 {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`h-16 px-8 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeCategory === cat 
                        ? 'bg-[#75B2DD] text-[#0A192F] shadow-[0_10px_20px_rgba(117,178,221,0.2)]' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                 ))}
              </div>
           </div>
        </section>

        {/* Resources Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[600px]">
           <AnimatePresence mode="popLayout">
              {filteredDocuments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center pt-20"
                >
                   <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                      <Search className="w-10 h-10 text-slate-300" />
                   </div>
                   <h2 className="text-3xl font-black text-[#0A192F] mb-4 tracking-tighter">No items found</h2>
                   <p className="text-slate-500 font-medium">Try refining your search terms or category selection.</p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredDocuments.map((doc, i) => {
                      const styles = getCategoryStyles(doc.category);
                      return (
                        <motion.div
                          key={doc.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: (i % 9) * 0.05 }}
                        >
                          <Card className="border-0 shadow-[0_15px_45px_rgba(10,25,47,0.04)] rounded-[2.5rem] h-full transition-all duration-500 bg-white/60 backdrop-blur-xl border border-white/40 hover:bg-white hover:translate-y-[-8px] group overflow-hidden">
                             <div className="p-8 pb-4 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${styles.color} flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
                                      <styles.icon className="w-7 h-7" />
                                   </div>
                                   <Badge className="bg-slate-100 text-[#0A192F] border-0 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                                      {styles.label}
                                   </Badge>
                                </div>
                                
                                <h3 className="font-heading font-black text-xl text-[#0A192F] mb-4 leading-[1.2] tracking-tight group-hover:text-[#75B2DD] transition-colors">
                                   {doc.title}
                                </h3>
                                
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 opacity-70">
                                   Official {doc.category.toLowerCase()} resource provided by BOCRA for regulatory compliance and public information within the communication sector.
                                </p>

                                <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
                                   <a 
                                     href={doc.downloadUrl} 
                                     className="flex-1"
                                   >
                                      <Button className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-950/10">
                                         <Download className="w-4 h-4 mr-2" />
                                         Download PDF
                                      </Button>
                                   </a>
                                   <Button variant="ghost" className="w-14 h-14 rounded-2xl bg-slate-50 text-[#0A192F] hover:bg-[#75B2DD]/10 hover:text-[#75B2DD]">
                                      <ArrowRight className="w-5 h-5" />
                                   </Button>
                                </div>
                             </div>
                          </Card>
                        </motion.div>
                      );
                   })}
                </div>
              )}
           </AnimatePresence>
        </section>

        {/* Global Archive Indicator */}
        <section className="py-32 px-4">
           <div className="max-w-3xl mx-auto text-center">
              <BookOpen className="w-12 h-12 text-[#0A192F]/5 mx-auto mb-10" />
              <h2 className="text-3xl font-black text-[#0A192F] mb-6 tracking-tighter leading-tight">Can't find what you're looking for?</h2>
              <p className="text-slate-500 font-medium mb-12 text-lg">
                 Our technical support team can assist you with specific documentation requests or 
                 clarify regulatory requirements for your application.
              </p>
              <Button asChild size="lg" className="bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] font-black rounded-full px-12 h-16 transition-all duration-500 shadow-2xl border-2 border-transparent hover:border-[#0A192F]">
                <Link to="/contact">Contact Support Hub</Link>
              </Button>
           </div>
        </section>
      </main>

      {/* Global CSS for the library */}
      <style>{`
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 5s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Documents;