import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import * as api from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const licenseTypes = [
  'Network License',
  'Service License',
  'Spectrum License',
  'Broadcasting License',
  'Type Approval',
  'Other',
];

const LicenseApplicationForm = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicationData = {
        applicationType: `License - ${formData.licenseType}`,
        businessName: formData.organization,
        sector: formData.licenseType,
        description: `Applicant: ${formData.applicantName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nPurpose: ${formData.purpose}\nLicense Duration: ${formData.duration} year(s)`,
        department: 'licensing',
      };

      const response = await api.submitApplication(applicationData);

      toast({
        title: 'License Application Submitted',
        description: `Reference: ${response.referenceNumber}. Check your dashboard for updates.`,
      });

      setFormData({
        licenseType: licenseTypes[0],
        applicantName: '',
        organization: '',
        email: '',
        phone: '',
        address: '',
        purpose: '',
        duration: '1',
      });
      setFiles([]);
      
      if (onSuccess) {
        onSuccess(response.referenceNumber);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting license application:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit license application',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-100">New License Application</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all"
            disabled={loading}
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Details Section */}
          <div>
            <h4 className="text-lg font-bold text-slate-300 mb-4">License Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">License Type *</label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                >
                  {licenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">License Duration (Years) *</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                >
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applicant Information Section */}
          <div>
            <h4 className="text-lg font-bold text-slate-300 mb-4">Applicant Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Company Name Ltd"
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+267 xxx xxxx"
                  required
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-slate-300 mb-2">Physical Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, City, Postal code"
                required
                rows={3}
                className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Purpose Section */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Purpose of License *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe how you intend to use this license"
              required
              rows={4}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
            />
          </div>

          {/* Supporting Documents */}
          <div>
            <h4 className="text-lg font-bold text-slate-300 mb-4">Supporting Documents</h4>
            <div className="border-2 border-dashed border-[#1e293b] rounded-xl p-6 text-center hover:border-teal-500/50 transition-colors">
              <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-teal-400 font-bold hover:text-teal-300">Click to upload</span>
                <span className="text-slate-500"> or drag and drop</span>
              </label>
              <p className="text-xs text-slate-600 mt-1">Company registration, ID copies, technical documents</p>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-slate-300">Attached Files ({files.length})</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-400" />
                      <span className="text-sm text-slate-300">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#1e293b]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseApplicationForm;
