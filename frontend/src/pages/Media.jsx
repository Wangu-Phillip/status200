import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Newspaper, Calendar, Search, ArrowRight, FileText } from 'lucide-react';

const Media = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const newsItems = [
    {
      id: '1',
      title: 'BOCRA Launches Digital Type Approval Portal',
      type: 'Press Release',
      date: '2025-03-20',
      excerpt:
        'BOCRA has officially launched its digital Type Approval portal, streamlining equipment certification processes for manufacturers and importers.',
      image: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxmaWJlciUyMG9wdGljfGVufDB8fHx8MTc3NDI3ODc5NXww&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '2',
      title: 'BOTSWANA COLLABORATES WITH FIVE SADC MEMBER STATES',
      type: 'Press Release',
      date: '2025-03-15',
      excerpt:
        'Botswana has joined forces with five SADC member states to substantially reduce and harmonise international roaming tariffs across the region.',
      image: 'https://images.unsplash.com/photo-1511233744044-194342066754?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '3',
      title: 'BOCRA Approves Reduced Data Prices for BTC',
      type: 'Media Release',
      date: '2025-03-10',
      excerpt:
        'In a move to improve affordability, BOCRA has approved reduced data prices for Botswana Telecommunications Corporation customers.',
      image: 'https://images.pexels.com/photos/4373997/pexels-photo-4373997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '4',
      title: 'BOCRA WEBSITE DEVELOPMENT HACKATHON',
      type: 'Public Notice',
      date: '2025-03-08',
      excerpt:
        'BOCRA invites talented developers to participate in a website development hackathon aimed at improving digital service delivery.',
      image: 'https://images.pexels.com/photos/918283/pexels-photo-918283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '5',
      title: 'Expression of Interest for Supplier Database',
      type: 'Public Notice',
      date: '2025-03-01',
      excerpt:
        'BOCRA seeks expressions of interest from qualified suppliers for inclusion in the Authority\'s supplier database.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MHx8fHwxNzc0Mjc4ODEyfDA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '6',
      title: 'ITA Commercial Broadcasting Radio Station Licence',
      type: 'Public Notice',
      date: '2025-02-25',
      excerpt:
        'Invitation to Apply for Commercial Broadcasting Radio Station Licence. Applications are now open for qualified broadcasters.',
      image: 'https://images.pexels.com/photos/94844/pexels-photo-94844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '7',
      title: 'BOCRA Conducts Spectrum Monitoring Training',
      type: 'Event',
      date: '2025-02-20',
      excerpt:
        'BOCRA technical staff completed advanced training on spectrum monitoring systems and enforcement procedures.',
      image: 'https://images.pexels.com/photos/4657267/pexels-photo-4657267.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '8',
      title: 'Q4 2024 Telecommunications Sector Performance Report',
      type: 'Report',
      date: '2025-02-15',
      excerpt:
        'BOCRA releases comprehensive report on telecommunications sector performance, showing continued growth in data usage and mobile penetration.',
      image: 'https://images.unsplash.com/photo-1704577190996-9bb78923c0b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHw0fHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '9',
      title: 'World Telecommunications Day Celebration',
      type: 'Event',
      date: '2025-02-10',
      excerpt:
        'BOCRA hosted stakeholders to celebrate World Telecommunications Day, highlighting the sector\'s contribution to national development.',
      image: 'https://images.pexels.com/photos/918283/pexels-photo-918283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
  ];

  const types = ['all', 'Press Release', 'Media Release', 'Public Notice', 'Event', 'Report'];

  const filteredNews = newsItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    const colors = {
      'Press Release': 'bg-[#E8F0F9] text-blue-800',
      'Media Release': 'bg-[#E6F4EC] text-[#1A6B3C]',
      'Public Notice': 'bg-[#FFF0E6] text-[#C25E00]',
      Event: 'bg-purple-100 text-purple-800',
      Report: 'bg-[#E8F0F9] text-[#001F40]',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#003366] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Newspaper className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Media Center</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Latest news, press releases, and updates from BOCRA
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
                placeholder="Search news and media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-12 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredNews.length} of {newsItems.length} items
          </div>
        </div>
      </section>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2">
                <div className="h-80 md:h-auto">
                  <img
                    src={filteredNews[0].image}
                    alt={filteredNews[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className={`${getTypeColor(filteredNews[0].type)} w-fit mb-4`}>
                    {filteredNews[0].type}
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{filteredNews[0].title}</h2>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(filteredNews[0].date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{filteredNews[0].excerpt}</p>
                  <Button onClick={() => toast({ title: "Opening Media", description: "Loading the full press release." })} className="bg-[#F47920] hover:bg-[#C25E00] text-white w-fit">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.slice(1).map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-[#003366] transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base line-clamp-3 mb-4">{item.excerpt}</CardDescription>
                  <Button onClick={() => toast({ title: "Opening Media", description: `Loading article: ${item.title}` })} variant="link" className="text-[#003366] hover:text-[#0A4D8C] px-0 font-semibold">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Resources</h2>
            <p className="text-lg text-gray-600">Additional resources for media and stakeholders</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <FileText className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Media Kit</h3>
                <p className="text-gray-600 text-sm mb-4">BOCRA logos, branding guidelines, and official materials</p>
                <Button onClick={() => toast({ title: "Downloading Kit", description: "The BOCRA official media kit is downloading." })} variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#E8F0F9]">
                  Download Kit
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Newspaper className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Press Releases</h3>
                <p className="text-gray-600 text-sm mb-4">Archive of official BOCRA press releases</p>
                <Button onClick={() => toast({ title: "Archive Accessed", description: "Redirecting to the digital media archive." })} variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#E8F0F9]">
                  View Archive
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Calendar className="h-12 w-12 text-[#003366] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Events Calendar</h3>
                <p className="text-gray-600 text-sm mb-4">Upcoming BOCRA events and industry activities</p>
                <Button onClick={() => toast({ title: "Opening Calendar", description: "Loading the 2025 events timetable." })} variant="outline" className="border-blue-600 text-[#003366] hover:bg-[#E8F0F9]">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Media;
