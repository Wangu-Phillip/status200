import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  User,
  Mail,
  Phone,
  Clock,
  CheckCheck,
  XCircle,
  Send,
  Download,
  AlertCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

const TenderDetailModal = ({
  tender,
  isOpen,
  onClose,
  onAddNote,
  onStatusChange,
  loading,
  adminNote,
  setAdminNote,
}) => {
  const [expandedNote, setExpandedNote] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !tender) return null;

  // Log tender data for debugging
  console.log('TenderDetailModal - tender object:', tender);
  console.log('TenderDetailModal - documents:', tender.documents);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Under Review':
        return 'bg-blue-500 text-white';
      case 'Submitted':
        return 'bg-amber-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const calculateBidDifference = () => {
    if (tender.estimatedValue && tender.submittedAmount) {
      const difference = tender.submittedAmount - tender.estimatedValue;
      const percentage = ((difference / tender.estimatedValue) * 100).toFixed(2);
      return {
        difference,
        percentage,
        isOver: difference > 0,
      };
    }
    return null;
  };

  const bidDifference = calculateBidDifference();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className={`flex justify-end ${isFullscreen ? 'h-screen' : ''}`}>
        <div className={`relative bg-white shadow-xl overflow-y-auto transition-all ${
          isFullscreen 
            ? 'w-full h-full' 
            : 'w-full max-w-2xl max-h-screen'
        }`}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-[#003366] text-white p-6 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{tender.subject}</h2>
                <Badge className={`${getStatusBadge(tender.status)}`}>
                  {tender.status}
                </Badge>
              </div>
              <p className="text-slate-200 text-sm">
                Reference: <span className="font-mono font-semibold">{tender.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="text-slate-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Tender Posting Details */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#003366]" />
                Tender Posting Details
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Tender Number
                    </p>
                    <p className="text-sm font-mono font-semibold text-slate-900">
                      {tender.token || tender.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Category
                    </p>
                    <p className="text-sm text-slate-900">{tender.description}</p>
                  </div>
                  {tender.submittedDate && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Submitted Date
                      </p>
                      <p className="text-sm text-slate-900">{tender.submittedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Bidder Information */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#003366]" />
                Bidder Information
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {tender.citizenName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${tender.citizenEmail}`}
                      className="text-sm text-[#003366] hover:underline"
                    >
                      {tender.citizenEmail}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Details */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#003366]" />
                Financial Details
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                {tender.submittedAmount && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Bid Amount
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${tender.submittedAmount?.toLocaleString()} BWP
                      </p>
                    </div>
                  </div>
                )}
                {tender.estimatedValue && (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Estimated Value
                      </p>
                      <p className="text-lg font-semibold text-slate-700">
                        ${tender.estimatedValue?.toLocaleString()} BWP
                      </p>
                    </div>
                    {bidDifference && (
                      <div
                        className={`text-right ${
                          bidDifference.isOver ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase mb-1">
                          Difference
                        </p>
                        <p className="text-lg font-bold">
                          {bidDifference.isOver ? '+' : '-'}${Math.abs(
                            bidDifference.difference
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs font-semibold">
                          ({bidDifference.isOver ? '+' : '-'}
                          {Math.abs(bidDifference.percentage)}%)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Review Information */}
            {tender.reviewedBy && (
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#003366]" />
                  Review Information
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-3">
                  <CheckCheck className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Reviewed by <span className="font-bold">{tender.reviewedBy}</span>
                    </p>
                    <p className="text-xs text-blue-700">
                      {tender.reviewedAt}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Admin Notes */}
            {tender.adminNotes && (
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Admin Notes
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {tender.adminNotes}
                  </p>
                </div>
              </section>
            )}

            {/* Documents */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#003366]" />
                Documents ({tender.documents?.length || 0})
              </h3>
              {tender.documents && tender.documents.length > 0 ? (
                <div className="space-y-2">
                  {tender.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {doc.filename || 'Document'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doc.documentType && `${doc.documentType}`}
                            {doc.documentType && doc.uploadedDate && ' • '}
                            {doc.uploadedDate && `${new Date(doc.uploadedDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      {doc.filePath && (
                        <a
                          href={doc.filePath}
                          download
                          className="text-[#003366] hover:text-[#002244] transition-colors p-2 hover:bg-white rounded"
                          title="Download document"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      {!doc.filePath && (
                        <span className="text-xs text-slate-400 px-2">
                          No file link
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-center">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No documents uploaded for this tender application.</p>
                </div>
              )}
            </section>

            {/* Full Description */}
            {tender.description && (
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Budget Proposal
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-3">
                    {tender.description}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Footer - Action buttons */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 space-y-3">
            {/* Notes Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                Add Admin Note
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add internal note..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  disabled={loading}
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  disabled={loading || !adminNote.trim()}
                  onClick={() => onAddNote(tender.id)}
                  className="bg-[#003366] hover:bg-[#002244] text-white gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Save Note
                </Button>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                Change Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tender.status === 'Submitted' && (
                  <>
                    <Button
                      size="sm"
                      disabled={loading}
                      className="bg-[#003366] hover:bg-[#002244] text-white"
                      onClick={() => onStatusChange(tender.id, 'Under Review')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Start Review
                    </Button>
                  </>
                )}
                {(tender.status === 'Submitted' ||
                  tender.status === 'Under Review') && (
                  <>
                    <Button
                      size="sm"
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => onStatusChange(tender.id, 'Approved')}
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      disabled={loading}
                      variant="destructive"
                      onClick={() => onStatusChange(tender.id, 'Rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {(tender.status === 'Approved' ||
                  tender.status === 'Rejected') && (
                  <Button
                    size="sm"
                    disabled={loading}
                    className="bg-[#003366] hover:bg-[#002244] text-white"
                    onClick={() => onStatusChange(tender.id, 'Submitted')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Reopen
                  </Button>
                )}
              </div>
            </div>

            {/* Close Button */}
            <Button
              variant="outline"
              className="w-full text-slate-600 border-slate-200"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetailModal;
