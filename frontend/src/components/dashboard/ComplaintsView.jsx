import React from 'react';
import { Badge } from '../ui/badge';
import { MessageSquare, Clock, Filter, Search, MessageCircle, AlertCircle, Hash, CheckCircle } from 'lucide-react';
import { userComplaints } from '../../mockData';
import { getSubmissionsByDepartment, DEPARTMENTS } from '../../utils/persistence';

const ComplaintTimeline = ({ status }) => {
  const steps = ['Submitted', 'Under Review', 'Response Sent', 'Resolved'];
  const statusMap = {
    'Pending Review': 0,
    'Under Review': 1,
    'Approved': 3,
    'Rejected': 3,
    'Submitted': 0,
  };
  const currentStep = statusMap[status] ?? steps.indexOf(status);
  
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
  // Get live complaints from persistence
  const liveComplaints = getSubmissionsByDepartment(DEPARTMENTS.COMPLAINTS);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Complaints</h2>
          <p className="text-slate-500 mt-2">Log and monitor consumer disputes with service providers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold shadow-lg">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-700 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Live Complaints from Persistence */}
      {liveComplaints.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Live Complaints ({liveComplaints.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {liveComplaints.map((sub) => (
              <div key={sub.id} className="bg-[#0a0f1e] border border-[#1e293b] rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-orange-400" />
                    <span className="font-mono font-bold text-orange-400 text-sm">{sub.id}</span>
                  </div>
                  <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    sub.status === 'Approved' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                    sub.status === 'Under Review' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                    sub.status === 'Rejected' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                    'border-amber-500/30 text-amber-400 bg-amber-500/10'
                  }`}>
                    {sub.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-200 mb-1">{sub.subject}</h4>
                <p className="text-slate-500 text-xs">{sub.citizenName} • {sub.submittedDate}</p>
                {sub.reviewedBy && (
                  <div className="mt-3 pt-3 border-t border-[#1e293b]">
                    <p className="text-xs text-slate-500">
                      <span className="text-emerald-400 font-semibold">Reviewed by:</span> {sub.reviewedBy}
                    </p>
                  </div>
                )}
                <ComplaintTimeline status={sub.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy Mock Complaints */}
      <div className="grid md:grid-cols-2 gap-8">
        {userComplaints.map((item) => (
          <div key={item.id} className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden cursor-default hover:bg-white/[0.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-all"></div>
            
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10 group-hover:rotate-6 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-200">{item.id}</h3>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.operator}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest leading-none">
                {item.status}
              </Badge>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-[#1e293b]">
                <p className="text-slate-300 text-sm italic leading-relaxed">"{item.subject}"</p>
              </div>
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center text-slate-500 text-xs space-x-1">
                   <Clock className="w-3.5 h-3.5" />
                   <span>Filed on {new Date(item.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                 </div>
                 <div className="flex items-center text-orange-400 text-xs font-bold bg-orange-500/5 px-2 py-1 rounded-lg">
                    <MessageCircle className="w-3.5 h-3.5 mr-1" />
                    <span>2 Messages</span>
                 </div>
              </div>
            </div>

            <div className="border-t border-[#1e293b] pt-4">
              <ComplaintTimeline status={item.status} />
            </div>

            <button className="mt-8 py-4 w-full bg-[#111827] border border-[#1e293b] rounded-2xl text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all font-bold text-sm shadow-xl flex items-center justify-center space-x-2">
               <span>View Full History</span>
               <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsView;
