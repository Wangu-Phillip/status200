import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { adminApplications, qosMetrics } from '../mockData';
import {
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  CheckCheck,
  XCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.userType !== 'admin') {
        navigate('/dashboard');
      } else {
        setUser(parsedUser);
      }
    }
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Approved': { variant: 'default', icon: CheckCircle, className: 'bg-green-500 hover:bg-green-600' },
      'Under Review': { variant: 'default', icon: Clock, className: 'bg-blue-500 hover:bg-blue-600' },
      'Pending Review': { variant: 'default', icon: Clock, className: 'bg-orange-500 hover:bg-orange-600' },
      'Rejected': { variant: 'default', icon: XCircle, className: 'bg-red-500 hover:bg-red-600' },
    };
    const config = statusConfig[status] || statusConfig['Pending Review'];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return <Badge className={`${colors[priority]} hover:${colors[priority]}`}>{priority}</Badge>;
  };

  const filteredApplications = adminApplications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">BOCRA Staff Portal - Application Review & Management</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">{adminApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {adminApplications.filter((app) => app.status === 'Pending Review').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {adminApplications.filter((app) => app.priority === 'High').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Operators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{qosMetrics.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="qos-monitoring">QoS Monitoring</TabsTrigger>
            <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by applicant, equipment, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{app.equipmentName}</CardTitle>
                          {getPriorityBadge(app.priority)}
                        </div>
                        <CardDescription className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-700">Application ID: {app.id}</span>
                          <span>Type: {app.type}</span>
                          <span>
                            Applicant: {app.applicantName} ({app.applicantEmail})
                          </span>
                        </CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-semibold text-sm">{app.submittedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Application Type</p>
                        <p className="font-semibold text-sm">{app.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Priority Level</p>
                        <p className="font-semibold text-sm">{app.priority}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Status</p>
                        <p className="font-semibold text-sm">{app.status}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {app.status === 'Pending Review' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qos-monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Operator QoS Compliance</CardTitle>
                <CardDescription>Real-time monitoring of Quality of Service parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qosMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{metric.operator}</h4>
                          <p className="text-sm text-gray-600">{metric.month}</p>
                        </div>
                        {metric.compliant ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compliant
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Non-Compliant
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Call Success: </span>
                          <span className="font-semibold">{metric.callSuccessRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Speed: </span>
                          <span className="font-semibold">{metric.dataSpeed} Mbps</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Availability: </span>
                          <span className="font-semibold">{metric.networkAvailability}%</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          View Full Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enforcement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enforcement Actions</CardTitle>
                <CardDescription>Track regulatory enforcement and compliance violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No active enforcement actions at this time</p>
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    View Enforcement History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
