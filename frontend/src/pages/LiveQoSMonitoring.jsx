import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Signal,
  Wifi,
  Phone,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
} from 'lucide-react';

const LiveQoSMonitoring = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const operators = [
    {
      name: 'BTC',
      logo: 'BTC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 98.5, target: 95, trend: 'up', change: '+0.3%' },
        dataSpeed: { value: 45.2, target: 30, trend: 'up', change: '+2.1 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.8, target: 99.0, trend: 'stable', change: '0%' },
        voiceQuality: { value: 4.2, target: 3.5, trend: 'up', change: '+0.1', unit: 'MOS' },
        latency: { value: 28, target: 50, trend: 'down', change: '-3ms', unit: 'ms' },
      },
      coverage: { urban: 99, rural: 87, overall: 93 },
    },
    {
      name: 'Mascom',
      logo: 'MSC',
      status: 'Compliant',
      metrics: {
        callSuccessRate: { value: 97.8, target: 95, trend: 'up', change: '+0.5%' },
        dataSpeed: { value: 42.1, target: 30, trend: 'stable', change: '0 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 99.5, target: 99.0, trend: 'up', change: '+0.2%' },
        voiceQuality: { value: 4.0, target: 3.5, trend: 'stable', change: '0', unit: 'MOS' },
        latency: { value: 32, target: 50, trend: 'up', change: '+2ms', unit: 'ms' },
      },
      coverage: { urban: 98, rural: 85, overall: 91.5 },
    },
    {
      name: 'Orange',
      logo: 'ORG',
      status: 'Action Required',
      metrics: {
        callSuccessRate: { value: 94.2, target: 95, trend: 'down', change: '-0.8%' },
        dataSpeed: { value: 38.5, target: 30, trend: 'down', change: '-1.5 Mbps', unit: 'Mbps' },
        networkAvailability: { value: 98.9, target: 99.0, trend: 'down', change: '-0.3%' },
        voiceQuality: { value: 3.8, target: 3.5, trend: 'down', change: '-0.2', unit: 'MOS' },
        latency: { value: 45, target: 50, trend: 'stable', change: '0ms', unit: 'ms' },
      },
      coverage: { urban: 96, rural: 78, overall: 87 },
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getComplianceColor = (value, target, inverse = false) => {
    const isCompliant = inverse ? value <= target : value >= target;
    return isCompliant ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (status) => {
    if (status === 'Compliant') {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Compliant
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-500 hover:bg-orange-600">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Action Required
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-12 w-12" />
                <div>
                  <h1 className="text-4xl font-bold">Live QoS Monitoring Dashboard</h1>
                  <p className="text-lg mt-2">Real-time Quality of Service metrics for Botswana operators</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <span>•</span>
                <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white/20"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
              </Button>
              <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Operators</p>
                    <p className="text-3xl font-bold text-gray-900">{operators.length}</p>
                  </div>
                  <Signal className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Call Success</p>
                    <p className="text-3xl font-bold text-green-600">
                      {(operators.reduce((sum, op) => sum + op.metrics.callSuccessRate.value, 0) / operators.length).toFixed(1)}%
                    </p>
                  </div>
                  <Phone className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Data Speed</p>
                    <p className="text-3xl font-bold text-cyan-600">
                      {(operators.reduce((sum, op) => sum + op.metrics.dataSpeed.value, 0) / operators.length).toFixed(1)} Mbps
                    </p>
                  </div>
                  <Wifi className="h-10 w-10 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Compliant Operators</p>
                    <p className="text-3xl font-bold text-teal-600">
                      {operators.filter(op => op.status === 'Compliant').length}/{operators.length}
                    </p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="realtime" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="realtime">Real-time Metrics</TabsTrigger>
              <TabsTrigger value="coverage">Network Coverage</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="space-y-6">
              {operators.map((operator, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{operator.logo}</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{operator.name}</CardTitle>
                          <CardDescription>Real-time network performance metrics</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(operator.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-6">
                      {/* Call Success Rate */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Call Success Rate</span>
                          {getTrendIcon(operator.metrics.callSuccessRate.trend)}
                        </div>
                        <div className={`text-2xl font-bold ${getComplianceColor(operator.metrics.callSuccessRate.value, operator.metrics.callSuccessRate.target)}`}>
                          {operator.metrics.callSuccessRate.value}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {operator.metrics.callSuccessRate.target}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{operator.metrics.callSuccessRate.change}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-teal-600 h-2 rounded-full transition-all"
                            style={{ width: `${operator.metrics.callSuccessRate.value}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Data Speed */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Data Speed</span>
                          {getTrendIcon(operator.metrics.dataSpeed.trend)}
                        </div>
                        <div className={`text-2xl font-bold ${getComplianceColor(operator.metrics.dataSpeed.value, operator.metrics.dataSpeed.target)}`}>
                          {operator.metrics.dataSpeed.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {operator.metrics.dataSpeed.unit}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {operator.metrics.dataSpeed.target} {operator.metrics.dataSpeed.unit}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{operator.metrics.dataSpeed.change}</div>
                      </div>

                      {/* Network Availability */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Network Availability</span>
                          {getTrendIcon(operator.metrics.networkAvailability.trend)}
                        </div>
                        <div className={`text-2xl font-bold ${getComplianceColor(operator.metrics.networkAvailability.value, operator.metrics.networkAvailability.target)}`}>
                          {operator.metrics.networkAvailability.value}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {operator.metrics.networkAvailability.target}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{operator.metrics.networkAvailability.change}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${operator.metrics.networkAvailability.value}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Voice Quality */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Voice Quality</span>
                          {getTrendIcon(operator.metrics.voiceQuality.trend)}
                        </div>
                        <div className={`text-2xl font-bold ${getComplianceColor(operator.metrics.voiceQuality.value, operator.metrics.voiceQuality.target)}`}>
                          {operator.metrics.voiceQuality.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {operator.metrics.voiceQuality.unit}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {operator.metrics.voiceQuality.target} {operator.metrics.voiceQuality.unit}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{operator.metrics.voiceQuality.change}</div>
                      </div>

                      {/* Latency */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Latency</span>
                          {getTrendIcon(operator.metrics.latency.trend)}
                        </div>
                        <div className={`text-2xl font-bold ${getComplianceColor(operator.metrics.latency.value, operator.metrics.latency.target, true)}`}>
                          {operator.metrics.latency.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {operator.metrics.latency.unit}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: &lt;{operator.metrics.latency.target} {operator.metrics.latency.unit}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{operator.metrics.latency.change}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="coverage" className="space-y-6">
              {operators.map((operator, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{operator.logo}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{operator.name} - Network Coverage</CardTitle>
                        <CardDescription>Geographic coverage statistics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{operator.coverage.urban}%</div>
                        <div className="text-gray-600">Urban Coverage</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{ width: `${operator.coverage.urban}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{operator.coverage.rural}%</div>
                        <div className="text-gray-600">Rural Coverage</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                          <div
                            className="bg-green-600 h-3 rounded-full"
                            style={{ width: `${operator.coverage.rural}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-teal-600 mb-2">{operator.coverage.overall}%</div>
                        <div className="text-gray-600">Overall Coverage</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                          <div
                            className="bg-teal-600 h-3 rounded-full"
                            style={{ width: `${operator.coverage.overall}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Compliance Summary</CardTitle>
                  <CardDescription>Overall compliance status for all monitored parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Success</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Speed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {operators.map((operator, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded flex items-center justify-center mr-3">
                                  <span className="text-white text-xs font-bold">{operator.logo}</span>
                                </div>
                                <span className="font-medium">{operator.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(operator.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getComplianceColor(operator.metrics.callSuccessRate.value, operator.metrics.callSuccessRate.target)}>
                                {operator.metrics.callSuccessRate.value}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getComplianceColor(operator.metrics.dataSpeed.value, operator.metrics.dataSpeed.target)}>
                                {operator.metrics.dataSpeed.value} Mbps
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getComplianceColor(operator.metrics.networkAvailability.value, operator.metrics.networkAvailability.target)}>
                                {operator.metrics.networkAvailability.value}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-l-4 border-l-teal-600">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <BarChart3 className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">About QoS Monitoring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    BOCRA continuously monitors Quality of Service parameters to ensure operators maintain high standards of service delivery. 
                    This dashboard provides real-time visibility into network performance, helping us enforce compliance and protect consumer interests.
                    Metrics are updated every 30 seconds from operator network monitoring systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LiveQoSMonitoring;
