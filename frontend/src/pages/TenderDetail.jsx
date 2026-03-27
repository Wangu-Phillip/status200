import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  FileText,
  Send,
  Upload,
  CheckCircle,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const API = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000") + "/api";

export default function TenderDetail() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, getAuthHeader } = useAuth();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [applicationId, setApplicationId] = useState(null);
  
  const [formData, setFormData] = useState({
    company_name: "",
    proposal_summary: "",
    proposed_budget: "",
    timeline: ""
  });

  useEffect(() => {
    fetchTender();
  }, [tenderId]);

  useEffect(() => {
    if (user?.company_name) {
      setFormData(prev => ({ ...prev, company_name: user.company_name }));
    }
  }, [user]);

  const fetchTender = async () => {
    try {
      const response = await axios.get(`${API}/tenders/${tenderId}`);
      setTender(response.data);
    } catch (error) {
      console.error("Error fetching tender:", error);
      toast.error("Tender not found");
      navigate("/tenders");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.proposal_summary || !formData.proposed_budget || !formData.timeline) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await axios.post(
        `${API}/tenders/${tenderId}/apply`,
        {
          tender_id: tenderId,
          ...formData
        },
        { headers: getAuthHeader() }
      );
      
      setApplicationId(response.data.id);
      
      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);
          
          await axios.post(
            `${API}/upload?application_type=tender&application_id=${response.data.id}`,
            formDataUpload,
            { headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } }
          );
        }
      }
      
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.detail || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 10MB per file.`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" data-testid="tender-success">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="max-w-md w-full border border-slate-200 rounded-sm shadow-none">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-[#0A192F] mb-2">
                Application Submitted!
              </h2>
              <p className="text-slate-600 mb-6">
                Your tender application has been submitted for review. You can track its status in your portal.
              </p>
              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm"
                >
                  <Link to="/portal">Go to My Portal</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full rounded-sm"
                >
                  <Link to="/tenders">Browse More Tenders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="tender-detail">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" size="sm" asChild className="rounded-sm">
              <Link to="/tenders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tenders
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild className="bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm">
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Apply
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tender Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 bg-slate-100 text-slate-700 rounded-sm">
                {tender.category}
              </Badge>
              <h1 className="font-heading font-bold text-2xl lg:text-3xl text-[#0A192F] mb-4">
                {tender.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                {tender.budget_range && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{tender.budget_range}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <Card className="border border-slate-200 rounded-sm shadow-none mb-6">
                <CardHeader>
                  <CardTitle className="font-heading text-lg text-[#0A192F]">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">{tender.description}</p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 rounded-sm shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-lg text-[#0A192F]">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">{tender.requirements}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Application Form */}
          <div>
            <Card className="border border-slate-200 rounded-sm shadow-none sticky top-24">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-[#0A192F]">
                  Submit Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-4">
                    <p className="text-slate-500 mb-4">Sign in to submit your application</p>
                    <Button asChild className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                       <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Your Company Ltd"
                        className="rounded-sm"
                        required
                        data-testid="tender-company-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proposal_summary">Proposal Summary *</Label>
                      <Textarea
                        id="proposal_summary"
                        value={formData.proposal_summary}
                        onChange={(e) => setFormData({ ...formData, proposal_summary: e.target.value })}
                        placeholder="Briefly describe your proposal..."
                        className="rounded-sm min-h-[100px]"
                        required
                        data-testid="tender-proposal-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proposed_budget">Proposed Budget *</Label>
                      <Input
                        id="proposed_budget"
                        value={formData.proposed_budget}
                        onChange={(e) => setFormData({ ...formData, proposed_budget: e.target.value })}
                        placeholder="e.g., BWP 750,000"
                        className="rounded-sm"
                        required
                        data-testid="tender-budget-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Proposed Timeline *</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g., 6 months"
                        className="rounded-sm"
                        required
                        data-testid="tender-timeline-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Supporting Documents</Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-sm p-4 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-500">Click to upload files</p>
                          <p className="text-xs text-slate-400">PDF, DOC, Images (Max 10MB each)</p>
                        </label>
                      </div>
                      {files.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-600 truncate max-w-[150px]">{file.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 text-sm hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#0A192F] hover:bg-slate-800 text-white rounded-sm"
                      disabled={submitting}
                      data-testid="submit-tender-btn"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Submit Application
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
