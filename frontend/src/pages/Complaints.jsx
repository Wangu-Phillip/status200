import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { AlertCircle, Upload, FileText, CheckCircle, Copy, Hash } from 'lucide-react';
import { addSubmission, DEPARTMENTS } from '../utils/persistence';

const Complaints = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    complainantName: '',
    email: '',
    phone: '',
    operator: '',
    complaintType: 'Service Quality',
    subject: '',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [submittedToken, setSubmittedToken] = useState(null);

  const operators = ['BTC', 'Mascom', 'Orange', 'Yarona FM', 'Duma FM', 'Gabz FM', 'eBotswana', 'Other'];
  const complaintTypes = [
    'Service Quality',
    'Billing Issues',
    'Network Coverage',
    'Customer Service',
    'Contract Disputes',
    'Data Privacy',
    'Content Regulation',
    'Other',
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submission = addSubmission({
      type: 'complaint',
      department: DEPARTMENTS.COMPLAINTS,
      citizenName: formData.complainantName,
      citizenEmail: formData.email,
      subject: formData.subject,
      description: `[${formData.complaintType}] Against: ${formData.operator}\n\n${formData.description}`,
      priority: formData.complaintType === 'Data Privacy' ? 'High' : 'Medium',
    });
    
    setSubmittedToken(submission.id);
    
    toast({
      title: 'Complaint Submitted Successfully',
      description: `Reference Token: ${submission.id}`,
    });
  };

  // Token Success Modal
  if (submittedToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-[#003366] to-[#0A4D8C] p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Complaint Submitted!</h2>
              <p className="text-[#E8F0F9] mt-2">Your complaint has been registered with BOCRA</p>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 text-center border-2 border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Reference Token</p>
                <div className="flex items-center justify-center gap-3">
                  <Hash className="h-5 w-5 text-[#003366]" />
                  <span className="text-2xl font-mono font-bold text-slate-900">{submittedToken}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(submittedToken);
                      toast({ title: 'Copied!', description: 'Token copied to clipboard' });
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">What happens next?</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0F9] text-[#003366] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                    Your complaint will be reviewed by the BOCRA Complaints Department
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0F9] text-[#003366] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    You will receive email updates on the progress
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0F9] text-[#003366] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    Use your reference token above to follow up on your complaint
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-[#003366] hover:bg-[#0A4D8C] text-white rounded-xl h-12"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setSubmittedToken(null); setFormData({ complainantName: '', email: '', phone: '', operator: '', complaintType: 'Service Quality', subject: '', description: '' }); setFiles([]); }}
                  className="flex-1 rounded-xl h-12"
                >
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">File a Complaint</h1>
          <p className="text-lg text-gray-600">
            BOCRA is committed to protecting consumer rights in the communications sector
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Before Filing a Complaint</h3>
                <p className="text-sm text-gray-700 mb-2">
                  We recommend first attempting to resolve your issue directly with the service provider. If the
                  issue remains unresolved, BOCRA will investigate your complaint.
                </p>
                <p className="text-sm text-gray-700">
                  Please provide as much detail and evidence as possible to support your complaint.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Complaint Form</CardTitle>
            <CardDescription>Fill out this form to submit your complaint to BOCRA</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Complainant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complainantName">Full Name *</Label>
                    <Input
                      id="complainantName"
                      name="complainantName"
                      value={formData.complainantName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+267 xxx xxxx"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operator">Service Provider/Operator *</Label>
                    <select
                      id="operator"
                      name="operator"
                      value={formData.operator}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select operator</option>
                      {operators.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complaintType">Complaint Type *</Label>
                    <select
                      id="complaintType"
                      name="complaintType"
                      value={formData.complaintType}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      {complaintTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject/Summary *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief summary of your complaint"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of your complaint, including dates, attempted resolutions, and any relevant details"
                    rows={6}
                    required
                  />
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Supporting Evidence (Optional)</h3>
                <p className="text-sm text-gray-600">Upload bills, screenshots, correspondence, or other relevant documents</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#003366] transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-[#003366] font-semibold hover:text-[#0A4D8C]">Click to upload</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG, DOC (max. 5MB each)</p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-[#003366] mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  By submitting this complaint, you confirm that the information provided is accurate to the best of
                  your knowledge. BOCRA may contact you for additional information during the investigation.
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#003366] hover:bg-[#0A4D8C] text-white px-8">
                  Submit Complaint
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Complaints;
