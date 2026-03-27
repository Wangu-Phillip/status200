import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Search, Download, CheckCircle, AlertCircle, Filter, X } from 'lucide-react';

const TypeApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [devices, setDevices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch devices when search query or category filter changes
  useEffect(() => {
    fetchDevices();
  }, [searchQuery, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/type-approval/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchDevices = async () => {
    // Only fetch if there's a search query or category filter
    if (!searchQuery && !filterCategory) {
      setDevices([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterCategory) params.append('category', filterCategory);
      
      const response = await fetch(`${API_BASE_URL}/type-approval/devices?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setDevices(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch devices');
        setDevices([]);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch devices. Please try again.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExport = () => {
    const csvContent = [
      ['Device Name', 'Manufacturer', 'Model', 'Certificate Number', 'Category', 'Approval Date', 'Status'],
      ...devices.map(d => [
        d.deviceName,
        d.manufacturer,
        d.model,
        d.certificateNumber,
        d.category,
        d.approvalDate,
        d.status,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `type-approved-devices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: `Exported ${devices.length} devices to CSV`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Type Approved Devices Search</h1>
          <p className="text-lg text-gray-600">
            Search and verify equipment that has been approved under Botswana communications standards
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-l-4 border-l-teal-600">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-teal-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About Type Approval</h3>
                <p className="text-sm text-gray-600">
                  Type approved devices have been tested and certified to comply with Botswana BOCRA communications standards and international ITU requirements. This database contains all currently approved equipment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Search Database</CardTitle>
            <CardDescription>Find approved devices by name, manufacturer, model, or certificate number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Box */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Devices</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by device name, make, model, or certificate number..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Section */}
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="category-filter">Filter by Category</Label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  {(searchQuery || filterCategory) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterCategory('');
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={handleExport}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                    disabled={devices.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Results {devices.length > 0 && `(${devices.length} approved devices)`}
            </CardTitle>
            <CardDescription>
              {!searchQuery && !filterCategory 
                ? 'Enter a search term or select a category to view devices'
                : 'Displaying all devices matching your search criteria'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Error loading devices</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {!searchQuery && !filterCategory ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Start searching to view results</p>
                <p className="text-gray-500 text-sm mt-2">Use the search box above or filter by category to find devices</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <p className="text-gray-600 text-lg mt-4">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No devices found matching your search criteria</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Device Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Manufacturer</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Model</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Certificate #</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Approval Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {devices.map(device => (
                      <tr key={device.certificateNumber} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-medium">{device.deviceName}</td>
                        <td className="px-4 py-3 text-gray-600">{device.manufacturer}</td>
                        <td className="px-4 py-3 text-gray-600">{device.model}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{device.certificateNumber}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {device.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{device.approvalDate}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            {device.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: 'Device Details',
                                description: `${device.deviceName} - Certificate: ${device.certificateNumber}. Standards: ${device.standards}. Frequency: ${device.frequency}. Valid until ${device.expiryDate}`,
                              });
                            }}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certificate Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• Certificates are valid for 3 years from the approval date</p>
              <p>• Approval status can be verified using the certificate number</p>
              <p>• All devices comply with ITU-R standards and BOCRA regulations</p>
              <p>• Device specifications are subject to technical verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questions?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-3">
              <p>For more information about type approval or to verify a device certificate:</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="w-full"
              >
                Contact BOCRA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TypeApproval;
