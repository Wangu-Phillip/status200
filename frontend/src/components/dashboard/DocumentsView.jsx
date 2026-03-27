import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Files, Download, Upload, Search, Filter, FilterIcon, MoreVertical, FileIcon, FileSpreadsheet, FileArchive, FileSearch, Trash2, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import * as api from '../../services/api';

const DocumentsView = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [page]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.getDocuments({ page, limit: 10 });
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      setDeleting(id);
      await api.deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Error deleting document: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      setDownloading(id);
      const data = await api.downloadDocument(id);
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl || `${data.document?.downloadUrl}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Error downloading document: ' + error.message);
    } finally {
      setDownloading(null);
    }
  };

  const getFileIcon = (type) => {
    const iconClass = 'w-6 h-6';
    if (type?.toLowerCase().includes('pdf')) return <FileIcon className={`${iconClass} text-rose-400`} />;
    if (type?.toLowerCase().includes('xlsx') || type?.toLowerCase().includes('excel')) return <FileSpreadsheet className={`${iconClass} text-emerald-400`} />;
    if (type?.toLowerCase().includes('zip')) return <FileArchive className={`${iconClass} text-amber-400`} />;
    if (type?.toLowerCase().includes('png') || type?.toLowerCase().includes('jpg') || type?.toLowerCase().includes('image')) return <Files className={`${iconClass} text-blue-400`} />;
    return <Files className={`${iconClass} text-slate-400`} />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Documents</h2>
          <p className="text-slate-500 mt-2 leading-relaxed">Access official guidelines, invoices, and your verified regulatory archive ({documents.length}).</p>
        </div>
        <div className="flex items-center space-x-3">
        </div>
      </div>

      <div id="docs-filters" className="grid md:grid-cols-4 gap-4 p-8 bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/[0.03] rounded-full blur-3xl -mr-24 -mt-24"></div>
        
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search documents by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-[#1e293b] rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-700 shadow-inner"
          />
        </div>
        
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-[#111827] border border-[#1e293b] rounded-2xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 shadow-inner appearance-none cursor-pointer">
          <option value="all">All Categories</option>
          <option value="application">Application</option>
          <option value="complaint">Complaint</option>
          <option value="other">Other</option>
        </select>

        <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-2xl text-slate-400 hover:text-white transition-all text-sm font-bold shadow-inner active:scale-95">
          <FilterIcon className="w-4 h-4" />
          <span>Advanced filters</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-[#0a0f1e] border border-[#1e293b] p-8 rounded-[2.5rem] hover:border-teal-500/30 transition-all group cursor-pointer relative overflow-hidden shadow-2xl active:scale-[0.98]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/10 transition-all"></div>
              
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-slate-900 border border-[#1e293b] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {getFileIcon(doc.documentType)}
                  </div>
                  <div className="max-w-[200px]">
                    <p className="font-bold text-slate-100 group-hover:text-teal-400 transition-colors truncate">{doc.filename}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px] uppercase font-bold tracking-widest capitalize">{doc.category}</Badge>
                      <span className="text-slate-600 text-[10px] uppercase font-bold tracking-tighter">• {doc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleDownload(doc.id, doc.filename)}
                    disabled={downloading === doc.id}
                    className="p-3 bg-slate-900 border border-slate-700/50 rounded-xl text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all shadow-lg active:scale-90 disabled:opacity-50"
                  >
                    {downloading === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleting === doc.id}
                    className="p-3 bg-slate-900 border border-slate-700/50 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shadow-lg active:scale-90 disabled:opacity-50"
                  >
                    {deleting === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#1e293b]">
                 <div className="flex items-center space-x-4">
                    {doc.status === 'verified' && (
                      <div className="flex items-center text-emerald-400 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Verified
                      </div>
                    )}
                    <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {doc.uploadedDate ? `Modified: ${new Date(doc.uploadedDate).toLocaleDateString()}` : `Created: ${new Date(doc.createdAt).toLocaleDateString()}`}
                    </div>
                 </div>
                 <button className="p-2 text-slate-700 hover:text-slate-400 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem]">
          <Files className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-500">No documents found. {searchTerm && 'Try adjusting your search.'}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsView;
