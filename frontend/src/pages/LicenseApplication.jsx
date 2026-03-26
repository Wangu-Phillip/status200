import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { licenseTypes } from '../mockData';
import { Upload, FileText, CheckCircle, Copy, Hash, Loader2 } from 'lucide-react';
import * as api from '../services/api';

const LicenseApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    licenseType: licenseTypes[0],
    applicantName: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    purpose: '',
    duration: '1',
  });
  const [files, setFiles] = useState([]);
  const [submittedToken, setSubmittedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare application data
      const applicationData = {
        applicationType: `License - ${formData.licenseType}`,
        businessName: formData.organization,
        sector: formData.licenseType,
        description: `Applicant: ${formData.applicantName}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nPurpose: ${formData.purpose}\nDuration: ${formData.duration} year(s)`,
        department: 'licensing',
      };

      // Submit application via backend API
      const response = await api.submitApplication(applicationData);
      
      setSubmittedToken(response.referenceNumber);
      
      toast({
        title: 'License Application Submitted',
        description: `Reference Token: ${response.referenceNumber}`,
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Token Success Modal
  if (submittedToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-[#003366] p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
              <p className="text-blue-100 mt-2">Your license application is now under review</p>
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
                    Your application will be reviewed by the BOCRA Licensing Department
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0F9] text-[#003366] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    You may be contacted for additional documents or verification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0F9] text-[#003366] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    Use your reference token to track progress on your dashboard
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-[#003366] hover:bg-blue-700 text-white rounded-xl h-12"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setSubmittedToken(null); setFormData({ licenseType: licenseTypes[0], applicantName: '', organization: '', email: '', phone: '', address: '', purpose: '', duration: '1' }); setFiles([]); }}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">License Application</h1>
          <p className="text-lg text-gray-600">
            Apply for a communications license to operate legally in Botswana
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>License Application Form</CardTitle>
            <CardDescription>Complete all required fields to submit your application</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">License Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="licenseType">License Type *</Label>
                  <select
                    id="licenseType"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    {licenseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">License Duration (Years) *</Label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Applicant Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Full Name *</Label>
                    <Input
                      id="applicantName"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Company Name Ltd"
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
                  <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, City, Postal code"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of License *</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Describe how you intend to use this license"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#003366] transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-[#003366] font-semibold hover:text-[#0A4D8C]">Click to upload</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">Company registration, ID copies, technical documents</p>
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

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#003366] hover:bg-[#0A4D8C] text-white px-8">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicenseApplication;
