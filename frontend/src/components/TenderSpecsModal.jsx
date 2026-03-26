import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  AlertCircle,
  Download,
  Clock,
  ChevronRight,
  LogIn,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TenderSpecsModal = ({ tender, isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !tender) return null;

  const handleApply = () => {
    navigate('/tender-submission', { state: { selectedTenderId: tender.id } });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleRegisterRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-[10000]">
        <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-[10001] bg-[#003366] text-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-black tracking-tight mb-2">{tender.title}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-200">
                    {tender.id}
                  </span>
                  <Badge className={`text-[10px] font-black uppercase tracking-widest border-none ${
                    tender.status === 'Open' ? 'bg-[#2E7D32]/20 text-[#2E7D32]' : 'bg-slate-800/50 text-slate-300'
                  }`}>
                    {tender.status}
                  </Badge>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/10 transition-colors p-2 rounded-lg flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            {/* Overview Section */}
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00897B]" />
                Tender Overview
              </h3>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  {tender.description}
                </p>
              </div>
            </section>

            {/* Key Information Grid */}
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#00897B]" />
                Key Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Closing Date */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-[#00897B]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Closing Date</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{tender.closingDate}</p>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-[#00897B]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Location</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{tender.location}</p>
                </div>

                {/* Category */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-[#00897B]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Category</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{tender.category}</p>
                </div>

                {/* Tender Type */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-[#00897B]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Tender Type</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{tender.type}</p>
                </div>

                {/* Estimated Value */}
                {tender.estimatedValue && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-[#00897B]" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-600">Estimated Value</p>
                    </div>
                    <p className="text-xl font-black text-slate-900">
                      {typeof tender.estimatedValue === 'number' 
                        ? `P${tender.estimatedValue.toLocaleString()}`
                        : tender.estimatedValue
                      }
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-[#00897B]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Status</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] font-black uppercase tracking-widest border-none ${
                      tender.status === 'Open' 
                        ? 'bg-[#2E7D32]/20 text-[#2E7D32]' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {tender.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents Section */}
            {tender.documents && tender.documents.length > 0 && (
              <section>
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-[#00897B]" />
                  Related Documents
                </h3>
                <div className="space-y-3">
                  {tender.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{doc.filename || 'Document'}</p>
                          <p className="text-xs text-slate-600">{doc.fileType || 'File'}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Authentication Section */}
            {!user ? (
              <section>
                <div className="bg-gradient-to-r from-[#00897B]/10 to-[#0097A7]/10 rounded-2xl p-8 border-2 border-[#00897B]/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <LogIn className="h-8 w-8 text-[#00897B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 mb-2">Login Required to Apply</h4>
                      <p className="text-slate-700 mb-6 leading-relaxed">
                        To submit your bid for this tender, you need to have an active account on the BOCRA Portal. 
                        If you don't have an account yet, you can easily register in just a few minutes. We keep your 
                        information secure and confidential.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleLoginRedirect}
                          className="bg-[#00897B] hover:bg-[#4DB6AC] text-white rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
                        >
                          <LogIn className="h-4 w-4" />
                          Login to Your Account
                        </Button>
                        <Button
                          onClick={handleRegisterRedirect}
                          variant="outline"
                          className="border-2 border-[#00897B] text-[#00897B] rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-[#00897B]/5"
                        >
                          <UserPlus className="h-4 w-4" />
                          Create New Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section>
                <div className="bg-gradient-to-r from-[#2E7D32]/10 to-[#388E3C]/10 rounded-2xl p-8 border-2 border-[#2E7D32]/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-[#2E7D32]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 mb-2">Ready to Submit Your Bid?</h4>
                      <p className="text-slate-700 mb-6 leading-relaxed">
                        You're logged in as <span className="font-semibold text-slate-900">{user.email || user.name}</span>. 
                        Click the button below to proceed with your tender application. You'll have the opportunity to 
                        upload required documents and provide additional information.
                      </p>
                      <Button
                        onClick={handleApply}
                        className="bg-[#2E7D32] hover:bg-[#388E3C] text-white rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-lg shadow-green-900/20"
                      >
                        Apply Now
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Important Notes */}
            <section>
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-amber-900 mb-2">Important Notes</h4>
                    <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
                      <li>Ensure all required documents are submitted before the closing date</li>
                      <li>Technical specifications must be met to qualify for evaluation</li>
                      <li>Late applications will not be accepted</li>
                      <li>Keep your application reference number for tracking purposes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-[10001] bg-slate-50 border-t border-slate-200 p-6 flex justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderSpecsModal;
