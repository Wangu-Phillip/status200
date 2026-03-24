import React from 'react';
import { Badge } from '../ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Filter, ArrowUpRight, Hash } from 'lucide-react';
import { userApplications } from '../../mockData';
import { getSubmissionsByDepartment, DEPARTMENTS } from '../../utils/persistence';

const ApplicationsView = () => {
  // Merge mock data with live submissions from persistence layer
  const liveSubmissions = getSubmissionsByDepartment(DEPARTMENTS.LICENSING);
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'Under Review': return 'border-teal-500/30 text-teal-400 bg-teal-500/10';
      case 'Pending Review': return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Pending Documents': return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
      case 'Rejected': return 'border-red-500/30 text-red-400 bg-red-500/10';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
          <p className="text-slate-500 mt-2">Manage and track your regulatory license submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#0a0f1e] border border-[#1e293b] rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search apps..." 
              className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Live Submissions from Persistence */}
      {liveSubmissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            Live Submissions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {liveSubmissions.map((sub) => (
              <div key={sub.id} className="bg-[#0a0f1e] border border-[#1e293b] rounded-2xl p-6 hover:border-teal-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-teal-400" />
                    <span className="font-mono font-bold text-teal-400 text-sm">{sub.id}</span>
                  </div>
                  <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(sub.status)}`}>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy Mock Applications */}
      <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl relative w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#1e293b] bg-white/5">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Application ID</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Service Type</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Submission Date</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {userApplications.map((app) => (
              <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-200">{app.id}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-slate-300 font-medium">{app.type}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-slate-500 text-sm">{new Date(app.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </td>
                <td className="px-8 py-6">
                  <Badge variant="outline" className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                    {app.status === 'Approved' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                     app.status === 'Under Review' ? <Clock className="w-3 h-3 mr-1" /> : 
                     <AlertCircle className="w-3 h-3 mr-1" />}
                    {app.status}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsView;
