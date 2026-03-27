import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
  Search,
  BookOpen,
  Globe,
  Star
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const BOCRA_LOGO = "/logo.png";
const CAREERS_HERO = "/careers_hero_visual.png";

const benefits = [
  {
    icon: Award,
    title: "Professional Growth",
    description: "Ongoing development programs and certifications in cutting-edge communications technologies."
  },
  {
    icon: Users,
    title: "Inclusive Culture",
    description: "A diverse and supportive workplace that values collaborative innovation and integrity."
  },
  {
    icon: Zap,
    title: "Impactful Work",
    description: "Shape the digital landscape of Botswana and drive meaningful change for all citizens."
  },
  {
    icon: HeartPulse,
    title: "Wellness & Balance",
    description: "Comprehensive health benefits and flexible work-life balance initiatives."
  }
];

// Fallback for missing icon
function HeartPulse(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

const openPositions = [
  {
    id: "J-001",
    title: "Head of Spectrum Management",
    department: "Engineering & Technology",
    location: "Gaborone, Botswana",
    type: "Full-time",
    experience: "10+ Years",
    description: "Lead our spectrum allocation strategy and national monitoring digital migration."
  },
  {
    id: "J-002",
    title: "Cybersecurity Analyst",
    department: "Compliance",
    location: "National Deployment",
    type: "Full-time",
    experience: "3-5 Years",
    description: "Monitor and respond to national cyber incidents while strengthening our regulatory frameworks."
  },
  {
    id: "J-003",
    title: "Consumer Affairs Officer",
    department: "Consumer Protection",
    location: "Francistown Office",
    type: "Contract",
    experience: "2+ Years",
    description: "Represent citizen interests and resolve communications disputes with regional operators."
  },
  {
    id: "J-004",
    title: "Data Analytics Specialist",
    department: "Strategy & QoS",
    location: "Gaborone, Botswana",
    type: "Full-time",
    experience: "5+ Years",
    description: "Utilize big data from our QoS monitoring network to drive evidence-based policy making."
  }
];

export default function CareersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const filteredJobs = openPositions.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0A192F]">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img src={CAREERS_HERO} alt="BOCRA Office" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75B2DD]/10 border border-[#75B2DD]/20 mb-6"
            >
              <Briefcase className="w-4 h-4 text-[#75B2DD]" />
              <span className="text-[#75B2DD] text-[10px] uppercase font-bold tracking-[0.2em]">Join the Core of Excellence</span>
            </motion.div>

            <motion.h1 
              className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Build the Future of <br />
              <span className="text-[#75B2DD]">Connectivity</span> in Botswana
            </motion.h1>

            <motion.p 
              className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              BOCRA is more than a regulator—we are the architects of Botswana's digital landscape. 
              Join a team of visionaries dedicated to connecting every citizen and business to a world of possibilities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="bg-[#75B2DD] hover:bg-[#5a9ac9] text-[#0A192F] font-bold rounded-sm px-10 shadow-xl shadow-[#75B2DD]/20"
                onClick={() => document.getElementById('positions').scrollIntoView({ behavior: 'smooth' })}
              >
                View Open Roles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 overflow-hidden pointer-events-none hidden lg:block">
           <div className="absolute top-1/4 -right-12 w-64 h-64 bg-[#75B2DD]/10 blur-[120px] rounded-full" />
           <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Stats/Metrics Bar */}
      <section className="relative z-20 -mt-12 mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden shadow-2xl">
            <StatBox number="450+" label="Team Members" />
            <StatBox number="12+" label="Departments" />
            <StatBox number="2.6M" label="Lives Impacted" />
            <StatBox number="Top 5" label="Regulator Ranking" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#75B2DD] text-xs uppercase tracking-[0.3em] font-bold mb-4"
            >
              Why Choose BOCRA?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading font-black text-4xl lg:text-5xl text-[#0A192F]"
            >
              Invest in Your Future,<br />Impact the Nation's
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="relative aspect-square max-w-md mx-auto"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#75B2DD] to-purple-500 rounded-3xl rotate-6 blur-3xl opacity-20" />
                   <div className="relative z-10 w-full h-full bg-[#0A192F] rounded-3xl border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 opacity-10" style={{
                         backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                         backgroundSize: '32px 32px'
                      }} />
                      <Users className="w-32 h-32 text-[#75B2DD] opacity-20 absolute top-10 right-10" />
                      <Star className="w-16 h-16 text-yellow-400 opacity-30 absolute bottom-20 left-10 animate-pulse" />
                      <div className="text-center">
                         <h3 className="font-heading font-black text-3xl text-white mb-6">Innovative Spirit</h3>
                         <p className="text-slate-400 mb-8 italic">"At BOCRA, we don't just follow standards—we set them. Our culture is built on curiosity and the courage to lead."</p>
                         <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#75B2DD]/20 border border-[#75B2DD]/30" />
                            <div className="text-left">
                               <p className="text-white text-sm font-bold">Thabo Mokgosi</p>
                               <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Team Lead, Engineering</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             </div>

             <div>
                <motion.h2
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="font-heading font-black text-4xl text-[#0A192F] mb-8"
                >
                  A Workplace Designed for <span className="text-[#75B2DD]">Ambition</span>
                </motion.h2>
                <div className="space-y-6">
                   <CultureItem 
                      title="Excellence as Standard" 
                      text="We reward performance and dedication to our regulatory mandate." 
                   />
                   <CultureItem 
                      title="Technology First" 
                      text="Access to the latest monitoring, simulation, and communication tools." 
                   />
                   <CultureItem 
                      title="National Pride" 
                      text="Every project contributes directly to Botswana's economic diversification." 
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
           backgroundImage: 'linear-gradient(rgba(117,178,221,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(117,178,221,0.2) 1px, transparent 1px)',
           backgroundSize: '100px 100px'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
               <p className="text-[#75B2DD] text-xs uppercase tracking-[0.3em] font-bold mb-4">Opportunities</p>
               <h2 className="font-heading font-black text-4xl lg:text-5xl">Our Open Roles</h2>
            </div>
            
            <div className="relative w-full max-w-sm">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Search by title or department..." 
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-[#75B2DD] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>

          <div className="grid gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <JobCard key={job.id} {...job} index={index} />
              ))
            ) : (
              <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
                 <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                 <p className="text-slate-400 text-lg">No roles found matching "{searchTerm}"</p>
                 <Button 
                    variant="link" 
                    className="text-[#75B2DD]"
                    onClick={() => setSearchTerm("")}
                 >
                    Clear Search
                 </Button>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
             <p className="text-slate-400 mb-6">Don't see a role that fits? We're always looking for talent.</p>
             <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/5 rounded-sm"
                onClick={() => navigate('/careers/apply/general', { state: { job: { id: 'GENERAL', title: 'General Application', department: 'Unspecified' } } })}
             >
                Submit General Application
             </Button>
          </div>
        </div>
      </section>

      {/* FAQ / Process Section */}
      <section className="py-24 bg-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-black text-3xl text-[#0A192F] text-center mb-16">The Journey to Joining Us</h2>
            <div className="space-y-12">
               <ProcessStep 
                  number="01" 
                  title="Apply Online" 
                  text="Submit your CV and cover letter highlighting your experience and passion for the communications sector."
               />
               <ProcessStep 
                  number="02" 
                  title="Technical Assessment" 
                  text="For engineering and specialized roles, we use simulation-based tests to evaluate core competencies."
               />
               <ProcessStep 
                  number="03" 
                  title="Personal Interview" 
                  text="Meet your future team and learn more about our goals, culture, and specific role expectations."
               />
               <ProcessStep 
                  number="04" 
                  title="Offer & Onboarding" 
                  text="Receive a comprehensive offer package and begin your journey as a BOCRA team member."
               />
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-[#0A192F] to-[#01142F] text-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
            >
               <h2 className="font-heading font-black text-4xl lg:text-5xl mb-8 leading-tight">Ready to Connect<br />Botswana to the World?</h2>
               <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                  Take the first step toward a career that makes a difference. Join a team where excellence is rewarded and innovation is encouraged.
               </p>
               <div className="flex flex-wrap gap-4 justify-center">
                   <Button 
                      size="lg" 
                      className="bg-[#75B2DD] hover:bg-[#5a9ac9] text-[#0A192F] font-bold rounded-sm px-10"
                      onClick={() => navigate('/careers/apply', { state: { job: { id: 'GENERAL', title: 'General Talent Pool', department: 'Unspecified' } } })}
                   >
                      Join Talent Pool
                   </Button>
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-sm px-10">
                     Internal Staff Portal
                  </Button>
               </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
}

function StatBox({ number, label }) {
   return (
      <div className="p-8 text-center bg-[#0A192F]/80 backdrop-blur-md">
         <p className="text-white font-heading font-black text-3xl lg:text-4xl mb-1">{number}</p>
         <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">{label}</p>
      </div>
   );
}

function BenefitCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border border-slate-200 rounded-sm shadow-none h-full hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-[#0A192F] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-4">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CultureItem({ title, text }) {
   return (
      <motion.div 
         className="flex gap-4 items-start"
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
      >
         <div className="mt-1 w-6 h-6 rounded-full bg-[#75B2DD]/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-[#75B2DD]" />
         </div>
         <div>
            <h4 className="text-[#0A192F] font-bold text-lg mb-1">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
         </div>
      </motion.div>
   );
}

function JobCard({ id, title, department, location, type, experience, description, index }) {
   const navigate = useNavigate();
   return (
      <motion.div
         initial={{ opacity: 0, x: -20 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ delay: index * 0.1 }}
      >
         <Card className="bg-white/5 border border-white/10 rounded-sm hover:bg-white/[0.08] transition-all cursor-pointer group">
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                     <Badge className="bg-[#75B2DD]/20 text-[#75B2DD] border-none text-[10px] py-0.5 rounded-sm uppercase tracking-widest">{department}</Badge>
                     <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] py-0.5 rounded-sm uppercase">{type}</Badge>
                  </div>
                  <h3 className="text-white font-heading font-bold text-2xl group-hover:text-[#75B2DD] transition-colors">{title}</h3>
                  <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                     <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-600" />
                        {location}
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        {experience}
                     </div>
                  </div>
                  <p className="text-slate-400 text-sm max-w-2xl line-clamp-2 md:line-clamp-none">{description}</p>
               </div>
               
                <div className="flex-shrink-0 flex items-center justify-end">
                  <Button 
                    className="bg-white/5 hover:bg-[#75B2DD] group-hover:text-[#0A192F] text-white border border-white/10 group-hover:border-[#75B2DD] font-bold rounded-sm px-6"
                    onClick={() => navigate(`/careers/apply/${id}`, { state: { job: { id, title, department, location, type, experience, description } } })}
                  >
                     Apply Now
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </motion.div>
   );
}

function ProcessStep({ number, title, text }) {
   return (
      <div className="flex gap-8 group">
         <div className="flex-shrink-0">
            <span className="font-heading font-black text-4xl text-slate-100 group-hover:text-[#75B2DD] transition-colors">{number}</span>
         </div>
         <div className="space-y-2">
            <h4 className="text-[#0A192F] font-black text-xl flex items-center gap-3">
               {title}
               <div className="w-8 h-px bg-slate-200 group-hover:w-16 transition-all duration-500" />
            </h4>
            <p className="text-slate-500 leading-relaxed font-medium">{text}</p>
         </div>
      </div>
   );
}
