import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Upload, CheckCircle2, ArrowLeft, FileText, Info, ShieldCheck } from 'lucide-react';
import { addSubmission, DEPARTMENTS } from '../utils/persistence';

const TenderSubmission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: '',
    tenderReference: '',
    proposalTitle: '',
    description: '',
    dataConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Pre-fill from location state if available
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        tenderReference: location.state.tenderNumber || '',
        proposalTitle: location.state.title || ''
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.dataConsent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please accept the data collection consent to proceed.",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Required Files Missing",
        description: "Please attach your tender documents before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addSubmission({
        type: 'tender-bid',
        department: DEPARTMENTS.TENDERS,
        citizenName: formData.companyName,
        citizenEmail: 'contact@' + formData.companyName.toLowerCase().replace(/\s/g, '') + '.com',
        subject: formData.proposalTitle,
        description: `Reference: ${formData.tenderReference}\n\n${formData.description}`,
        priority: 'Medium',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Tender Submitted",
        description: "Your tender application has been successfully stored for review.",
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-xl w-full bg-[#0a0f1e] border-white/5 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <CardContent className="flex flex-col items-center relative z-10">
            <div className="w-24 h-24 bg-teal-500/10 rounded-[2.5rem] flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12 text-teal-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Submission Successful!</h2>
            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              Your proposal for <span className="text-teal-400 font-bold">{formData.tenderReference}</span> has been received. Our procurement team will review your application and contact you shortly.
            </p>
            <div className="flex gap-4 w-full">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-16 rounded-2xl bg-[#00897B] text-white font-black uppercase tracking-widest text-xs hover:bg-[#4DB6AC] shadow-2xl shadow-teal-900/40"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/tenders')}
                className="flex-1 h-16 rounded-2xl border-white/10 bg-transparent text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/5"
              >
                Browse Tenders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-left-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tenders')}
              className="text-slate-500 hover:text-white mb-6 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portal
            </Button>
            <h1 className="text-5xl font-black text-white tracking-tight mb-2">Tender Application</h1>
            <p className="text-slate-400 font-medium italic">BOCRA Procurement Submission Gateway</p>
          </div>
          <Badge className="bg-teal-600/20 text-teal-400 border-teal-500/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse h-fit">
            Portal Secure • 256-bit SSL
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-[#0a0f1e] border-white/5 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                  <FileText className="w-6 h-6 text-teal-400" />
                  Submission Details
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Complete all required fields below to submit your proposal.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Company Name</Label>
                      <Input 
                        id="companyName" 
                        required 
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Solutions Ltd" 
                        className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white placeholder:text-slate-700 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="tenderReference" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tender Reference</Label>
                      <Input 
                        id="tenderReference" 
                        required 
                        value={formData.tenderReference}
                        onChange={handleChange}
                        placeholder="e.g. BOCRA/PT/001/2026" 
                        className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white placeholder:text-slate-700 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="proposalTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proposal Title</Label>
                    <Input 
                      id="proposalTitle" 
                      required 
                      value={formData.proposalTitle}
                      onChange={handleChange}
                      placeholder="Title of your submission" 
                      className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white placeholder:text-slate-700 focus:ring-teal-500 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description / executive summary</Label>
                    <Textarea 
                      id="description" 
                      required 
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a brief overview of your proposal..." 
                      rows={5} 
                      className="bg-slate-900 border-white/5 rounded-2xl text-white placeholder:text-slate-700 focus:ring-teal-500 transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload proposal documents (.pdf, .zip)</Label>
                    <div 
                      className="border-2 border-dashed border-white/5 bg-slate-900 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-900/80 hover:border-teal-500/30 transition-all group"
                      onClick={() => document.getElementById('documents').click()}
                    >
                      <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-900/20 transition-all">
                        <Upload className="w-8 h-8 text-teal-400" />
                      </div>
                      {selectedFile ? (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-400">Click to browse or drag and drop</p>
                          <p className="text-[10px] text-slate-600 uppercase tracking-widest">Maximum file size: 50MB</p>
                        </div>
                      )}
                      <input 
                        id="documents" 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="bg-[#0b1222] border border-white/5 rounded-3xl p-6 flex gap-4 items-start">
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        id="dataConsent" 
                        checked={formData.dataConsent}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/10 bg-slate-900 text-teal-600 focus:ring-teal-500" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataConsent" className="text-xs font-bold text-slate-400 leading-relaxed cursor-pointer">
                        I hereby consent to the processing of my company's data for the purpose of this procurement cycle in accordance with the BOCRA <a href="/privacy-policy" className="text-teal-400 underline decoration-teal-400/30 underline-offset-4">Privacy Policy</a> and the Botswana Data Protection Act.
                      </Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 rounded-2xl bg-[#00897B] text-white font-black uppercase tracking-widest text-sm hover:bg-[#4DB6AC] shadow-2xl shadow-teal-900/40 transition-all disabled:opacity-50" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        PROCESSING SECURELY...
                      </span>
                    ) : 'SUBMIT PROPOSAL'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <Card className="bg-[#0a0f1e] border-white/5 rounded-[2.5rem] p-8">
              <div className="w-12 h-12 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-4">Submission Security</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                Your data is protected by end-to-end encryption. Once submitted, your proposal will be timestamped and locked in our digital vault for procurement evaluation.
              </p>
              <div className="space-y-4">
                {['Verified Supplier', 'Encrypted Vault', 'Audit Logged'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#75B2DD]">
                    <div className="w-1.5 h-1.5 bg-[#75B2DD] rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#0a0f1e] border-white/5 rounded-[2.5rem] p-8">
              <div className="w-12 h-12 bg-amber-900/20 rounded-2xl flex items-center justify-center mb-6">
                <Info className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-4">Need Help?</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                Facing issues with document upload? Contact our procurement support office via phone or email during business hours.
              </p>
              <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <p>Mon - Fri: 08:00 - 17:00</p>
                <p className="text-teal-400">procurement@bocra.org.bw</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderSubmission;
