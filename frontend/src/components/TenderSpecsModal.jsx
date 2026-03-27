import React from 'react';
import { 
  X, 
  Download, 
  Calendar, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const TenderSpecsModal = ({ tender, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!tender) return null;

  const handleApply = () => {
    navigate('/tender-submission', { state: { tenderNumber: tender.id, title: tender.title } });
    onClose();
  };

  const getFullDocUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    return `${API_URL.replace('/api', '')}/${path}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#0a101f] border-white/5 text-slate-100 rounded-[2.5rem] overflow-hidden p-0 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <DialogHeader className="p-10 pb-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <Badge className="w-fit mb-4 bg-teal-600/20 text-teal-400 border-teal-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Tender Ref: {tender.id}
              </Badge>
              <DialogTitle className="text-3xl font-black tracking-tight text-white mb-2 leading-tight">
                {tender.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-base font-medium">
                {tender.category} • {tender.type}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-10 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-900/30 text-teal-400 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Closing Date</p>
                <p className="text-sm font-bold text-slate-200">{tender.closingDate}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</p>
                <p className="text-sm font-bold text-slate-200">{tender.location}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-900/30 text-amber-400 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Value</p>
                <p className="text-sm font-bold text-slate-200">{tender.estimatedValue || 'Undisclosed'}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-teal-400" />
              Project Description
            </h4>
            <div className="text-slate-400 text-sm leading-relaxed p-6 bg-slate-900/30 rounded-2xl border border-white/5">
              {tender.description}
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Tender Documents
            </h4>
            {tender.documents && tender.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tender.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                        <Download className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{doc.name}</span>
                    </div>
                    <a 
                      href={getFullDocUrl(doc.path)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-900/20 rounded-2xl border border-dashed border-white/10">
                <p className="text-slate-500 text-xs font-medium italic">No downloadable documents available for this tender.</p>
              </div>
            )}
          </div>

          {/* Compliance Badge */}
          <div className="flex items-center gap-3 p-4 bg-teal-600/5 rounded-2xl border border-teal-500/20">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-[10px] font-bold text-teal-100/70 leading-relaxed">
              BOCRA verifies all procurement opportunities. Ensure your company profile is up to date before submitting a proposal.
            </p>
          </div>
        </div>

        <DialogFooter className="p-10 pt-6">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-8 h-14 rounded-2xl border-white/10 bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
            >
              Close Details
            </Button>
            <Button 
              onClick={handleApply}
              disabled={tender.status !== 'Open'}
              className="px-10 h-14 rounded-2xl bg-[#00897B] text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#4DB6AC] shadow-2xl shadow-teal-900/40"
            >
              Proceed to Application
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenderSpecsModal;
