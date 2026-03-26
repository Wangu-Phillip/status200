import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight,
  Wifi, 
  Shield, 
  Radio, 
  Mail, 
  Globe,
  Target,
  Eye,
  Award,
  Users,
  Building,
  CheckCircle
} from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const BOCRA_LOGO = "/logo.png";

const values = [
  { icon: Shield, title: "Integrity", description: "Upholding the highest ethical standards in all our regulatory activities" },
  { icon: Target, title: "Excellence", description: "Striving for the best outcomes in service delivery and regulation" },
  { icon: Users, title: "Inclusivity", description: "Ensuring all Batswana have access to communications services" },
  { icon: Award, title: "Innovation", description: "Embracing new technologies to advance Botswana's digital future" }
];

const milestones = [
  { year: "2013", title: "BOCRA Established", description: "Merger of BTA, NBS, and BTCL regulatory functions" },
  { year: "2016", title: "Digital Migration", description: "Successful transition from analog to digital broadcasting" },
  { year: "2020", title: "5G Framework", description: "Publication of 5G spectrum allocation guidelines" },
  { year: "2024", title: "Consumer Portal", description: "Launch of digital services for citizens and businesses" }
];

const services = [
  { icon: Wifi, title: "Telecommunications", description: "Licensing and regulation of network operators" },
  { icon: Radio, title: "Broadcasting", description: "TV and radio broadcast licensing and compliance" },
  { icon: Mail, title: "Postal Services", description: "Postal and courier service regulation" },
  { icon: Globe, title: "Internet Services", description: "ISP licensing and quality of service monitoring" }
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-white" data-testid="about-page">

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <motion.div 
          className="absolute inset-0 bg-[#0A192F]"
          style={{ y }}
        >
          {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#75B2DD]/10"
                style={{
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{
                  duration: 8 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}
            
            {/* Pulsing Core Dots */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute w-1 h-1 bg-[#75B2DD] rounded-full shadow-[0_0_10px_#75B2DD]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 4, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.5
                }}
              />
            ))}
          </div>
          
          {/* Animated Connecting Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-10" pointerEvents="none">
            <motion.path
              d="M0 100 Q 250 50 500 100 T 1000 100"
              stroke="#75B2DD"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(117,178,221,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(117,178,221,0.05) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          style={{ opacity }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-[#75B2DD]/10 border border-[#75B2DD]/20 rounded-full mb-6"
              >
                <p className="text-[#75B2DD] text-[10px] uppercase tracking-[0.4em] font-bold">
                  Botswana Communications Regulatory Authority
                </p>
              </motion.div>
              
              <motion.h1 
                className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Connecting<br />
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B2DD] via-white to-[#75B2DD] bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  Botswana's
                </motion.span><br />
                Digital Future
              </motion.h1>
              
              <motion.p 
                className="text-slate-400 text-xl leading-relaxed max-w-xl mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Ensuring fair competition, consumer protection, and national 
                connectivity as the independent regulator for the communications sector.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75B2DD] hover:bg-[#5a9ac9] text-[#0A192F] font-bold rounded-sm px-8"
                >
                  <Link to="/services">Explore Services</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/5 rounded-sm px-8"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", damping: 15 }}
              className="relative perspective-1000"
            >
              {/* Floating Tech Icons Decor */}
              {[Wifi, Globe, Radio, Shield].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl z-20 shadow-2xl"
                  style={{
                    left: i === 0 ? '-10%' : i === 1 ? '90%' : i === 2 ? '0%' : '80%',
                    top: i === 0 ? '10%' : i === 1 ? '20%' : i === 2 ? '70%' : '80%',
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                >
                  <Icon className="w-8 h-8 text-[#75B2DD]" />
                </motion.div>
              ))}

              <motion.div
                className="relative z-10"
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glowing Aura behind logo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#75B2DD]/30 to-purple-500/10 blur-[100px] rounded-full" />
                <img 
                  src={BOCRA_LOGO} 
                  alt="BOCRA Logo" 
                  className="relative z-10 w-full max-w-lg mx-auto drop-shadow-[0_20px_50px_rgba(117,178,221,0.2)]"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <MissionCard 
              icon={Eye}
              title="Our Vision"
              content="A digitally connected Botswana where all citizens have access to affordable, quality communications services."
              delay={0}
            />
            <MissionCard 
              icon={Target}
              title="Our Mission"
              content="To regulate the communications sector in a manner that promotes fair competition, protects consumers, and advances national development objectives."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#75B2DD] text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              What We Stand For
            </p>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-[#0A192F]">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-slate-200 rounded-sm shadow-none h-full card-hover group">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-16 h-16 bg-[#0A192F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-2">{value.title}</h3>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services We Regulate */}
      <section id="services-section" className="py-20 bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#75B2DD] text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              Regulatory Scope
            </p>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl">
              Services We Regulate
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="p-6 bg-white/5 rounded-sm border border-white/10 backdrop-blur-sm h-full">
                  <service.icon className="w-10 h-10 text-[#75B2DD] mb-4" />
                  <h3 className="font-heading font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#75B2DD] text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              Our Journey
            </p>
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-[#0A192F]">
              Key Milestones
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="border border-slate-200 rounded-sm shadow-none inline-block">
                      <CardContent className="p-6">
                        <span className="text-[#75B2DD] font-heading font-black text-3xl">{milestone.year}</span>
                        <h3 className="font-heading font-bold text-lg text-[#0A192F] mt-2">{milestone.title}</h3>
                        <p className="text-slate-600 text-sm mt-1">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <motion.div 
                    className="w-4 h-4 bg-[#0A192F] rounded-full relative z-10 hidden md:block"
                    whileInView={{ scale: [0, 1.5, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  />
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-[#0A192F] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Access our services, apply for licenses, or submit tender proposals through our digital portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm"
              >
                <Link to="/login">
                  Access Portal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="rounded-sm"
              >
                <Link to="/analytics">
                  View Analytics
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

function MissionCard({ icon: Icon, title, content, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="border border-slate-200 rounded-sm shadow-none h-full overflow-hidden group">
        <CardContent className="p-8">
          <motion.div 
            className="w-14 h-14 bg-[#0A192F] rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            whileHover={{ rotate: 10 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
          <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-3">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
