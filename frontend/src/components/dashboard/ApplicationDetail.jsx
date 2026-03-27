import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, Loader2, Edit2, Trash2, ChevronLeft, Download, Upload, File } from 'lucide-react';
import * as api from '../../services/api';

const ApplicationDetail = ({ applicationId, mode = 'view', onClose, onUpdate, onDelete }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    businessName: '',
    sector: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newUploadedFiles, setNewUploadedFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await api.getApplication(applicationId);
      setApplication(data);
      setFormData({
        businessName: data.businessName || '',
        sector: data.sector || '',
        description: data.description || '',
      });
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewUploadedFiles([]);
    setFilesToDelete([]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      businessName: application.businessName || '',
      sector: application.sector || '',
      description: application.description || '',
    });
    setNewUploadedFiles([]);
    setFilesToDelete([]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setNewUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (docId) => {
    setFilesToDelete(prev => [...prev, docId]);
  };

  const handleUndoRemoveFile = (docId) => {
    setFilesToDelete(prev => prev.filter(id => id !== docId));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('businessName', formData.businessName);
      formDataToSubmit.append('sector', formData.sector);
      formDataToSubmit.append('description', formData.description);
      
      newUploadedFiles.forEach((file) => {
        formDataToSubmit.append('documents', file);
      });
      
      if (filesToDelete.length > 0) {
        formDataToSubmit.append('deleteDocuments', JSON.stringify(filesToDelete));
      }

      const updated = await api.updateApplication(applicationId, formDataToSubmit);
      setApplication(updated);
      setIsEditing(false);
      setNewUploadedFiles([]);
      setFilesToDelete([]);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.deleteApplication(applicationId);
      onDelete?.();
      onClose?.();
    } catch (error) {
      console.error('Failed to delete application:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'border-[#6DC04B]/30 text-[#6DC04B] bg-[#6DC04B]/10';
      case 'Under Review': return 'border-[#0099CC]/30 text-[#0099CC] bg-[#0099CC]/10';
      case 'Pending Review':
      case 'Pending Documents': return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Submitted': return 'border-blue-500/30 text-blue-400 bg-blue-500/10';
      case 'Rejected': return 'border-red-500/30 text-red-400 bg-red-500/10';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/50';
    }
  };

  const canEdit = application && ['Submitted', 'Pending Review', 'Pending Documents'].includes(application.status);
  const canDelete = application && ['Submitted', 'Pending Review', 'Pending Documents'].includes(application.status);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#F47920]" />
          <p className="text-slate-400 mt-4">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Application Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Reference Number</p>
              <p className="text-white font-mono text-lg">{application.referenceNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Status</p>
              <Badge className={`${getStatusStyle(application.status)} px-3 py-1`}>
                {application.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Business Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{application.businessName}</p>
              )}
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Application Type</p>
              <p className="text-white capitalize">{application.applicationType}</p>
            </div>

            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Sector</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-white">{application.sector}</p>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full bg-[#0f1419] border border-[#1e293b] rounded px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-slate-300">{application.description || 'No description provided'}</p>
              )}
            </div>

            <div className="pt-4">
              <p className="text-slate-400 text-sm font-medium mb-3">Attached Documents</p>
              
              {application.documents && application.documents.length > 0 && (
                <div className="space-y-2 mb-4">
                  {application.documents.map((doc) => {
                    const isMarkedForDelete = filesToDelete.includes(doc.id);
                    return (
                      <div 
                        key={doc.id} 
                        className={`flex items-center justify-between bg-[#0f1419] p-3 rounded border border-[#1e293b] ${isMarkedForDelete ? 'opacity-50' : ''}`}
                      >
                        <div className="flex-1">
                          <p className={`text-sm ${isMarkedForDelete ? 'text-slate-500 line-through' : 'text-white'}`}>{doc.filename}</p>
                          <p className="text-slate-500 text-xs">{new Date(doc.uploadedDate).toLocaleDateString()}</p>
                        </div>
                        {isEditing ? (
                          isMarkedForDelete ? (
                            <button type="button" onClick={() => handleUndoRemoveFile(doc.id)} className="p-1 text-blue-400 hover:text-blue-300"><Loader2 className="w-4 h-4" /></button>
                          ) : (
                            <button type="button" onClick={() => handleRemoveExistingFile(doc.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                          )
                        ) : (
                          <button onClick={() => api.downloadDocument(doc.id)} className="p-1 text-orange-500 hover:text-orange-400"><Download size={18} /></button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isEditing && (
                <div className="mb-4">
                  <div className="flex items-center justify-center border-2 border-dashed border-[#1e293b] rounded-lg p-4 hover:border-orange-500/50 cursor-pointer bg-[#111827]">
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload-edit" />
                    <label htmlFor="file-upload-edit" className="flex flex-col items-center justify-center cursor-pointer w-full">
                      <Upload className="w-6 h-6 text-slate-500 group-hover:text-orange-400 mb-1" />
                      <span className="text-xs font-bold text-slate-400">Add more documents</span>
                    </label>
                  </div>

                  {newUploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {newUploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-orange-500/10 p-3 rounded-lg border border-orange-500/30">
                          <div className="flex items-center gap-3">
                            <File className="w-4 h-4 text-orange-400" />
                            <p className="text-sm text-white truncate font-medium">{file.name}</p>
                          </div>
                          <button type="button" onClick={() => handleRemoveNewFile(index)} className="p-1 text-slate-500 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
              <p className="text-red-400 font-medium mb-3">Delete this application?</p>
              <div className="flex gap-2">
                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">Delete</Button>
                <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-6 border-t border-[#1e293b]">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={saving} className="flex-1 bg-orange-600 hover:bg-orange-700">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="flex-1">Cancel</Button>
            </>
          ) : (
            <>
              {canEdit && <Button onClick={handleEdit} className="flex-1 bg-teal-600 hover:bg-teal-700">Edit</Button>}
              {canDelete && <Button onClick={() => setShowDeleteConfirm(true)} className="flex-1 bg-red-600 hover:bg-red-700">Delete</Button>}
              <Button onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600">Close</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
