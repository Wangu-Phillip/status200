import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  MoreVertical,
  Calendar,
  User,
  Hash,
  ArrowUpRight,
  Shield,
  Loader2
} from 'lucide-react';
import * as api from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const AdminLicensingView = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getSubmissions({ department: 'licensing', page: 1, limit: 100 });
      setApplications(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch licensing applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load licensing applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Approved</Badge>;
      case 'Under Review':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Under Review</Badge>;
      case 'Rejected':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Pending Review</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Licensing Applications</h2>
          <p className="text-slate-500">Manage and review all regulatory license submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by ID, name or subject..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] w-full md:w-48"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#003366] mx-auto mb-4" />
          <p className="text-slate-500">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No applications found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            {searchTerm || filterStatus !== 'all' 
              ? "Try adjusting your search or filter criteria." 
              : "There are no applications currently in the system."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="overflow-hidden border-slate-200 hover:border-[#003366]/30 transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">{app.subject}</h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Hash className="h-3.5 w-3.5" />
                            <span className="font-mono font-semibold text-[#003366]">{app.id}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {app.citizenName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(app.submittedDate || app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-2 text-sm mb-4">
                      {app.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-2">
                       {app.documents && app.documents.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Docs:</span>
                          {app.documents.slice(0, 3).map((doc, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-slate-50">
                              {doc.name.split('.').pop().toUpperCase()}
                            </Badge>
                          ))}
                          {app.documents.length > 3 && (
                            <span className="text-xs text-slate-400">+{app.documents.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 md:w-48 border-t md:border-t-0 md:border-l border-slate-200 flex flex-row md:flex-col items-center justify-center p-4 gap-3">
                    <Button variant="default" size="sm" className="w-full bg-[#003366] hover:bg-[#003366]/90">
                       Review
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                       Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLicensingView;
