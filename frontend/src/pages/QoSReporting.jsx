import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { qosMetrics } from '../mockData';
import { BarChart, TrendingUp, TrendingDown, Activity, Download, CheckCircle, XCircle } from 'lucide-react';

const QoSReporting = () => {
  const [selectedMonth, setSelectedMonth] = useState('February 2025');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Quality of Service (QoS) Reporting</h1>
          <p className="text-lg text-gray-600">
            Monitor and review Quality of Service performance metrics for licensed operators
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Total Operators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#003366]">{qosMetrics.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {qosMetrics.filter((m) => m.compliant).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                Non-Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {qosMetrics.filter((m) => !m.compliant).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Avg Data Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#003366]">
                {(qosMetrics.reduce((sum, m) => sum + m.dataSpeed, 0) / qosMetrics.length).toFixed(1)} Mbps
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Operator Performance Summary</CardTitle>
                    <CardDescription>Quality of Service metrics for {selectedMonth}</CardDescription>
                  </div>
                  <Button variant="outline" className="bg-[#F47920] hover:bg-[#C25E00] text-white border-0">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qosMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{metric.operator}</h3>
                          <p className="text-sm text-gray-600">{metric.month}</p>
                        </div>
                        {metric.compliant ? (
                          <Badge className="bg-[#1A6B3C] hover:bg-[#155d30]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compliant
                          </Badge>
                        ) : (
                          <Badge className="bg-[#B91C1C] hover:bg-[#991b1b]">
                            <XCircle className="h-3 w-3 mr-1" />
                            Non-Compliant
                          </Badge>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Call Success Rate</p>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold text-gray-900">{metric.callSuccessRate}%</div>
                            {metric.callSuccessRate >= 98 ? (
                              <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-[#003366] h-2 rounded-full"
                              style={{ width: `${metric.callSuccessRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Data Speed (Mbps)</p>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold text-gray-900">{metric.dataSpeed}</div>
                            {metric.dataSpeed >= 40 ? (
                              <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-[#003366] h-2 rounded-full"
                              style={{ width: `${(metric.dataSpeed / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Network Availability</p>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold text-gray-900">{metric.networkAvailability}%</div>
                            {metric.networkAvailability >= 99 ? (
                              <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${metric.networkAvailability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Metrics</CardTitle>
                <CardDescription>Comprehensive data for regulatory compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Operator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Call Success %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Speed (Mbps)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Network Availability
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {qosMetrics.map((metric, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{metric.operator}</div>
                            <div className="text-sm text-gray-500">{metric.month}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.callSuccessRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.dataSpeed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.networkAvailability}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {metric.compliant ? (
                              <Badge className="bg-green-500">Compliant</Badge>
                            ) : (
                              <Badge className="bg-red-500">Non-Compliant</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Regulatory compliance overview and enforcement actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qosMetrics.map((metric, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{metric.operator}</h4>
                        {metric.compliant ? (
                          <Badge className="bg-green-500">Fully Compliant</Badge>
                        ) : (
                          <Badge className="bg-red-500">Action Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {metric.compliant
                          ? 'All QoS parameters meet or exceed regulatory requirements.'
                          : 'Some parameters below regulatory thresholds. Corrective action plan required.'}
                      </p>
                      {!metric.compliant && (
                        <Button size="sm" variant="outline" className="border-[#F47920] text-[#C25E00] hover:bg-[#FFF0E6] mt-2">
                          View Action Plan
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QoSReporting;
