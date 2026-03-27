import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  Clock,
  Search,
  Loader2,
  Plus,
  X,
  Calendar,
  MapPin,
  DollarSign,
  ChevronRight,
  Eye,
  AlertCircle,
  CheckCircle,
  Upload,
} from 'lucide-react';
import * as api from '../../services/api';

const TendersView = () => {
  // Available Tenders State
  const [availableTenders, setAvailableTenders] = useState([]);
  const [loadingTenders, setLoadingTenders] = useState(true);
  const [tenderPage, setTenderPage] = useState(1);

  // My Applications State
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [appPage, setAppPage] = useState(1);

  // Modal State
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedTenderPosting, setSelectedTenderPosting] = useState(null);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bidderName: '',
    bidderEmail: '',
    bidderPhone: '',
    submittedAmount: '',
    description: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my-applications'

  // Fetch available tenders
  useEffect(() => {
    fetchAvailableTenders();
  }, [tenderPage]);

  // Fetch my applications
  useEffect(() => {
    fetchMyApplications();
  }, [appPage]);

  const fetchAvailableTenders = async () => {
    try {
      setLoadingTenders(true);
      const data = await api.getAvailableTenderPostings({ 
        page: tenderPage, 
        limit: 10,
      });
      setAvailableTenders(data.postings || []);
    } catch (error) {
      console.error('Failed to fetch available tenders:', error);
      setAvailableTenders([]);
    } finally {
      setLoadingTenders(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoadingApplications(true);
      const data = await api.getTenders({ page: appPage, limit: 10 });
      setMyApplications(data.tenders || []);
    } catch (error) {
      console.error('Failed to fetch my tender applications:', error);
      setMyApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenApplicationForm = (tender) => {
    setSelectedTenderPosting(tender);
    // Pre-fill email from localStorage if available
    const userData = localStorage.getItem('bocra_user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        bidderEmail: user.email || '',
      }));
    }
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedTenderPosting) return;

    try {
      setSubmittingApplication(true);

      const submissionData = {
        title: selectedTenderPosting.title,
        bidderName: formData.bidderName,
        bidderEmail: formData.bidderEmail,
        bidderPhone: formData.bidderPhone,
        description: `Tender Reference: ${selectedTenderPosting.tenderNumber}\n\n${formData.description}`,
        estimatedValue: selectedTenderPosting.estimatedValue || 0,
        submittedAmount: parseFloat(formData.submittedAmount) || 0,
      };

      await api.submitTender(submissionData);

      // Reset form
      setFormData({
        bidderName: '',
        bidderEmail: '',
        bidderPhone: '',
        submittedAmount: '',
        description: '',
      });
      setUploadedFiles([]);
      setShowApplicationModal(false);
      setSelectedTenderPosting(null);
      setAppPage(1);
      
      // Re-fetch applications
      await fetchMyApplications();
      
      alert('Tender application submitted successfully!');
    } catch (error) {
      console.error('Failed to submit tender application:', error);
      alert('Error submitting application: ' + error.message);
    } finally {
      setSubmittingApplication(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Closed':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Awarded':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tabs */}
      <div className="flex border-b border-[#1e293b]">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-3 font-black text-sm tracking-tight transition-colors relative ${
            activeTab === 'browse'
              ? 'text-teal-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Browse Tenders
          {activeTab === 'browse' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-400 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('my-applications')}
          className={`px-6 py-3 font-black text-sm tracking-tight transition-colors relative ${
            activeTab === 'my-applications'
              ? 'text-teal-400'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          My Applications
          {activeTab === 'my-applications' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-400 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Browse Tenders Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Available Tenders
            </h2>
            <p className="text-sm text-slate-400">
              {availableTenders.length} tender{availableTenders.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {loadingTenders ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
            </div>
          ) : availableTenders.length > 0 ? (
            <div className="space-y-4">
              {availableTenders.map((tender) => (
                <div
                  key={tender.id}
                  className="bg-[#0a0f1e] border border-[#1e293b] p-6 rounded-[1.5rem] hover:border-[#003366]/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">
                          {tender.title}
                        </h3>
                        <Badge
                          className={`${getStatusColor(tender.status)} text-xs font-black px-2 py-1`}
                        >
                          {tender.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {tender.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-[#1e293b]">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Tender Number
                      </p>
                      <p className="text-sm font-bold text-white">{tender.tenderNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Category
                      </p>
                      <p className="text-sm font-bold text-white">{tender.category}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-slate-500 mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Closes
                        </p>
                        <p className="text-sm font-bold text-white">
                          {formatDate(tender.closingDate)}
                        </p>
                      </div>
                    </div>
                    {tender.estimatedValue && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-slate-500 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Est. Value
                          </p>
                          <p className="text-sm font-bold text-amber-400">
                            ${tender.estimatedValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {tender.location && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{tender.location}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleOpenApplicationForm(tender)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-black uppercase tracking-widest text-xs"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No open tenders available at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* My Applications Tab */}
      {activeTab === 'my-applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white">
              My Tender Applications
            </h2>
            <p className="text-sm text-slate-400">
              {myApplications.length} application{myApplications.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loadingApplications ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
            </div>
          ) : myApplications.length > 0 ? (
            <div className="space-y-4">
              {myApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-[#0a0f1e] border border-[#1e293b] p-6 rounded-[1.5rem] hover:border-[#003366]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-white">
                          {application.title}
                        </h3>
                        <Badge
                          className={`${getApplicationStatusColor(application.status)} text-xs font-black px-2 py-1`}
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        Ref: {application.tenderNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {application.bidderName && (
                      <p className="text-sm text-slate-300">
                        <span className="font-bold text-slate-400">Bidder:</span> {application.bidderName}
                      </p>
                    )}
                    {application.submittedAmount > 0 && (
                      <p className="text-sm text-slate-300">
                        <span className="font-bold text-slate-400">Submitted Amount:</span>{' '}
                        <span className="text-amber-400">${application.submittedAmount.toLocaleString()}</span>
                      </p>
                    )}
                    {application.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {application.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1e293b] text-xs text-slate-500">
                    <p>
                      <span className="font-bold">Submitted:</span>{' '}
                      {formatDate(application.submissionDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">
                You haven't submitted any tender applications yet.
              </p>
              <Button
                onClick={() => setActiveTab('browse')}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-black uppercase tracking-widest text-xs"
              >
                Browse Available Tenders
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedTenderPosting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0f1e] border-b border-[#1e293b] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">
                Submit Tender Application
              </h2>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedTenderPosting(null);
                  setFormData({
                    bidderName: '',
                    bidderEmail: '',
                    bidderPhone: '',
                    submittedAmount: '',
                    description: '',
                  });
                  setUploadedFiles([]);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tender Details Summary */}
              <div className="bg-[#1e293b]/30 border border-[#1e293b] p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">{selectedTenderPosting.title}</h3>
                <p className="text-sm text-slate-400 mb-3">
                  {selectedTenderPosting.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <span className="font-bold">Tender #:</span> {selectedTenderPosting.tenderNumber}
                  </div>
                  <div>
                    <span className="font-bold">Closing:</span> {formatDate(selectedTenderPosting.closingDate)}
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <form onSubmit={handleSubmitApplication} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Company/Bidder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bidderName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bidderName: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-[#1e293b] text-white p-3 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Enter your company/bidder name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.bidderEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bidderEmail: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-900 border border-[#1e293b] text-white p-3 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.bidderPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bidderPhone: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-900 border border-[#1e293b] text-white p-3 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Submitted Amount (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.submittedAmount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          submittedAmount: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-900 border border-[#1e293b] text-white p-3 pl-7 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Proposal Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-[#1e293b] text-white p-3 rounded-lg focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    rows={4}
                    placeholder="Describe your proposal, qualifications, and approach..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-[#1e293b] rounded-lg p-4 text-center hover:border-teal-500/30 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-6 h-6 text-slate-500 mb-2" />
                      <p className="text-sm text-slate-400">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOC, XLSX, PNG, JPG (Max 10MB each)
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-900 p-2 rounded border border-[#1e293b]"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300 truncate">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-slate-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="bg-slate-900/50 border border-[#1e293b] p-4 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 mt-1 accent-teal-500"
                    />
                    <span className="text-sm text-slate-300">
                      I consent to the collection and processing of my personal and company data
                      for the purpose of this tender application in accordance with the Privacy Policy.
                      Data will be retained for up to 5 years for audition purposes.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submittingApplication}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-black uppercase tracking-widest text-sm py-3"
                >
                  {submittingApplication ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TendersView;
