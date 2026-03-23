import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Search, Filter, Calendar } from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const documents = [
    {
      id: '1',
      title: 'Communications Regulatory Authority Act 2012',
      category: 'Legislation',
      date: '2012-04-01',
      description: 'The principal Act establishing BOCRA and defining its regulatory mandate.',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'Postal Sector Licensing Framework',
      category: 'Framework',
      date: '2024-01-15',
      description: 'Comprehensive framework for postal service licensing and regulation.',
      size: '1.8 MB',
    },
    {
      id: '3',
      title: 'Quality of Service Guidelines 2025',
      category: 'Guidelines',
      date: '2025-01-01',
      description: 'Updated QoS standards and measurement criteria for operators.',
      size: '3.2 MB',
    },
    {
      id: '4',
      title: 'Enforcement Guidelines',
      category: 'Guidelines',
      date: '2024-06-20',
      description: 'Procedures and criteria for regulatory enforcement actions.',
      size: '1.5 MB',
    },
    {
      id: '5',
      title: 'Type Approval Regulations',
      category: 'Regulations',
      date: '2024-03-10',
      description: 'Technical requirements for equipment type approval process.',
      size: '2.1 MB',
    },
    {
      id: '6',
      title: 'Spectrum Management Plan 2024-2028',
      category: 'Policy',
      date: '2024-02-01',
      description: 'Strategic plan for radio frequency spectrum allocation and management.',
      size: '4.5 MB',
    },
    {
      id: '7',
      title: 'Consumer Protection Guidelines',
      category: 'Guidelines',
      date: '2023-11-15',
      description: 'Standards for consumer protection in communications services.',
      size: '1.9 MB',
    },
    {
      id: '8',
      title: 'Broadcasting Content Standards',
      category: 'Standards',
      date: '2023-09-01',
      description: 'Content requirements and local content quotas for broadcasters.',
      size: '1.2 MB',
    },
    {
      id: '9',
      title: 'Cybersecurity Framework',
      category: 'Framework',
      date: '2024-05-01',
      description: 'National cybersecurity framework and implementation guidelines.',
      size: '3.8 MB',
    },
    {
      id: '10',
      title: 'Interconnection Regulations',
      category: 'Regulations',
      date: '2023-07-20',
      description: 'Regulations governing network interconnection and infrastructure sharing.',
      size: '2.7 MB',
    },
    {
      id: '11',
      title: 'Annual Report 2024',
      category: 'Report',
      date: '2024-12-15',
      description: 'BOCRA comprehensive annual report covering all regulatory activities.',
      size: '8.5 MB',
    },
    {
      id: '12',
      title: 'Tariff Regulation Guidelines',
      category: 'Guidelines',
      date: '2024-08-10',
      description: 'Guidelines for tariff setting and approval processes.',
      size: '1.6 MB',
    },
  ];

  const categories = ['all', 'Legislation', 'Framework', 'Guidelines', 'Regulations', 'Policy', 'Standards', 'Report'];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Legislation: 'bg-purple-100 text-purple-800',
      Framework: 'bg-blue-100 text-blue-800',
      Guidelines: 'bg-green-100 text-green-800',
      Regulations: 'bg-red-100 text-red-800',
      Policy: 'bg-yellow-100 text-yellow-800',
      Standards: 'bg-indigo-100 text-indigo-800',
      Report: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <FileText className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Documents & Legislation</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Access regulatory documents, legislation, guidelines, and reports governing Botswana's communications sector
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-12 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-7 w-7 text-teal-600" />
                    </div>
                    <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{doc.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(doc.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{doc.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{doc.size}</span>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Document Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.slice(1).map((category) => (
              <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">
                    {documents.filter((d) => d.category === category).length}
                  </div>
                  <div className="font-semibold text-gray-900">{category}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Documents;
