import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Filter, ArrowUpRight, Hash, Loader2, Plus, X, Edit2, Trash2 } from 'lucide-react';
import * as api from '../../services/api';
import ApplicationDetail from './ApplicationDetail';

const ApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    applicationType: '',
    businessName: '',
    sector: '',
    description: '',
  });

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getApplications({ page, limit: 10 });
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.submitApplication(formData);
      setFormData({ applicationType: '', businessName: '', sector: '', description: '' });
      setShowNewApplicationForm(false);
      setPage(1);
      await fetchApplications();
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Error submitting application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApplication = async (appId) => {
    try {
      setDeleting(true);
      await api.deleteApplication(appId);
      setDeleteConfirmId(null);
      await fetchApplications();
      alert('Application deleted successfully');
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Error deleting application: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditApplication = (appId, e) => {
    e.stopPropagation();
    setSelectedApplicationId(appId);
    setShowDetailModal(true);
  };

  const filteredApplications = applications.filter(app =>
    app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'border-[#6DC04B]/30 text-[#6DC04B] bg-[#6DC04B]/10';
      case 'Under Review': return 'border-[#0099CC]/30 text-[#0099CC] bg-[#0099CC]/10';
      case 'Pending Review': return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Pending Documents': return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Rejected': return 'border-red-500/30 text-red-400 bg-red-500/10';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
          <p className="text-slate-500 mt-2">Manage and track your regulatory license submissions ({applications.length})</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setShowNewApplicationForm(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#003366] hover:bg-[#0099CC] rounded-xl text-white font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </Button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search apps..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-[#0099CC] outline-none transition-all placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* New Application Form Modal */}
      {showNewApplicationForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-100">Submit New Application</h3>
              <button onClick={() => setShowNewApplicationForm(false)} className="p-2 hover:bg-slate-800/50 rounded-lg transition-all">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Application Type *</label>
                <select 
                  value={formData.applicationType} 
                  onChange={(e) => setFormData({...formData, applicationType: e.target.value})} 
                  required 
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                >
                  <option value="">Select application type...</option>
                  <option value="network_license">Network License</option>
                  <option value="service_license">Service License</option>
                  <option value="type_approval">Type Approval</option>
                  <option value="spectrum_license">Spectrum License</option>
                  <option value="broadcasting_license">Broadcasting License</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Business Name *</label>
                <input 
                  type="text" 
                  value={formData.businessName} 
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
                  required 
                  placeholder="Enter your business name"
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Sector *</label>
                <select 
                  value={formData.sector} 
                  onChange={(e) => setFormData({...formData, sector: e.target.value})} 
                  required 
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm"
                >
                  <option value="">Select sector...</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Broadcasting">Broadcasting</option>
                  <option value="Postal">Postal Services</option>
                  <option value="Internet">Internet Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Provide a detailed description of your application..."
                  rows="5" 
                  className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-[#0099CC] outline-none text-sm resize-none"
                />
              </div>

              <div className="flex gap-4 justify-end pt-6 border-t border-[#1e293b]">
                <Button 
                  type="button"
                  onClick={() => setShowNewApplicationForm(false)}
                  variant="outline" 
                  className="rounded-xl px-6 py-3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#003366] hover:bg-[#0099CC] rounded-xl px-6 py-3 text-white font-bold flex items-center" 
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#0099CC]" />
        </div>
      ) : filteredApplications.length > 0 ? (
        <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl relative w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#1e293b] bg-white/5">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Application ID</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Service Type</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Submission Date</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filteredApplications.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#0099CC]/10 rounded-xl flex items-center justify-center text-[#0099CC]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-200">{app.referenceNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-300 font-medium">{app.applicationType || app.type}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-500 text-sm">{new Date(app.submissionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                      {app.status === 'Approved' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                       app.status === 'Under Review' ? <Clock className="w-3 h-3 mr-1" /> : 
                       <AlertCircle className="w-3 h-3 mr-1" />}
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => handleEditApplication(app.id, e)}
                        className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-[#0099CC] hover:bg-[#0099CC]/10 transition-all"
                        title="View details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      {['Submitted', 'Pending Review', 'Pending Documents'].includes(app.status) && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditApplication(app.id, e);
                            }}
                            className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                            title="Edit application"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === app.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteApplication(app.id);
                                }}
                                disabled={deleting}
                                className="px-2 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-bold transition-all"
                              >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs font-bold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(app.id);
                              }}
                              className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Delete application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem]">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No applications found. {searchTerm ? 'Try adjusting your search.' : 'Create your first application to get started.'}</p>
        </div>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplicationId && (
        <ApplicationDetail
          applicationId={selectedApplicationId}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedApplicationId(null);
          }}
          onUpdate={() => fetchApplications()}
          onDelete={() => {
            setShowDetailModal(false);
            fetchApplications();
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsView;
