import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  Info, 
  ShieldCheck, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  Paperclip,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { toast } = useToast();
  
  const [jobDetails, setJobDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentRole: '',
    linkedinUrl: '',
    coverLetter: '',
    dataConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);

  useEffect(() => {
    // If we have state from Careers page, use it
    if (location.state?.job) {
      setJobDetails(location.state.job);
    } else {
      // Logic for fetching job details by ID if needed
      // For now, mock it if not coming from state
      setJobDetails({
        id: jobId || 'J-999',
        title: 'BOCRA Specialist Role',
        department: 'BOCRA General'
      });
    }

    // Try to pre-fill from logged in user
    const storedUser = localStorage.getItem('bocra_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || ''
      }));
    }
  }, [location.state, jobId]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCVChange = (e) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleAdditionalChange = (e) => {
    if (e.target.files) {
      setAdditionalFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeAdditional = (idx) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dataConsent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please accept the data privacy consent to proceed.",
      });
      return;
    }

    if (!cvFile) {
      toast({
        variant: "destructive",
        title: "CV Required",
        description: "Please upload your Curriculum Vitae to submit the application.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('jobId', jobId);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('currentRole', formData.currentRole);
      formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      formDataToSend.append('coverLetter', formData.coverLetter);
      
      // Append files
      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }
      
      additionalFiles.forEach(file => {
        formDataToSend.append('documents', file);
      });

      const { submitJobApplication } = await import('@/services/api');
      const response = await submitJobApplication(formDataToSend);
      
      setSubmissionId(response.trackingId);
      setIsSubmitted(true);
      
      toast({
        title: "Application Received",
        description: `Your application for ${jobDetails?.title} has been successfully submitted.`,
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: err.message || "There was a problem submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-slate-50">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-xl w-full"
        >
          <Card className="border-none shadow-2xl rounded-sm p-12 text-center overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#75B2DD]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <CardContent className="flex flex-col items-center relative z-10 p-0">
              <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-[#0A192F] mb-4 tracking-tight uppercase">Application Sent!</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                Thank you for applying for the <span className="text-[#75B2DD] font-bold">{jobDetails?.title}</span> position. 
                Our recruitment team will review your application and get in touch.
              </p>
              
              <div className="w-full bg-slate-50 p-6 rounded-sm border border-slate-100 mb-10">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Tracking ID</p>
                 <p className="text-2xl font-black text-[#0A192F] tracking-widest font-mono">{submissionId}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  onClick={() => navigate('/careers')}
                  className="flex-1 h-14 rounded-sm bg-[#0A192F] text-white font-bold uppercase tracking-widest text-xs shadow-xl"
                >
                  Return to Careers
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 h-14 rounded-sm border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-slate-50"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/careers')}
              className="text-slate-500 hover:text-[#0A192F] hover:bg-white mb-6 -ml-4 rounded-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Button>
            <div className="flex flex-wrap items-center gap-4 mb-3">
               <h1 className="text-4xl lg:text-5xl font-black text-[#0A192F] tracking-tight">Apply for Excellence</h1>
               <Badge className="bg-[#75B2DD]/20 text-[#75B2DD] hover:bg-[#75B2DD]/30 border-none px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest">
                  Official Application
               </Badge>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
               Application for: <span className="text-[#0A192F] ml-1">{jobDetails?.title} ({jobDetails?.id})</span>
            </p>
          </motion.div>

          <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-sm shadow-sm hidden lg:flex">
             <div className="w-12 h-12 rounded bg-[#0A192F] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#75B2DD]" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Security</p>
                <p className="text-xs font-bold text-[#0A192F]">SSL Encrypted Portal</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Card className="bg-white border-none shadow-2xl rounded-sm p-2 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-[#0A192F] flex items-center gap-3 uppercase tracking-tight">
                  <User className="w-6 h-6 text-[#75B2DD]" />
                  Applicant Profile
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium tracking-tight">Please provide your professional background and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <User size={14} className="text-[#75B2DD]" /> Full Name
                      </Label>
                      <Input 
                        id="fullName" 
                        required 
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your legal full name" 
                        className="bg-slate-50 border-slate-100 h-14 rounded-sm text-[#0A192F] placeholder:text-slate-300 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Mail size={14} className="text-[#75B2DD]" /> Professional Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@example.com"
                        className="bg-slate-50 border-slate-100 h-14 rounded-sm text-[#0A192F] placeholder:text-slate-300 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Phone size={14} className="text-[#75B2DD]" /> Contact Phone
                      </Label>
                      <Input 
                        id="phone" 
                        required 
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+267 7X XXX XXX" 
                        className="bg-slate-50 border-slate-100 h-14 rounded-sm text-[#0A192F] placeholder:text-slate-300 shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                       <Label htmlFor="currentRole" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Briefcase size={14} className="text-[#75B2DD]" /> Current / Most Recent Role
                       </Label>
                       <Input 
                         id="currentRole"
                         value={formData.currentRole}
                         onChange={handleChange}
                         placeholder="e.g. Senior Network Engineer"
                         className="bg-slate-50 border-slate-100 h-14 rounded-sm text-[#0A192F] placeholder:text-slate-300 shadow-sm"
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="linkedinUrl" className="text-[10px] font-black uppercase tracking-widest text-slate-500">LinkedIn / Portfolio URL (Optional)</Label>
                    <Input 
                      id="linkedinUrl" 
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username" 
                      className="bg-slate-50 border-slate-100 h-14 rounded-sm text-[#0A192F] placeholder:text-slate-300 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label htmlFor="coverLetter" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Statement of Suitability / Cover Letter (Optional)</Label>
                    <Textarea 
                      id="coverLetter" 
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Briefly describe why you are the ideal fit for this role at BOCRA..." 
                      className="bg-slate-50 border-slate-100 rounded-sm min-h-[120px] text-[#0A192F] p-6 shadow-sm focus:bg-white"
                    />
                  </div>

                  <div className="space-y-8 pt-6">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                         Upload CV / Resume (PDF Required)
                         {cvFile && <span className="text-green-600 flex items-center gap-1 font-bold text-[9px]"><CheckCircle2 size={10} /> Document Ready</span>}
                      </Label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          id="cvUpload" 
                          onChange={handleCVChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed rounded-sm py-12 px-10 text-center transition-all duration-300 ${cvFile ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 group-hover:border-[#75B2DD] group-hover:bg-white'}`}>
                          <Upload className={`w-12 h-12 mx-auto mb-4 transition-all ${cvFile ? 'text-green-500' : 'text-slate-300 group-hover:text-[#75B2DD] group-hover:scale-110'}`} />
                          <p className="text-[#0A192F] font-black text-lg mb-1 uppercase tracking-tight">
                             {cvFile ? cvFile.name : 'Select your primary CV'}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">Click to browse or drag and drop your curriculum vitae file here.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Other Attachments (Certificates, ID, etc.)</Label>
                       <div className="relative group">
                         <input 
                           type="file" 
                           multiple 
                           id="additionalFiles" 
                           onChange={handleAdditionalChange}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div className="bg-slate-50 border border-slate-200 rounded-sm py-6 px-10 text-center flex items-center justify-center gap-4 group-hover:bg-white group-hover:border-slate-300 transition-all">
                            <Paperclip className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Add extra files</span>
                         </div>
                       </div>
                       
                       <AnimatePresence>
                          {additionalFiles.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4"
                            >
                               {additionalFiles.map((file, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    layout
                                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-sm shadow-sm"
                                  >
                                     <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText size={16} className="text-[#75B2DD] flex-shrink-0" />
                                        <span className="text-xs font-bold text-[#0A192F] truncate">{file.name}</span>
                                     </div>
                                     <button 
                                        type="button"
                                        onClick={() => removeAdditional(idx)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                     >
                                        <MapPin size={14} className="rotate-45" /> {/* Use X equivalent */}
                                     </button>
                                  </motion.div>
                               ))}
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                  </div>

                  <div className="bg-[#0A192F]/5 p-8 rounded-sm border border-[#0A192F]/5">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center h-6">
                        <input 
                          id="dataConsent" 
                          type="checkbox" 
                          checked={formData.dataConsent}
                          onChange={handleChange}
                          className="w-5 h-5 rounded-none border-slate-300 text-[#0A192F] focus:ring-[#0A192F]" 
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="dataConsent" className="text-slate-600 font-bold leading-relaxed">
                          I declare that the information provided is correct and complete. I understand that 
                          providing false information may lead to disqualification. I consent to my personal 
                          data being processed for recruitment purposes.
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-20 rounded-sm bg-[#0A192F] hover:bg-[#01142F] text-white font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                       <Loader2 className="animate-spin h-6 w-6 text-[#75B2DD]" />
                    ) : (
                       <CheckCircle2 className="w-6 h-6 text-[#75B2DD]" />
                    )}
                    {isSubmitting ? 'Registering Application...' : 'Send Application to BOCRA'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-[#0A192F] text-white border-none rounded-sm p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#75B2DD]/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                 <Info className="w-5 h-5 text-[#75B2DD]" />
                 Recruitment Policy
               </h3>
               <ul className="space-y-10">
                 {[
                   { title: 'Response Timeline', desc: 'Successful candidates will be contacted within 14 working days of the closing date.' },
                   { title: 'Security Clearances', desc: 'All critical roles at BOCRA require standard national security vetting.' },
                   { title: 'Digital Only', desc: 'We only accept applications through our official digital portal.' },
                   { title: 'Help Desk', desc: 'For technical issues, contact our HR Support at hr@bocra.org.bw.' }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-6">
                     <div className="font-heading font-black text-4xl text-[#75B2DD]/10 leading-none">
                        {String(i + 1).padStart(2, '0')}
                     </div>
                     <div>
                       <p className="text-sm font-black text-white mb-2 uppercase tracking-tight">{item.title}</p>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                   </li>
                 ))}
               </ul>
            </Card>
            
            <div className="p-8 bg-white border border-slate-100 rounded-sm shadow-sm">
               <h4 className="font-black text-[#0A192F] mb-4 uppercase text-xs tracking-widest">Equal Opportunity</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                  BOCRA is an equal opportunity employer. We value diversity and do not discriminate on the basis of gender, 
                  tribe, religion, or disability.
               </p>
            </div>
            
            <Button 
               variant="outline" 
               className="w-full border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[10px] h-12 rounded-sm"
               onClick={() => navigate('/careers')}
            >
               View other opportunities
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock MapPin for removal since it was reused incorrectly
function MapPin({ size, className }) {
   return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
   );
}

export default JobApplicationForm;
