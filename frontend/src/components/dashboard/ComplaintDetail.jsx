import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, Loader2, Edit2, Trash2, ChevronLeft, Download } from 'lucide-react';
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
    <div className="flex items-center w-full mt-4 space-x-2">
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

const ComplaintDetail = ({ complaintId, onClose, onUpdate, onDelete }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    complaintType: '',
    againstOperator: '',
    description: '',
    dateOfIncident: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const data = await api.getComplaint(complaintId);
      setComplaint(data);
      setFormData({
        complaintType: data.complaintType || '',
        againstOperator: data.againstOperator || '',
        description: data.description || '',
        dateOfIncident: data.dateOfIncident ? new Date(data.dateOfIncident).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Failed to fetch complaint:', error);
      alert('Error loading complaint: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      complaintType: complaint.complaintType || '',
      againstOperator: complaint.againstOperator || '',
      description: complaint.description || '',
      dateOfIncident: complaint.dateOfIncident ? new Date(complaint.dateOfIncident).toISOString().split('T')[0] : '',
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await api.updateComplaint(complaintId, {
        ...formData,
        dateOfIncident: new Date(formData.dateOfIncident),
      });
      setComplaint(updated);
      setIsEditing(false);
      onUpdate?.();
      alert('Complaint updated successfully');
    } catch (error) {
      console.error('Failed to update complaint:', error);
      alert('Error updating complaint: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.deleteComplaint(complaintId);
      setShowDeleteConfirm(false);
      onDelete?.();
      alert('Complaint deleted successfully');
      onClose?.();
    } catch (error) {
      console.error('Failed to delete complaint:', error);
      alert('Error deleting complaint: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const complaintTypeOptions = [
    'service_quality',
    'billing',
    'customer_service',
    'network',
    'other'
  ];

  const canEdit = complaint && ['Registered', 'Acknowledged'].includes(complaint.status);
  const canDelete = complaint && ['Registered', 'Acknowledged'].includes(complaint.status);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-slate-400 mt-4">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg p-8">
          <p className="text-red-400">Failed to load complaint</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg shadow-xl max-w-2xl w-full max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e293b] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Complaint Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Ticket and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Ticket Number</p>
              <p className="text-white font-mono text-lg">{complaint.ticketNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Status</p>
              <Badge className="border-orange-500/30 text-orange-400 bg-orange-500/10 px-3 py-1">
                {complaint.status}
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">Progress</p>
            <ComplaintTimeline status={complaint.status} />
          </div>

          {/* Complaint Details */}
          <div className="space-y-4">
            {/* Complaint Type */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Complaint Type</label>
              {isEditing ? (
                <select
                  value={formData.complaintType}
                  onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select type</option>
                  {complaintTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white capitalize">{complaint.complaintType}</p>
              )}
            </div>

            {/* Against Operator */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Against Operator</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.againstOperator}
                  onChange={(e) => setFormData({ ...formData, againstOperator: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{complaint.againstOperator}</p>
              )}
            </div>

            {/* Date of Incident */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Date of Incident</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dateOfIncident}
                  onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{new Date(complaint.dateOfIncident).toLocaleDateString()}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-slate-300">{complaint.description || 'No description provided'}</p>
              )}
            </div>

            {/* Complainant Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#1e293b]">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Complainant Name</p>
                <p className="text-slate-300">{complaint.complainantName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Complainant Email</p>
                <p className="text-slate-300">{complaint.complainantEmail}</p>
              </div>
            </div>

            {/* Registered Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Registered Date</p>
                <p className="text-slate-300">{new Date(complaint.registeredDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Last Updated</p>
                <p className="text-slate-300">{new Date(complaint.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Documents */}
            {complaint.documents && complaint.documents.length > 0 && (
              <div>
                <p className="text-slate-400 text-sm font-medium mb-3">Attached Documents</p>
                <div className="space-y-2">
                  {complaint.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-[#0f1419] p-3 rounded border border-[#1e293b]">
                      <div className="flex-1">
                        <p className="text-white text-sm">{doc.filename}</p>
                        <p className="text-slate-500 text-xs">{new Date(doc.uploadedDate).toLocaleDateString()}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => api.downloadDocument(doc.id)}
                        className="text-orange-500 hover:text-orange-400"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-6 border-t border-[#1e293b] flex-shrink-0 bg-[#0a0f1e]">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
