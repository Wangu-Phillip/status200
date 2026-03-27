import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  UserCheck, 
  ShieldCheck, 
  Globe, 
  Radio, 
  ArrowRight,
  ChevronLeft,
  X,
  Buildings,
  Headphones,
  FileSearch,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactFunnel = () => {
  const [step, setStep] = useState('intent'); // 'intent' or 'details'
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const intents = [
    {
      id: 'consumer',
      title: 'Consumer Support',
      description: 'Report issues with network quality, billing, or service providers.',
      icon: UserCheck,
      color: 'from-[#16A34A] to-[#0D5A2E]',
      department: 'Consumer Complaints',
      email: 'complaints@bocra.org.bw',
      phone: '+267 395 7757'
    },
    {
      id: 'licensing',
      title: 'Licensing & Technical',
      description: 'Inquire about Type Approval, spectrum, or communication licenses.',
      icon: ShieldCheck,
      color: 'from-[#0A192F] to-[#25406E]',
      department: 'Licensing & Type Approval',
      email: 'licensing@bocra.org.bw',
      phone: '+267 395 7756'
    },
    {
      id: 'corporate',
      title: 'Corporate Affairs',
      description: 'Media inquiries, public relations, and general business matters.',
      icon: MessageSquare,
      color: 'from-[#F59E0B] to-[#B45309]',
      department: 'Media Relations',
      email: 'media@bocra.org.bw',
      phone: '+267 395 7760'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      description: 'Standard questions about BOCRA operations or office locations.',
      icon: Globe,
      color: 'from-[#DC2626] to-[#991B1B]',
      department: 'General Inquiries',
      email: 'info@bocra.org.bw',
      phone: '+267 395 7755'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message Received', {
      description: `Your inquiry for ${selectedIntent.department} has been logged.`
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setStep('intent');
  };

  const handleSelectIntent = (intent) => {
    setSelectedIntent(intent);
    setStep('details');
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Immersive Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A192F]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,rgba(117,178,221,0.5),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#75B2DD] font-black tracking-[0.4em] uppercase text-[10px] mb-4"
          >
            How can we assist you?
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading font-black text-5xl lg:text-8xl mb-8 tracking-tighter leading-[0.85]"
          >
            Resolution <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B2DD] via-white to-[#75B2DD] bg-[length:200%_auto] animate-gradient-x">
              CENTER
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Connect directly with the relevant department for faster processing 
            of your inquiries and complaints.
          </motion.p>
        </div>
      </section>

      {/* Funnel Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-10">
        <AnimatePresence mode="wait">
          {step === 'intent' ? (
            <motion.div 
              key="intent-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {intents.map((intent) => (
                <Card 
                  key={intent.id}
                  onClick={() => handleSelectIntent(intent)}
                  className="border-0 shadow-2xl rounded-[2.5rem] cursor-pointer group hover:translate-y-[-10px] transition-all duration-500 bg-white overflow-hidden border border-slate-100"
                >
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${intent.color} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-all duration-500`}>
                      <intent.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-[#0A192F] mb-4 group-hover:text-[#75B2DD] transition-colors line-clamp-1">
                      {intent.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 line-clamp-3">
                      {intent.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-[#75B2DD] font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Select Department
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="details-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-5 space-y-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep('intent')}
                  className="mb-4 text-slate-500 hover:text-[#0A192F] font-black uppercase text-[10px] tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Change Department
                </Button>
                
                <Card className={`border-0 rounded-[3rem] bg-gradient-to-br ${selectedIntent.color} text-white p-10 shadow-2xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <selectedIntent.icon className="w-12 h-12 mb-8 opacity-50" />
                  <h2 className="font-heading font-black text-4xl mb-2 tracking-tighter">
                    {selectedIntent.department}
                  </h2>
                  <p className="text-white/70 font-medium mb-10">Direct Contact Hub</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                      <Phone className="w-5 h-5 text-[#75B2DD]" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Telephone</p>
                        <p className="font-black text-lg">{selectedIntent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                      <Mail className="w-5 h-5 text-[#75B2DD]" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Direct Email</p>
                        <p className="font-black text-lg break-all">{selectedIntent.email}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Office Info */}
                <Card className="border-0 rounded-[2.5rem] bg-slate-50 p-8">
                   <h3 className="font-black text-[#0A192F] text-sm uppercase tracking-widest mb-6">HQ Locations</h3>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <MapPin className="w-4 h-4 text-[#0A192F]" />
                         </div>
                         <p className="text-sm text-slate-600 font-medium">Plot 50671 Independence Avenue, <br/> Gaborone, Botswana</p>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Clock className="w-4 h-4 text-[#0A192F]" />
                         </div>
                         <p className="text-sm text-slate-600 font-medium">Mon - Fri: 07:30 - 16:30 <br/> Sat - Sun: Closed</p>
                      </div>
                   </div>
                </Card>
              </div>

              <div className="lg:col-span-7">
                <Card className="border-0 shadow-2xl rounded-[3rem] p-8 sm:p-12 overflow-hidden bg-white border border-slate-100">
                  <h2 className="text-3xl font-black text-[#0A192F] mb-2 tracking-tighter">Direct Message</h2>
                  <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">Routing to {selectedIntent.department}</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 font-medium">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold focus-visible:ring-[#0A192F]"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold focus-visible:ring-[#0A192F]"
                          placeholder="j.doe@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inquiry Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold focus-visible:ring-[#0A192F]"
                        placeholder="Nature of inquiry"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Details</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="rounded-2xl border-slate-100 bg-slate-50 font-bold p-6 min-h-[200px] focus-visible:ring-[#0A192F]"
                        placeholder="Please describe your requirements in detail..."
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full h-18 bg-[#0A192F] hover:bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      SEND TO {selectedIntent.department.toUpperCase()}
                      <Send className="h-5 w-5 ml-3" />
                    </Button>
                  </form>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Map Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-4">Visit Our Headquarters</h2>
                <p className="text-slate-500 font-medium">Independence Avenue, Gaborone</p>
              </div>
              <Button asChild variant="outline" className="rounded-full h-14 px-10 border-[#0A192F] text-[#0A192F] font-black">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer">Open in Google Maps</a>
              </Button>
           </div>
           
           <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
              <div className="w-full h-[500px] bg-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.123!2d25.908!3d-24.653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM5JzEwLjgiUyAyNcKwNTQnMjguOCJF!5e0!3m2!1sen!2sbw!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="BOCRA HQ"
                ></iframe>
              </div>
           </Card>
        </div>
      </section>

      {/* Global CSS for animations */}
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

export default ContactFunnel;
