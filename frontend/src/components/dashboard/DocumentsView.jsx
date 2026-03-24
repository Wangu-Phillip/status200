import React from 'react';
import { Badge } from '../ui/badge';
import { Files, Download, Upload, Search, Filter, FilterIcon, MoreVertical, FileIcon, FileSpreadsheet, FileArchive, FileSearch, Trash2, CheckCircle, Clock } from 'lucide-react';

const mockDocuments = [
  { id: 1, name: 'Mobile_Licensing_Guidelines_2025.pdf', size: '2.4 MB', type: 'PDF', category: 'Regulatory', date: '2025-01-15' },
  { id: 2, name: 'Invoice_INV-00984.pdf', size: '156 KB', type: 'PDF', category: 'Financial', date: '2025-02-28' },
  { id: 3, name: 'Spectrum_Usage_Report_Q4.xlsx', size: '4.8 MB', type: 'XLSX', category: 'Reports', date: '2025-02-10' },
  { id: 4, name: 'BOCRA_Compliance_Certificate.png', size: '1.1 MB', type: 'PNG', category: 'Certification', date: '2025-01-05' },
  { id: 5, name: 'USF_Rural_Telephony_Phase_2.zip', size: '128 MB', type: 'ZIP', category: 'Projects', date: '2025-03-12' },
  { id: 6, name: 'Consumer_Rights_Charter.pdf', size: '840 KB', type: 'PDF', category: 'Documentation', date: '2024-12-20' },
];

const DocumentsView = () => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileIcon className="w-6 h-6 text-rose-400" />;
      case 'XLSX': return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'ZIP': return <FileArchive className="w-6 h-6 text-amber-400" />;
      case 'PNG': return <Files className="w-6 h-6 text-blue-400" />;
      default: return <Files className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Documents</h2>
          <p className="text-slate-500 mt-2 leading-relaxed">Access official guidelines, invoices, and your verified regulatory archive.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition-all text-sm font-bold shadow-xl shadow-teal-500/20 active:scale-95 group">
            <Upload className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      <div id="docs-filters" className="grid md:grid-cols-4 gap-4 p-8 bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/[0.03] rounded-full blur-3xl -mr-24 -mt-24"></div>
        
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search documents by name or category..." 
            className="w-full bg-[#111827] border border-[#1e293b] rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-700 shadow-inner"
          />
        </div>
        
        <select className="bg-[#111827] border border-[#1e293b] rounded-2xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 shadow-inner appearance-none cursor-pointer">
          <option>All Categories</option>
          <option>Regulatory</option>
          <option>Financial</option>
          <option>Certification</option>
        </select>

        <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-2xl text-slate-400 hover:text-white transition-all text-sm font-bold shadow-inner active:scale-95">
          <FilterIcon className="w-4 h-4" />
          <span>Advanced filters</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="bg-[#0a0f1e] border border-[#1e293b] p-8 rounded-[2.5rem] hover:border-teal-500/30 transition-all group cursor-pointer relative overflow-hidden shadow-2xl active:scale-[0.98]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/10 transition-all"></div>
            
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-slate-900 border border-[#1e293b] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {getFileIcon(doc.type)}
                </div>
                <div className="max-w-[200px]">
                  <p className="font-bold text-slate-100 group-hover:text-teal-400 transition-colors truncate">{doc.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px] uppercase font-bold tracking-widest">{doc.category}</Badge>
                    <span className="text-slate-600 text-[10px] uppercase font-bold tracking-tighter">• {doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-slate-900 border border-slate-700/50 rounded-xl text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all shadow-lg active:scale-90">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 bg-slate-900 border border-slate-700/50 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shadow-lg active:scale-90">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#1e293b]">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center text-emerald-400 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Verified
                  </div>
                  <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Modified: {new Date(doc.date).toLocaleDateString()}
                  </div>
               </div>
               <button className="p-2 text-slate-700 hover:text-slate-400 transition-colors">
                  <MoreVertical className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsView;
