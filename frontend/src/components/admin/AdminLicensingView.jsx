import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, CheckCircle, AlertCircle, Search, Filter, Loader2, X, MessageSquare, Clock } from 'lucide-react';
import * as api from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const AdminLicensingView = ({ user }) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/admin/submissions?department=licensing&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('bocra_token')}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.submissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch license applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load license applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (token, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/admin/submissions/${token}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bocra_token')}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: `Application status changed to ${newStatus}`,
        });
        await fetchApplications();
        if (selectedApp?.id === token) {
          setSelectedApp(null);
          setShowDetailModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleAddNote = async () => {
    if (!adminNote.trim()) return;

    try {
      setSubmittingNote(true);
      const response = await fetch(
        `${API_URL}/admin/submissions/${selectedApp.id}/notes`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bocra_token')}`,
          },
          body: JSON.stringify({ adminNotes: adminNote }),
        }
      );

      if (response.ok) {
        toast({
          title: 'Note Added',
          description: 'Admin note has been added',
        });
        setAdminNote('');
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive',
      });
    } finally {
      setSubmittingNote(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.citizenEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Under Review': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'Pending Documents': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">License Applications</h2>
        <p className="text-slate-400">Manage and review citizen license applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="Under Review">Under Review</option>
          <option value="Pending Documents">Pending Documents</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-teal-400 mx-auto" />
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Organization</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">License Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-[#1e293b] hover:bg-[#111827]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-teal-400">{app.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{app.businessName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{app.user?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500">{app.citizenEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{app.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`border ${getStatusBadge(app.status)} text-xs font-bold`}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{app.submittedDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNote(app.adminNotes || '');
                          setShowDetailModal(true);
                        }}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-lg"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No license applications found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">License Application Review</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-800/50 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Application Details */}
            <div className="space-y-6 mb-8">
              <div className="bg-[#111827] rounded-xl p-6">
                <h4 className="font-bold text-slate-200 mb-4">Application Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Reference</span>
                    <span className="font-mono font-bold text-teal-400">{selectedApp.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Status</span>
                    <Badge className={`border ${getStatusBadge(selectedApp.status)}`}>
                      {selectedApp.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Organization</span>
                    <span className="text-slate-300 font-semibold">{selectedApp.businessName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">License Type</span>
                    <span className="text-slate-300">{selectedApp.subject}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Submitted Date</span>
                    <span className="text-slate-300">{selectedApp.submittedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">Email</span>
                    <span className="text-slate-300">{selectedApp.citizenEmail}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] rounded-xl p-6">
                <h4 className="font-bold text-slate-200 mb-4">Application Details</h4>
                <p className="text-slate-400 whitespace-pre-wrap text-sm">{selectedApp.description}</p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-4 mb-8 border-t border-[#1e293b] pt-6">
              <h4 className="font-bold text-slate-200">Admin Actions</h4>
              <div className="flex flex-wrap gap-2">
                {['Under Review', 'Pending Documents', 'Approved', 'Rejected'].map(status => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(selectedApp.id, status)}
                    variant={selectedApp.status === status ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs rounded-lg ${
                      selectedApp.status === status
                        ? 'bg-teal-600 text-white'
                        : 'border-[#1e293b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mark as {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-3 border-t border-[#1e293b] pt-6">
              <h4 className="font-bold text-slate-200">Admin Notes</h4>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add internal notes about this application..."
                rows={4}
                className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-slate-200 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
              />
              <Button
                onClick={handleAddNote}
                disabled={submittingNote || !adminNote.trim()}
                className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-6"
              >
                {submittingNote ? 'Saving...' : 'Save Note'}
              </Button>
            </div>

            {/* Close Button */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                onClick={() => setShowDetailModal(false)}
                variant="outline"
                className="rounded-xl border-[#1e293b]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLicensingView;
