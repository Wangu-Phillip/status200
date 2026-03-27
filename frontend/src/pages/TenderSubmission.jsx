import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Upload, CheckCircle2, ArrowLeft, FileText, Info, ShieldCheck, Loader2 } from 'lucide-react';

  const API_URL = '/api';

const TenderSubmission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    tenderReference: '',
    proposalTitle: '',
    description: '',
    submittedAmount: '',
    dataConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bocra_user');
    if (!storedUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in as a citizen to submit a tender.",
      });
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { state: location.state });
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Auto-fill company name from user if available
    if (parsedUser.organization) {
      setFormData(prev => ({ ...prev, companyName: parsedUser.organization }));
    }

    if (location.state) {
      setFormData(prev => ({
        ...prev,
        tenderReference: location.state.tenderNumber || '',
        proposalTitle: location.state.title || ''
      }));
    }
  }, [location.state, navigate, location.pathname, location.search, toast]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dataConsent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please accept the data collection consent to proceed.",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Required Files Missing",
        description: "Please attach your tender documents before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('bocra_token');
      
      // Step 1: Submit Tender Details
      const response = await fetch(`${API_URL}/tenders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.proposalTitle,
          bidderName: formData.companyName,
          bidderEmail: user.email,
          bidderPhone: user.phone || 'N/A',
          description: formData.description,
          tenderNumber: formData.tenderReference,
          submittedAmount: parseFloat(formData.submittedAmount) || 0,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit tender');
      }

      const tenderData = await response.json();
      setSubmissionResult(tenderData);

      // Step 2: Upload Documents (if any)
      // In a real implementation, we'd use FormData and the /tenders/:id/documents endpoint
      // For now, we'll simulate the successful document linkage
      
      setIsSubmitted(true);
      toast({
        title: "Tender Submitted Successfully",
        description: `Your submission for ${formData.tenderReference} has been received. Reference ID: ${tenderData.tenderNumber}`,
      });
    } catch (err) {
      console.error('Submission error:', err);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Your proposal for <span className="text-teal-400 font-bold">{formData.tenderReference}</span> has been received. 
              Ref: <span className="bg-white/5 px-3 py-1 rounded-lg text-white border border-white/10 font-mono ml-2">{submissionResult?.tenderNumber || 'PENDING'}</span>
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
            <p className="text-slate-400 font-medium italic">Official BOCRA Procurement Gateway</p>
          </div>
          <Badge className="bg-teal-600/20 text-teal-400 border-teal-500/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest h-fit">
            Secure Submission Path
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#0a0f1e] border-white/5 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                  <FileText className="w-6 h-6 text-teal-400" />
                  Submission Details
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Please provide accurate company and proposal information.</CardDescription>
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
                        placeholder="Legal Entity Name" 
                        className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white placeholder:text-slate-700 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="tenderReference" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tender Reference</Label>
                      <Input 
                        id="tenderReference" 
                        required 
                        readOnly={!!location.state?.tenderNumber}
                        value={formData.tenderReference}
                        onChange={handleChange}
                        className={`bg-slate-900 border-white/5 h-14 rounded-2xl text-white ${location.state?.tenderNumber ? 'opacity-70 focus:ring-0' : 'focus:ring-teal-500'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="proposalTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proposal Title</Label>
                      <Input 
                        id="proposalTitle" 
                        required 
                        value={formData.proposalTitle}
                        onChange={handleChange}
                        placeholder="Brief title of your response" 
                        className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white"
                      />
                    </div>
                    <div className="space-y-3">
                       <Label htmlFor="submittedAmount" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bid Amount (BWP)</Label>
                       <Input 
                         id="submittedAmount"
                         type="number"
                         required
                         value={formData.submittedAmount}
                         onChange={handleChange}
                         placeholder="Enter total bid value"
                         className="bg-slate-900 border-white/5 h-14 rounded-2xl text-white"
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proposal Executive Summary</Label>
                    <Textarea 
                      id="description" 
                      required 
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Summarize your technical and financial capabilities for this project..." 
                      className="bg-slate-900 border-white/5 rounded-3xl min-h-[150px] text-white p-6"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attach Supporting Documents (PDF/ZIP)</Label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        multiple 
                        id="tenderFiles" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="bg-slate-900 border-2 border-dashed border-white/10 rounded-[2rem] p-10 text-center group-hover:border-teal-500/50 transition-all">
                        <Upload className="w-10 h-10 text-slate-600 mx-auto mb-4 group-hover:text-teal-400 group-hover:scale-110 transition-all" />
                        <p className="text-white font-bold mb-1">
                           {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drop files here or click to browse'}
                        </p>
                        <p className="text-xs text-slate-500 italic">Upload your technical proposal, company profile, and financial bid.</p>
                      </div>
                    </div>
                    {selectedFiles.length > 0 && (
                       <div className="mt-4 space-y-2">
                          {selectedFiles.map((file, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-lg text-slate-300">
                                <FileText size={14} className="text-teal-400" />
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                             </div>
                          ))}
                       </div>
                    )}
                  </div>

                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center h-6">
                        <input 
                          id="dataConsent" 
                          type="checkbox" 
                          checked={formData.dataConsent}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-white/10 bg-slate-900 text-teal-600 focus:ring-teal-500" 
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="dataConsent" className="text-slate-300 font-medium">
                          I confirm that the information provided is accurate and represent our legal entity. 
                          I consent to BOCRA processing this data for evaluation purposes.
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-18 rounded-[2rem] bg-[#00897B] hover:bg-[#4DB6AC] text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-teal-900/40 transition-all active:scale-95 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                       <Loader2 className="animate-spin h-6 w-6 mr-3 text-white" />
                    ) : (
                       <ShieldCheck className="w-6 h-6 mr-3 text-white" />
                    )}
                    {isSubmitting ? 'Securing Submission...' : 'Submit Proposal to BOCRA'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-teal-900/20 to-slate-900 border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                <Info className="w-5 h-5 text-teal-400" />
                Submission Rules
              </h3>
              <ul className="space-y-6">
                {[
                  { title: 'Strict Deadlines', desc: 'All submissions must be completed before the closing time specified.' },
                  { title: 'Digital Signatures', desc: 'Ensure all PDF documents are digitally signed where required.' },
                  { title: 'File Integrity', desc: 'Ensure your files are not corrupted and are within the 50MB size limit.' },
                  { title: 'Confirmation', desc: 'A unique tracking reference will be generated upon successful submission.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 text-[10px] font-black">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white mb-1 uppercase tracking-tight">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderSubmission;
