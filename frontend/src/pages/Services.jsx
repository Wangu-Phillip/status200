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
      { id: "telecom", title: "Telecommunications", icon: Wifi, link: "/dashboard" },
      { id: "broadcast", title: "Broadcasting", icon: Radio, link: "/dashboard" },
      { id: "postal", title: "Postal Services", icon: Mail, link: "/dashboard" },
      { id: "type", title: "Type Approval", icon: CheckCircle2, link: "/dashboard" }
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
      { id: "complaints", title: "File Complaint", icon: UserCheck, link: "/dashboard" },
      { id: "incident", title: "Cyber Incidents", icon: ShieldAlert, link: "/dashboard" },
      { id: "search", title: "Find Help", icon: Search, link: "/dashboard" }
    ]
  },
  {
    title: "Registry Services",
    description: "Manage national digital assets and domain names for Botswana.",
    color: "from-[#DC2626] to-[#991B1B]",
    accent: "#DC2626",
    items: [
      { id: "domain", title: ".BW Domain Registry", icon: Globe, link: "/dashboard" }
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
  hidden: { y: 20, opacity: 0, scale: 0.95 },
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
        {/* Branding & Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-2 mb-6"
          >
            {/* BOCRA Logo Dots Representation */}
            {['#DC2626', '#16A34A', '#F59E0B', '#75B2DD'].map((color, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                animate={{ 
                  y: [0, -6, 0],
                  scale: [1, 1.1, 1], 
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
          
          <motion.p 
            className="text-[#0A192F] font-black tracking-[0.4em] uppercase text-[9px] mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Empowering Communications
          </motion.p>
          
          <motion.h1 
            className="font-heading font-black text-4xl lg:text-7xl text-[#0A192F] mb-6 tracking-tighter leading-[0.9]"
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
            className="w-20 h-1 bg-[#75B2DD] mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          <motion.p 
            className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Access our comprehensive range of regulatory services. <br />
            Select a category to get started.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div 
          className="grid gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {serviceCategories.map((category, catIndex) => (
            <div key={category.title} className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-5 mb-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} shadow-lg flex items-center justify-center`}>
                  <h2 className="font-heading font-black text-xl text-white">
                    {catIndex + 1}
                  </h2>
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="font-heading font-black text-3xl text-[#0A192F] mb-1 tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-slate-400 font-bold max-w-lg text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent hidden lg:block" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Link to={item.link}>
                      <Card className="border-0 shadow-[0_15px_40px_rgba(10,25,47,0.05)] rounded-[24px] h-full overflow-hidden bg-white/40 backdrop-blur-2xl group-hover:bg-white transition-all duration-500 border border-slate-100/50">
                        <CardContent className="p-8 flex flex-col items-center text-center h-full">
                          <motion.div 
                            className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:rotate-[10deg] transition-all duration-500`}
                          >
                            <item.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          
                          <h3 className="font-heading font-black text-lg text-[#0A192F] mb-4 group-hover:text-[#75B2DD] transition-colors leading-tight">
                            {item.title}
                          </h3>
                          
                          <div className="mt-auto flex items-center gap-2 text-[#75B2DD] font-black text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                            Apply Service
                            <ArrowRight className="w-4 h-4" />
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
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 lg:p-16 bg-[#0A192F] rounded-[40px] text-center text-white relative overflow-hidden group shadow-[0_30px_60px_rgba(10,25,47,0.3)]"
        >
          {/* Parallax Background Circles */}
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-white/5 rounded-full blur-[80px]"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
                top: i % 2 === 0 ? '-20%' : '50%',
                right: i % 2 === 0 ? '-10%' : '60%',
              }}
              animate={{ 
                scale: [1, 1.2, 1],
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
              className="w-14 h-14 bg-[#75B2DD] rounded-[18px] mx-auto mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(117,178,221,0.4)] group-hover:rotate-12 transition-transform duration-500"
            >
              <Search className="w-7 h-7 text-[#0A192F]" />
            </motion.div>
            
            <h3 className="font-heading font-black text-3xl lg:text-4xl mb-4 tracking-tighter">Need specific help?</h3>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              If you need expert guidance through the regulatory process, 
              our dedicated support team is available for direct assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-[#75B2DD] hover:bg-white text-[#0A192F] font-black rounded-full px-10 h-14 transition-all duration-500 shadow-2xl">
                <Link to="/contact">Speak to an Advisor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 h-14 backdrop-blur-xl">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
