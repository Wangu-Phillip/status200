import React from 'react';
import { Button } from '../components/ui/button';
import { 
  Radio, 
  Tv, 
  Mail, 
  Wifi, 
  ArrowRight, 
  CheckCircle,
  ShieldCheck,
  Globe,
  Zap,
  Activity,
  ArrowUpRight,
  Target,
  Scale,
  Award,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';

const Mandate = () => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const mandates = [
    {
      id: 'telecommunications',
      title: 'Telecommunications',
      icon: Radio,
      accent: '#75B2DD',
      color: 'from-[#0A192F] to-[#25406E]',
      description:
        'BOCRA regulates telecommunications services to ensure competitive, reliable, and affordable access for citizens and businesses across Botswana.',
      responsibilities: [
        'Licensing of telecommunications operators',
        'Spectrum management and allocation',
        'Numbering plan administration',
        'Quality of Service monitoring and enforcement',
        'Consumer protection and dispute resolution',
      ],
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting',
      icon: Tv,
      accent: '#DC2626',
      color: 'from-[#DC2626] to-[#991B1B]',
      description:
        'Managing sound and television broadcasting services in line with public interest, local content standards, and national technical quality.',
      responsibilities: [
        'Broadcasting licence issuance and renewal',
        'Content regulation and standards',
        'Local content quota enforcement',
        'Frequency assignment for broadcasting',
        'Monitoring broadcast quality',
      ],
    },
    {
      id: 'postal',
      title: 'Postal Services',
      icon: Mail,
      accent: '#16A34A',
      color: 'from-[#16A34A] to-[#0D5A2E]',
      description:
        'Overseeing postal and courier services to promote safe, reliable, efficient, and affordable delivery throughout Botswana.',
      responsibilities: [
        'Postal service licensing framework',
        'Universal postal service obligations',
        'Postal service quality standards',
        'Courier and express mail regulation',
        'Consumer complaint handling',
      ],
    },
    {
      id: 'internet',
      title: 'Internet & ICT',
      icon: Wifi,
      accent: '#F59E0B',
      color: 'from-[#F59E0B] to-[#B45309]',
      description:
        'Supporting the digital economy through .bw domain administration, internet service regulation, and nationwide ICT oversight.',
      responsibilities: [
        '.bw country code top-level domain management',
        'Internet Service Provider licensing',
        'Cybersecurity coordination through bw-CIRT',
        'Electronic transactions regulation',
        'Digital infrastructure development',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Background Decals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yBg }} className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[#0A192F]" style={{ maskImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', maskSize: '40px 40px' }} />
        </motion.div>
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-[#75B2DD]/5 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10">
        {/* Immersive Hero Header */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#0A192F]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(117,178,221,0.2),transparent)] pointer-events-none" />
          
          {/* Animated Heritage Dots */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
             {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                />
             ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest mb-8"
            >
              <Target className="w-3 h-3 text-[#75B2DD]" />
              <span>National Regulatory Authority</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
            >
              Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B2DD] via-white to-[#75B2DD] bg-[length:200%_auto] animate-gradient-x">
                MANDATE
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
            >
              BOCRA's primary mission is to ensure safe, reliable, and equitable 
              access to communications services across the Republic of Botswana.
            </motion.p>
          </div>
        </section>

        {/* Sectors Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
          <div className="grid lg:grid-cols-2 gap-8">
            {mandates.map((mandate, idx) => (
              <motion.div
                key={mandate.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white group hover:translate-y-[-10px] transition-all duration-500 border border-slate-100 h-full">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row h-full">
                       {/* Left Panel: Content */}
                       <div className="flex-1 p-10 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-4 mb-8">
                               <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mandate.color} flex items-center justify-center text-white shadow-xl shadow-blue-900/10`}>
                                  <mandate.icon className="w-7 h-7" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#75B2DD]">Sector Focus</p>
                                  <h3 className="text-2xl font-black text-[#0A192F] tracking-tighter">{mandate.title}</h3>
                               </div>
                            </div>
                            
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                               {mandate.description}
                            </p>
                            
                            <div className="space-y-3">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                  <Scale className="w-3 h-3" />
                                  Regulatory Responsibilities
                               </p>
                               {mandate.responsibilities.map((task, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                     <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                                     </div>
                                     <span className="text-xs font-bold text-slate-700">{task}</span>
                                  </div>
                               ))}
                            </div>
                          </div>

                          <div className="mt-10 pt-8 border-t border-slate-50">
                             <Button asChild className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-2xl h-14 font-black text-xs uppercase tracking-widest">
                                <Link to="/documents">Explore Sector Mandate</Link>
                             </Button>
                          </div>
                       </div>
                       
                       {/* Right Panel: Visual Decoder */}
                       <div className={`hidden md:flex w-1/3 bg-gradient-to-br ${mandate.color} items-center justify-center p-8 relative overflow-hidden group-hover:w-[35%] transition-all duration-700`}>
                        <div className="absolute inset-0 opacity-10 basket-pattern text-white mix-blend-overlay"></div>
                          <motion.div 
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10"
                          >
                             <mandate.icon className="w-20 h-20 text-white/20" />
                          </motion.div>
                          <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-white/30 group-hover:text-white" />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision & Compliance Section */}
        <section className="py-24 bg-slate-50 relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <div className="inline-flex items-center space-x-2 bg-[#0A192F] text-[#75B2DD] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                       <Award className="w-3 h-3" />
                       <span>Institutional Integrity</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#0A192F] tracking-tighter leading-tight">
                       Regulatory Governance <br/> and Compliance Hub
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                       BOCRA operates under the Communications Regulatory Authority Act, 2012, 
                       maintaining complete institutional independence while aligning with Botswana’s 
                       national development goals.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {[
                         { icon: ShieldCheck, label: 'Fair Competition', val: 'Market Guard' },
                         { icon: Globe, label: 'Universal Access', val: 'Zero Divide' },
                         { icon: Activity, label: 'Performance', val: 'QoS Standards' },
                         { icon: Layers, label: 'Type Approval', val: 'Equipment Safety' }
                       ].map((stat, i) => (
                          <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                             <stat.icon className="w-5 h-5 text-[#75B2DD] mb-3" />
                             <p className="text-lg font-black text-[#0A192F]">{stat.label}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.val}</p>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="relative">
                    <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-[#0A192F] p-12 text-white aspect-square flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(117,178,221,0.1),transparent)]" />
                        <div className="relative z-10 text-center">
                           <Layers className="w-20 h-20 text-[#75B2DD] mx-auto mb-10 opacity-50" />
                           <h3 className="text-3xl font-black mb-6 tracking-tighter">Legal Framework</h3>
                           <p className="text-slate-400 font-medium mb-12">
                              Access our full repository of legislation, technical requirements, and enforcement guidelines.
                           </p>
                           <Button asChild size="lg" className="bg-[#75B2DD] hover:bg-white text-[#0A192F] hover:text-[#0A192F] font-black rounded-full px-12 h-16 transition-all duration-500">
                             <Link to="/documents">View Resources Library</Link>
                           </Button>
                        </div>
                    </Card>
                 </div>
              </div>
           </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 px-4 bg-white">
           <div className="max-w-4xl mx-auto text-center border-t border-slate-100 pt-24">
              <Zap className="w-12 h-12 text-[#0A192F]/5 mx-auto mb-10" />
              <h2 className="text-4xl font-black text-[#0A192F] mb-6 tracking-tighter">Ready to interact with BOCRA?</h2>
              <p className="text-slate-500 font-medium mb-12 text-lg">
                 Whether you're a service provider seeking a license or a citizen with a complaint, 
                 our digital portal ensures your voice is heard and your needs are met efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#0A192F] hover:bg-slate-800 text-white font-black rounded-full px-12 h-16 shadow-2xl">
                   <Link to="/login">Access Digital Portal</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-12 h-16 font-black border-[#0A192F] text-[#0A192F]">
                   <Link to="/contact">Contact Regulatory Team</Link>
                </Button>
              </div>
           </div>
        </section>
      </main>

      {/* Global Animations CSS */}
      <style>{`
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 5s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Mandate;