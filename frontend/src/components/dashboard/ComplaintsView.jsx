import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { MessageSquare, Clock, Filter, Search, MessageCircle, AlertCircle } from 'lucide-react';
import { userComplaints } from '../../mockData';

const ComplaintTimeline = ({ status }) => {
  const steps = ['Submitted', 'Under Review', 'Response Sent', 'Resolved'];
  const currentStep = steps.indexOf(status);
  
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

      <div className="grid md:grid-cols-2 gap-8">
        {userComplaints.map((item) => (
          <div key={item.id} className="bg-[#0a0f1e] border border-[#1e293b] rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden active:scale-95 cursor-pointer cursor-default hover:bg-white/[0.02]">
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
