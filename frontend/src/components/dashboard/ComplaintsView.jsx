import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageSquare, Clock, Filter, Search, MessageCircle, AlertCircle, Hash, CheckCircle, Plus, Loader2, X } from 'lucide-react';
import * as api from '../../services/api';

const ComplaintTimeline = ({ status }) => {
  const steps = ['Registered', 'Acknowledged', 'In Progress', 'Resolved'];
  const statusMap = {
    'Registered': 0,
    'Acknowledged': 1,
    'In Progress': 2,
    'Resolved': 3,
    'Closed': 3,
  };
  const currentStep = statusMap[status] ?? 0;
  
  return (
    <div className="flex items-center w-full mt-8 space-x-2">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-3 h-3 rounded-full mb-2 ${idx <= currentStep ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-800 border border-slate-700'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${idx <= currentStep ? 'text-orange-400' : 'text-slate-600'}`}>{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-[2px] flex-1 mb-5 ${idx < currentStep ? 'bg-orange-500/50' : 'bg-slate-800'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ComplaintsView = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [formData, setFormData] = useState({
    complaintType: '',
    againstOperator: '',
    description: '',
    dateOfIncident: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getComplaints({ page, limit: 10 });
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.submitComplaint({
        ...formData,
        dateOfIncident: new Date(formData.dateOfIncident),
      });
      setFormData({ complaintType: '', againstOperator: '', description: '', dateOfIncident: new Date().toISOString().split('T')[0] });
      setShowNewComplaintForm(false);
      setPage(1);
      await fetchComplaints();
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      alert('Error submitting complaint: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.againstOperator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'In Progress': return 'border-blue-500/30 text-blue-400 bg-blue-500/10';
      case 'Acknowledged': return 'border-teal-500/30 text-teal-400 bg-teal-500/10';
      case 'Closed': return 'border-red-500/30 text-red-400 bg-red-500/10';
      default: return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Complaints</h2>
          <p className="text-slate-500 mt-2">Log and monitor consumer disputes with service providers ({complaints.length})</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="flex items-center space-x-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold text-sm" onClick={() => setShowNewComplaintForm(true)}>
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </Button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold shadow-lg">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-700 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* New Complaint Form Modal */}
      {showNewComplaintForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-100">File New Complaint</h3>
              <button onClick={() => setShowNewComplaintForm(false)} className="p-2 hover:bg-slate-800/50 rounded-lg transition-all">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Complaint Type *</label>
                <select value={formData.complaintType} onChange={(e) => setFormData({...formData, complaintType: e.target.value})} required className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Select type...</option>
                  <option value="service_quality">Service Quality</option>
                  <option value="billing">Billing Issue</option>
                  <option value="customer_service">Customer Service</option>
                  <option value="network">Network Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Against Operator *</label>
                <input type="text" value={formData.againstOperator} onChange={(e) => setFormData({...formData, againstOperator: e.target.value})} required placeholder="Operator name" className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Date of Incident</label>
                <input type="date" value={formData.dateOfIncident} onChange={(e) => setFormData({...formData, dateOfIncident: e.target.value})} className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Provide details about your complaint..." rows="5" className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-orange-500 outline-none text-sm resize-none"/>
              </div>
              <div className="flex gap-4 justify-end pt-6 border-t border-[#1e293b]">
                <Button variant="outline" onClick={() => setShowNewComplaintForm(false)} className="rounded-xl px-6 py-3">Cancel</Button>
                <Button className="bg-orange-600 hover:bg-orange-500 rounded-xl px-6 py-3 text-white font-bold" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden cursor-default hover:bg-white/[0.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-all"></div>
              
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10 group-hover:rotate-6 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-200">{complaint.ticketNumber}</h3>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{complaint.againstOperator}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                  {complaint.status}
                </Badge>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-[#1e293b]">
                  <p className="text-slate-300 text-sm italic leading-relaxed">"{complaint.description || complaint.complaintType}"</p>
                </div>
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center text-slate-500 text-xs space-x-1">
                     <Clock className="w-3.5 h-3.5" />
                     <span>Filed on {new Date(complaint.registeredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   </div>
                   <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${complaint.priority === 'critical' ? 'bg-red-500/10 text-red-400' : complaint.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      <span className="capitalize">{complaint.priority}</span>
                   </div>
                </div>
              </div>

              <div className="border-t border-[#1e293b] pt-4">
                <ComplaintTimeline status={complaint.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem]">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No complaints found. {searchTerm && 'Try adjusting your search.'}</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintsView;
