import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Calendar, DollarSign, FileText, Download, User, Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TenderDetailModal = ({ tender, onClose }) => {
  if (!tender) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Under Review</Badge>;
      case 'Rejected':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending Review</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl rounded-[2rem] bg-white animate-in zoom-in duration-300">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8 border-b sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl font-black text-slate-900 leading-tight">
                {tender.subject || tender.title}
              </CardTitle>
              {getStatusBadge(tender.status)}
            </div>
            <CardDescription className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-[#003366]">
                <FileText className="h-4 w-4" />
                ID: {tender.id || tender.referenceNumber}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-4 w-4" />
                Submitted: {new Date(tender.submittedDate || tender.createdAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-full hover:bg-slate-100/50"
          >
            <X className="h-6 w-6 text-slate-400" />
          </Button>
        </CardHeader>

        <CardContent className="p-8 space-y-10">
          {/* Main Info Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" /> Applicant Information
                </h3>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="font-bold text-slate-900 mb-1">{tender.citizenName || 'N/A'}</p>
                  <p className="text-sm text-slate-500">{tender.citizenEmail || 'N/A'}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Submission Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Company</p>
                    <p className="font-bold text-[#003366] truncate">{tender.companyName || tender.companyHouse || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Priority</p>
                    <p className="font-bold text-slate-900">{tender.priority || 'Medium'}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Supporting Documents
                </h3>
                <div className="space-y-3">
                  {tender.documents && tender.documents.length > 0 ? (
                    tender.documents.map((doc, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#003366] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#003366]/10 group-hover:text-[#003366] transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">{(doc.size / 1024).toFixed(1)} KB • {doc.name.split('.').pop().toUpperCase()}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-[#003366]/10 hover:text-[#003366]">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 font-medium">No documents attached</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Description Section */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              Description & Requirements
            </h3>
            <div className="prose prose-slate max-w-none text-slate-600 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 leading-relaxed font-medium">
              {tender.description || 'No detailed description provided.'}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t font-black uppercase text-xs tracking-widest">
            <Button variant="outline" className="flex-1 h-14 rounded-[1.25rem] border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300" onClick={onClose}>
              Cancel Review
            </Button>
            {tender.status !== 'Approved' && (
              <Button className="flex-1 h-14 rounded-[1.25rem] bg-[#003366] hover:bg-[#003366]/90 text-white shadow-xl shadow-[#003366]/20 transition-all duration-300">
                <CheckCircle className="w-5 h-5 mr-3" /> Approve Tender
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderDetailModal;
