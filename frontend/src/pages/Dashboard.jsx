import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { FileText, AlertCircle, Upload, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { userApplications, userComplaints } from '../mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('bocra_user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Approved': { variant: 'default', icon: CheckCircle, className: 'bg-green-500 hover:bg-green-600' },
      'Under Review': { variant: 'default', icon: Clock, className: 'bg-blue-500 hover:bg-blue-600' },
      'Pending Documents': { variant: 'default', icon: AlertCircle, className: 'bg-yellow-500 hover:bg-yellow-600' },
      'Rejected': { variant: 'default', icon: XCircle, className: 'bg-red-500 hover:bg-red-600' },
      'In Progress': { variant: 'default', icon: Clock, className: 'bg-blue-500 hover:bg-blue-600' },
      'Resolved': { variant: 'default', icon: CheckCircle, className: 'bg-green-500 hover:bg-green-600' },
      'Pending Review': { variant: 'default', icon: Clock, className: 'bg-orange-500 hover:bg-orange-600' },
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name}</h1>
          <p className="text-lg text-gray-600">{user.organization || 'Client Portal'}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">{userApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {userApplications.filter(app => app.status === 'Approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {userApplications.filter(app => app.status === 'Under Review').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Complaints Filed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{userComplaints.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
              <div className="flex gap-3">
                <Link to="/type-approval">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Type Approval
                  </Button>
                </Link>
                <Link to="/license-application">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />
                    License Application
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {userApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{app.equipmentName}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">ID: {app.id}</span>
                          <span>•</span>
                          <span>{app.type}</span>
                        </CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-semibold">{app.submittedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Last Updated</p>
                        <p className="font-semibold">{app.lastUpdated}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
              <Link to="/complaints">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  File New Complaint
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {userComplaints.map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{complaint.subject}</CardTitle>
                        <CardDescription>
                          <span className="font-semibold">ID: {complaint.id}</span> • Against: {complaint.operator}
                        </CardDescription>
                      </div>
                      {getStatusBadge(complaint.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-semibold">{complaint.submittedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Operator</p>
                        <p className="font-semibold">{complaint.operator}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    Upload Your First Document
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

export default Dashboard;
