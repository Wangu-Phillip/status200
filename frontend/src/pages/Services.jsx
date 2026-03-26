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
import { motion, AnimatePresence } from "framer-motion";

const serviceCategories = [
  {
    title: "Licensing & Authorization",
    description: "Apply for and manage communication licenses across all sectors in Botswana.",
    color: "from-blue-600 to-blue-800",
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
    color: "from-emerald-600 to-emerald-800",
    items: [
      { id: "qos", title: "QoS Reporting", icon: BarChart, link: "/qos-reporting" },
      { id: "live", title: "Live QoS Monitor", icon: Monitor, link: "/live-qos" },
      { id: "analytics", title: "BOCRA Analytics", icon: Database, link: "/analytics" }
    ]
  },
  {
    title: "Consumer Support",
    description: "Voice your concerns and report digital incidents or quality issues.",
    color: "from-amber-600 to-amber-800",
    items: [
      { id: "complaints", title: "File Complaint", icon: UserCheck, link: "/complaints" },
      { id: "incident", title: "Cyber Incidents", icon: ShieldAlert, link: "/cyber-incident" },
      { id: "search", title: "Find Help", icon: Search, link: "/contact" }
    ]
  },
  {
    title: "Registry Services",
    description: "Manage national digital assets and domain names for Botswana.",
    color: "from-purple-600 to-purple-800",
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
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.p 
            className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Regulatory Portfolio
          </motion.p>
          <motion.h1 
            className="font-heading font-black text-5xl lg:text-7xl text-[#0A192F] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Services</span> Hub
          </motion.h1>
          <motion.p 
            className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore our comprehensive range of regulatory services designed to empower 
            citizens and drive digital growth in Botswana.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div 
          className="grid gap-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {serviceCategories.map((category, catIndex) => (
            <div key={category.title} className="relative">
              <div className="flex flex-col lg:flex-row items-baseline gap-4 mb-8">
                <h2 className="font-heading font-bold text-3xl text-[#0A192F]">
                  {category.title}
                </h2>
                <div className="h-0.5 flex-1 bg-slate-100 hidden lg:block" />
                <p className="text-slate-400 text-sm max-w-sm">
                  {category.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group"
                  >
                    <Link to={item.link}>
                      <Card className="border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl h-full overflow-hidden relative">
                        {/* Interactive Background Gradient */}
                        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${category.color} translate-y-full group-hover:translate-y-0 transition-transform duration-300`} />
                        
                        <CardContent className="p-8">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
                            <item.icon className="w-7 h-7 text-white" />
                          </div>
                          
                          <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-3 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          
                          <div className="flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                            Explore Service
                            <ArrowRight className="w-4 h-4 ml-2" />
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

        {/* Support CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-28 p-12 bg-[#0A192F] rounded-[40px] text-center text-white relative overflow-hidden"
        >
          {/* Background Motion */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <h3 className="font-heading font-bold text-3xl mb-4">Can't find what you're looking for?</h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Our support team is ready to assist you with any regulatory queries or technical difficulties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 rounded-xl px-10">
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 rounded-xl px-10">
                <Link to="/">Back Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
