import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  Radio, 
  Mail, 
  Globe,
  Monitor,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  BarChart,
  UserCheck
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const serviceCategories = [
  {
    title: "Licensing & Authorization",
    description: "Apply for and manage communication licenses across all sectors in Botswana.",
    color: "from-[#0A192F] to-[#25406E]",
    accent: "#75B2DD",
    items: [
      { id: "telecom", title: "Telecommunications", icon: Wifi, link: "/license-application" },
      { id: "broadcast", title: "Broadcasting", icon: Radio, link: "/license-application" },
      { id: "postal", title: "Postal Services", icon: Mail, link: "/license-application" },
      { id: "type", title: "Type Approval", icon: CheckCircle2, link: "/type-approval" }
    ]
  },
  {
    title: "Monitoring & Quality",
    description: "Stay informed about the quality of communication services across the nation.",
    color: "from-[#16A34A] to-[#0D5A2E]",
    accent: "#16A34A",
    items: [
      { id: "qos", title: "QoS Reporting", icon: BarChart, link: "/qos-reporting" },
      { id: "live", title: "Live QoS Monitor", icon: Monitor, link: "/live-qos" },
      { id: "analytics", title: "BOCRA Analytics", icon: Database, link: "/analytics" }
    ]
  },
  {
    title: "Consumer Support",
    description: "Voice your concerns and report digital incidents or quality issues.",
    color: "from-[#F59E0B] to-[#B45309]",
    accent: "#F59E0B",
    items: [
      { id: "complaints", title: "File Complaint", icon: UserCheck, link: "/complaints" },
      { id: "incident", title: "Cyber Incidents", icon: ShieldAlert, link: "/cyber-incident" },
      { id: "search", title: "Find Help", icon: Search, link: "/contact" }
    ]
  },
  {
    title: "Registry Services",
    description: "Manage national digital assets and domain names for Botswana.",
    color: "from-[#DC2626] to-[#991B1B]",
    accent: "#DC2626",
    items: [
      { id: "domain", title: ".BW Domain Registry", icon: Globe, link: "/domain-registry" }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100
    }
  }
};

export default function ServicesPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 opacity-10"
        >
          {/* Animated signal dots */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#75B2DD] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </motion.div>
        
        {/* Color Blooms */}
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#75B2DD]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
        {/* Branding & Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-3 mb-8"
          >
            {/* BOCRA Logo Dots Representation */}
            {['#DC2626', '#16A34A', '#F59E0B', '#75B2DD'].map((color, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ backgroundColor: color }}
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1], 
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [`0 0 0px ${color}`, `0 0 15px ${color}`, `0 0 0px ${color}`]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
          
          <motion.p 
            className="text-[#0A192F] font-black tracking-[0.5em] uppercase text-[10px] mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Empowering Communications for all Batswana
          </motion.p>
          
          <motion.h1 
            className="font-heading font-black text-6xl lg:text-9xl text-[#0A192F] mb-8 tracking-tighter leading-[0.9]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            BOCRA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B2DD] via-[#0A192F] to-[#75B2DD] bg-[length:200%_auto] animate-gradient-x">
              SERVICES
            </span>
          </motion.h1>
          
          <motion.div 
            className="w-32 h-2 bg-[#75B2DD] mx-auto rounded-full mb-10"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          <motion.p 
            className="text-slate-500 text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Streamlined access to all BOCRA regulatory services. <br />
            Select a category to begin your application.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div 
          className="grid gap-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {serviceCategories.map((category, catIndex) => (
            <div key={category.title} className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
                <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${category.color} shadow-2xl flex items-center justify-center`}>
                  <h2 className="font-heading font-black text-2xl text-white">
                    {catIndex + 1}
                  </h2>
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="font-heading font-black text-5xl text-[#0A192F] mb-3 tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-slate-400 font-bold max-w-xl text-lg">
                    {category.description}
                  </p>
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent hidden lg:block" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -20, scale: 1.05 }}
                    className="group"
                  >
                    <Link to={item.link}>
                      <Card className="border-0 shadow-[0_20px_60px_rgba(10,25,47,0.1)] rounded-[40px] h-full overflow-hidden bg-white/40 backdrop-blur-3xl group-hover:bg-white transition-all duration-700 border border-slate-100/50">
                        <CardContent className="p-12 flex flex-col items-center text-center h-full">
                          <motion.div 
                            className={`w-24 h-24 rounded-[32px] bg-gradient-to-br ${category.color} flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:rotate-[15deg] group-hover:shadow-[0_30px_50px_rgba(0,0,0,0.2)] transition-all duration-700`}
                          >
                            <item.icon className="w-12 h-12 text-white" />
                          </motion.div>
                          
                          <h3 className="font-heading font-black text-2xl text-[#0A192F] mb-6 group-hover:text-[#75B2DD] transition-colors leading-tight">
                            {item.title}
                          </h3>
                          
                          <div className="mt-auto flex items-center gap-3 text-[#75B2DD] font-black text-sm uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                            Apply Service
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Dynamic Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 p-20 bg-[#0A192F] rounded-[80px] text-center text-white relative overflow-hidden group shadow-[0_50px_100px_rgba(10,25,47,0.4)]"
        >
          {/* Parallax Background Circles */}
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-white/5 rounded-full blur-[100px]"
              style={{
                width: 400 + i * 150,
                height: 400 + i * 150,
                top: i % 2 === 0 ? '-30%' : '60%',
                right: i % 2 === 0 ? '-15%' : '75%',
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 60, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 15 + i * 5, repeat: Infinity }}
            />
          ))}
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              className="w-24 h-24 bg-[#75B2DD] rounded-[30px] mx-auto mb-12 flex items-center justify-center shadow-[0_0_60px_rgba(117,178,221,0.5)] group-hover:rotate-12 transition-transform duration-700"
            >
              <Search className="w-12 h-12 text-[#0A192F]" />
            </motion.div>
            
            <h3 className="font-heading font-black text-5xl lg:text-6xl mb-8 tracking-tighter">Need specific assistance?</h3>
            <p className="text-slate-300 mb-16 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
              If your requirement isn't listed, or you need expert guidance through 
              the regulatory process, our dedicated support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button asChild size="lg" className="bg-[#75B2DD] hover:bg-white text-[#0A192F] font-black rounded-full px-16 h-20 transition-all duration-500 shadow-3xl text-lg">
                <Link to="/contact">Speak to an Advisor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-full px-16 h-20 backdrop-blur-xl text-lg">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-20 text-center opacity-50">
        <p className="text-slate-900 font-black tracking-[0.5em] text-[10px] uppercase">
          © {new Date().getFullYear()} Botswana Communications Regulatory Authority
        </p>
      </footer>
    </div>
  );
}
