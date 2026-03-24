import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  FileText, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Tenders = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tenders = [
    {
      id: "BOCRA/TEN/001/2024",
      title: "Provision of Quality of Service Monitoring Solutions",
      category: "IT & Telecommunications",
      status: "Open",
      closingDate: "2024-04-15",
      location: "Gaborone, Botswana",
      description: "Invitation for tenders for the supply, installation and commissioning of a nationwide QoS monitoring system for mobile and fixed networks.",
      type: "Public Tender"
    },
    {
      id: "BOCRA/TEN/002/2024",
      title: "Consultancy for Spectrum Management Framework",
      category: "Consultancy",
      status: "Closed",
      closingDate: "2024-03-20",
      location: "Gaborone, Botswana",
      description: "Requests for proposals from qualified consultants to review and update the national spectrum management framework.",
      type: "Request for Proposal"
    },
    {
      id: "BOCRA/TEN/003/2024",
      title: "Supply of Technical Lab Equipment",
      category: "Equipment",
      status: "Open",
      closingDate: "2024-05-10",
      location: "Gaborone, Botswana",
      description: "Bidders are invited to supply and deliver various laboratory testing instruments for technical compliance monitoring.",
      type: "Supply Contract"
    },
    {
      id: "BOCRA/TEN/004/2024",
      title: "Information Security Audit Services",
      category: "IT & Telecommunications",
      status: "Open",
      closingDate: "2024-04-30",
      location: "Remote/Gaborone",
      description: "Annual security audit of internal systems and regional communication infrastructure.",
      type: "Services"
    }
  ];

  const categories = ['All', 'IT & Telecommunications', 'Consultancy', 'Equipment', 'Services'];

  const filteredTenders = tenders.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-20 pt-28">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0 scale-110">
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
          <div className="absolute inset-0 basket-pattern opacity-[0.03] text-teal-500 z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-20 relative z-20">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge className="mb-6 bg-teal-600/20 text-teal-400 border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              Procurement Portal
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
              Tenders & <br />
              Contracts<span className="text-teal-500">.</span>
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
              Explore strategic procurement opportunities with BOCRA. We are committed to transparency, competition, and excellence in all regulatory ventures.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-20">
        {/* Filters & Search */}
        <div className="bg-[#0a0f1e]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] mb-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#00897B] text-white shadow-lg shadow-teal-900/40' 
                    : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tender reference..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-slate-700 focus:ring-2 focus:ring-[#00897B] outline-none transition-all text-white"
            />
          </div>
        </div>

        {/* Tenders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTenders.length > 0 ? (
            filteredTenders.map((tender, i) => (
              <div 
                key={tender.id} 
                className="bg-[#0a0f1e] border border-white/5 p-10 rounded-[3rem] group hover:border-[#00897B]/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/10 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8 relative">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00897B] mb-2">{tender.id}</span>
                    <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-[#4DB6AC] transition-colors leading-tight max-w-md">
                      {tender.title}
                    </h3>
                  </div>
                  <Badge className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${
                    tender.status === 'Open' ? 'bg-[#2E7D32]/20 text-[#2E7D32]' : 'bg-slate-800/50 text-slate-500'
                  }`}>
                    {tender.status}
                  </Badge>
                </div>

                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-lg">
                  {tender.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-teal-900/30 group-hover:text-teal-400 transition-all">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Closing Date</p>
                      <p className="text-sm font-bold text-slate-300">{tender.closingDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-all">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Location</p>
                      <p className="text-sm font-bold text-slate-300">{tender.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 relative">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-white/10 text-slate-500">
                      {tender.type}
                    </Badge>
                  </div>
                  <Button className="bg-[#00897B] hover:bg-[#4DB6AC] text-white rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-900/20 group-hover:scale-105 transition-all">
                    View Specs
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2 py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">No Tenders Found</h3>
              <p className="text-slate-500 font-medium tracking-tight">Try adjusting your search or filters to see more results.</p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-20 bg-[#00695C]/10 border border-[#00695C]/30 p-12 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00695C]/20 blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">
                Need Procurement Assistance?
              </h2>
              <p className="text-slate-400 font-medium">
                Our procurement team is available to assist you with system registration, document submission, and technical inquiries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button variant="outline" className="h-16 px-10 rounded-[1.25rem] border-white/10 bg-transparent text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                Download Guide
              </Button>
              <Button className="h-16 px-10 rounded-[1.25rem] bg-[#00897B] text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#4DB6AC] shadow-2xl shadow-teal-900/40 transition-all">
                Contact Unit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenders;
