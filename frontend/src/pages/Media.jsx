import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../components/ui/dialog';
import { Newspaper, Calendar, Search, ArrowRight, FileText, Share2, Printer } from 'lucide-react';

const Media = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { toast } = useToast();

  const newsItems = [
    {
      id: '1',
      title: 'BOCRA Launches Digital Type Approval Portal',
      type: 'Press Release',
      date: '2025-03-20',
      excerpt:
        'BOCRA has officially launched its digital Type Approval portal, streamlining equipment certification processes for manufacturers and importers.',
      content: 'BOCRA is proud to announce the launch of our new Digital Type Approval portal. This system is designed to provide a seamless, end-to-end digital experience for equipment manufacturers, importers, and distributors seeking certification for electronic communications equipment in Botswana. The portal features automated application tracking, secure document uploads, and integrated fee payment systems. Starting April 2025, all type approval applications must be submitted through this portal to ensure efficiency and transparency.',
      image: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxmaWJlciUyMG9wdGljfGVufDB8fHx8MTc3NDI3ODc5NXww&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '2',
      title: 'BOTSWANA COLLABORATES WITH FIVE SADC MEMBER STATES',
      type: 'Press Release',
      date: '2025-03-15',
      excerpt:
        'Botswana has joined forces with five SADC member states to substantially reduce and harmonise international roaming tariffs across the region.',
      content: 'In a significant milestone for regional integration, BOCRA representing Botswana has signed a multilateral agreement with five SADC member states. This initiative aims to reduce international roaming charges for voice, SMS, and data services. By harmonising tariff structures and implementing wholesale price caps, we are ensuring that citizens can stay connected across borders without facing exorbitant costs. The new pricing structure will be implemented phased starting from the next financial year.',
      image: 'https://images.unsplash.com/photo-1511233744044-194342066754?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '3',
      title: 'BOCRA Approves Reduced Data Prices for BTC',
      type: 'Media Release',
      date: '2025-03-10',
      excerpt:
        'In a move to improve affordability, BOCRA has approved reduced data prices for Botswana Telecommunications Corporation customers.',
      content: 'BOCRA continues to drive its mandate of affordable communication services. We have officially approved a new tariff submission from BTC that significantly reduces data bundle prices across mobile and fixed-line services. These reductions are part of a broader regulatory strategy to lower the cost of doing business and enhance digital inclusion for all Batswana. Customers can expect to see these new prices reflected in their billing cycles immediately.',
      image: 'https://images.pexels.com/photos/4373997/pexels-photo-4373997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '4',
      title: 'BOCRA WEBSITE DEVELOPMENT HACKATHON',
      type: 'Public Notice',
      date: '2025-03-08',
      excerpt:
        'BOCRA invites talented developers to participate in a website development hackathon aimed at improving digital service delivery.',
      content: 'Are you a tech innovator? BOCRA is hosting a 48-hour hackathon focused on user-centric digital service delivery. We are looking for solutions that integrate AI, blockchain, and robust accessibility standards to improve how citizens interact with regulatory systems. Winning teams will receive cash prizes and potential collaboration opportunities to implement their solutions within our national infrastructure. Registration closes at the end of the month.',
      image: 'https://images.pexels.com/photos/918283/pexels-photo-918283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '5',
      title: 'Expression of Interest for Supplier Database',
      type: 'Public Notice',
      date: '2025-03-01',
      excerpt:
        'BOCRA seeks expressions of interest from qualified suppliers for inclusion in the Authority\'s supplier database.',
      content: 'Notice is hereby given that BOCRA is updating its approved supplier list for the fiscal year 2025/2026. Interested companies are invited to submit their credentials across various categories including IT services, facilities management, consulting, and equipment supply. Compliance with the Citizen Economic Empowerment (CEE) guidelines is a mandatory requirement. Online submission via the procurement portal is preferred.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MHx8fHwxNzc0Mjc4ODEyfDA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '6',
      title: 'ITA Commercial Broadcasting Radio Station Licence',
      type: 'Public Notice',
      date: '2025-02-25',
      excerpt:
        'Invitation to Apply for Commercial Broadcasting Radio Station Licence. Applications are now open for qualified broadcasters.',
      content: 'BOCRA invites applications for the operation of a commercial radio station in the national FM band. This invitation is open to locally registered entities with the technical and financial capacity to provide high-quality broadcasting content. Detailed ITA documents can be downloaded from our website resource center. Bidders are required to attend a mandatory briefing session at the headquarters.',
      image: 'https://images.pexels.com/photos/94844/pexels-photo-94844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '7',
      title: 'BOCRA Conducts Spectrum Monitoring Training',
      type: 'Event',
      date: '2025-02-20',
      excerpt:
        'BOCRA technical staff completed advanced training on spectrum monitoring systems and enforcement procedures.',
      content: 'To stay ahead of evolving signal interference challenges, BOCRA has concluded a comprehensive spectral analysis workshop. Staff members were trained on new mobile monitoring vehicles and satellite interference detection systems. This upgrade in human capacity ensures a stable and reliable communications environment for all mobile operators and emergency service networks across Botswana.',
      image: 'https://images.pexels.com/photos/4657267/pexels-photo-4657267.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '8',
      title: 'Q4 2024 Telecommunications Sector Performance Report',
      type: 'Report',
      date: '2025-02-15',
      excerpt:
        'BOCRA releases comprehensive report on telecommunications sector performance, showing continued growth in data usage and mobile penetration.',
      content: 'The Q4 2024 results are in. Botswana continues to see a record high in mobile penetration, now standing at 178% per capita. Internet data usage has surged by 22% compared to the previous quarter, largely driven by streaming services and remote working trends. This report serves as a benchmark for investors and policy makers in the ICT sector.',
      image: 'https://images.unsplash.com/photo-1704577190996-9bb78923c0b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHw0fHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: '9',
      title: 'World Telecommunications Day Celebration',
      type: 'Event',
      date: '2025-02-10',
      excerpt:
        'BOCRA hosted stakeholders to celebrate World Telecommunications Day, highlighting the sector\'s contribution to national development.',
      content: 'Under the theme "Digital Technologies for Older Persons and Healthy Ageing", BOCRA brought together stakeholders from the health and technology sectors. Discussions focused on how telecommunications can bridge the generational gap and provide essential telehealth services to remote elderly populations. The event culminated in a demonstration of easy-to-use digital tools for the senior citizens.',
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
                  <Button onClick={() => setSelectedArticle(filteredNews[0])} className="bg-[#F47920] hover:bg-[#C25E00] text-white w-fit">
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
                  <Button onClick={() => setSelectedArticle(item)} variant="link" className="text-[#003366] hover:text-[#0A4D8C] px-0 font-semibold">
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

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200">
          {selectedArticle && (
            <div className="space-y-6">
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                   <Badge className={`${getTypeColor(selectedArticle.type)} shadow-lg`}>
                    {selectedArticle.type}
                  </Badge>
                </div>
              </div>

              <DialogHeader>
                <div className="flex items-center text-sm text-slate-500 mb-2 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selectedArticle.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center text-slate-400">
                     <FileText className="h-4 w-4 mr-2" />
                     Ref: BOCRA-MED-2025-{selectedArticle.id}
                  </span>
                </div>
                <DialogTitle className="text-3xl font-bold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="text-lg text-slate-600 font-medium pt-2">
                  {selectedArticle.excerpt}
                </DialogDescription>
              </DialogHeader>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </p>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toast({title: "Sharing Link", description: "Article link copied to clipboard."})}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
                <Button onClick={() => setSelectedArticle(null)} className="rounded-xl px-10">
                  Close Article
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;
