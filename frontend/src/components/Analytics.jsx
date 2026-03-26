import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const Analytics = ({ userType = 'client' }) => {
  // Mock analytics data
  const clientAnalytics = {
    totalApplications: 5,
    pendingApplications: 2,
    approvedApplications: 2,
    avgProcessingTime: '14 days',
    completionRate: 60,
    recentActivity: 3,
  };

  const adminAnalytics = {
    totalApplicationsThisMonth: 45,
    pendingReview: 12,
    averageResponseTime: '3.5 days',
    userSatisfaction: 92,
    complianceRate: 87,
    activeUsers: 234,
  };

  if (userType === 'admin') {
    return (
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003366]">{adminAnalytics.totalApplicationsThisMonth}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{adminAnalytics.pendingReview}</div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminAnalytics.averageResponseTime}</div>
            <p className="text-xs text-gray-500">Processing time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminAnalytics.activeUsers}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminAnalytics.userSatisfaction}%</div>
            <p className="text-xs text-gray-500">User rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0099CC]">{adminAnalytics.complianceRate}%</div>
            <p className="text-xs text-gray-500">Overall rate</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Processing Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#003366]">{clientAnalytics.avgProcessingTime}</div>
          <p className="text-xs text-gray-500">Average for your applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{clientAnalytics.completionRate}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${clientAnalytics.completionRate}%` }}></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{clientAnalytics.recentActivity}</div>
          <p className="text-xs text-gray-500">Updates in last 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
