import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Globe,
  Search,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  FileText,
  Lock,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const DomainRegistry = () => {
  const { toast } = useToast();
  const [whoisQuery, setWhoisQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const domainZones = [
    { zone: '.co.bw', description: 'Commercial', price: 'P250 - P850/year', available: true },
    { zone: '.org.bw', description: 'Organizations', price: 'P150 - P550/year', available: true },
    { zone: '.net.bw', description: 'Network', price: 'P200 - P600/year', available: true },
    { zone: '.ac.bw', description: 'Academic', price: 'P100 - P350/year', available: true },
    { zone: '.gov.bw', description: 'Government', price: 'Restricted', available: false },
    { zone: '.shop.bw', description: 'E-commerce', price: 'P300 - P950/year', available: true },
    { zone: '.agric.bw', description: 'Agriculture', price: 'P180 - P450/year', available: true },
    { zone: '.me.bw', description: 'Personal', price: 'P150 - P400/year', available: true },
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Identifiable',
      description: '.bw domains are a brand identity unique and locally relevant to Botswana.',
      color: 'text-green-600',
    },
    {
      icon: DollarSign,
      title: 'Affordable',
      description: 'No maintenance fees charged to registrars – keeping your domain costs low.',
      color: 'text-[#003366]',
    },
    {
      icon: Clock,
      title: 'Timely',
      description: 'Queries resolved in 24hrs or less. Registrar accreditation within 7 working days.',
      color: 'text-orange-600',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'DNSSec enabled for integrity protection and anti-phishing measures.',
      color: 'text-purple-600',
    },
    {
      icon: Users,
      title: 'Trusted',
      description: 'Over 10,000+ domains registered by trusted registrants across Botswana.',
      color: 'text-[#003366]',
    },
    {
      icon: Lock,
      title: 'Fair & Regulated',
      description: 'Well-regulated policies ensuring compliance with international best practices.',
      color: 'text-red-600',
    },
  ];

  const registrars = [
    { name: 'OPQ Technologies', contact: 'domains@opq.co.bw', phone: '+267 318 7777' },
    { name: 'Mascom Wireless', contact: 'domains@mascom.bw', phone: '+267 395 3000' },
    { name: 'BTC Networks', contact: 'registry@btc.bw', phone: '+267 395 2222' },
    { name: 'Orange Botswana', contact: 'support@orange.co.bw', phone: '+267 395 5000' },
  ];

  const handleWhoisSearch = (e) => {
    e.preventDefault();
    if (whoisQuery.trim()) {
      // Mock WHOIS search
      const isAvailable = Math.random() > 0.5;
      setSearchResults({
        domain: whoisQuery,
        available: isAvailable,
        message: isAvailable
          ? `${whoisQuery} is available for registration!`
          : `${whoisQuery} is already registered.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#003366] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Globe className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">.bw Domain Registry</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Secure your online presence with Botswana's trusted .bw domain - Safe, Affordable & Locally Relevant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge className="bg-white text-[#003366] text-lg px-6 py-3 hover:bg-gray-100">
                10,000+ Registered Domains
              </Badge>
              <Badge className="bg-white text-[#003366] text-lg px-6 py-3 hover:bg-gray-100">
                70+ Accredited Registrars
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* WHOIS Search Section */}
      <section className="py-12 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Check Domain Availability</CardTitle>
              <CardDescription className="text-center">Search for your perfect .bw domain name</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWhoisSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter domain name (e.g., mybusiness.co.bw)"
                    value={whoisQuery}
                    onChange={(e) => setWhoisQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" className="bg-[#003366] hover:bg-[#0A4D8C] h-12 px-8">
                  Search
                </Button>
              </form>
              {searchResults && (
                <div
                  className={`mt-4 p-4 rounded-lg ${searchResults.available ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}
                >
                  <p className={`font-semibold ${searchResults.available ? 'text-green-800' : 'text-orange-800'}`}>
                    {searchResults.message}
                  </p>
                  {searchResults.available && (
                    <Button className="mt-3 bg-green-600 hover:bg-green-700">Register Now</Button>
                  )}
                </div>
              )}
              <div className="mt-4 text-center">
                <a
                  href="http://whois.nic.net.bw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#003366] hover:text-[#0A4D8C] text-sm font-medium"
                >
                  Advanced WHOIS Lookup →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Available Domain Zones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available .bw Domain Zones</h2>
            <p className="text-xl text-gray-600">Choose the perfect domain extension for your needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainZones.map((zone, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-all ${!zone.available ? 'opacity-60' : 'cursor-pointer hover:-translate-y-1'}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-[#003366]">{zone.zone}</CardTitle>
                    {zone.available ? (
                      <Badge className="bg-green-500">Available</Badge>
                    ) : (
                      <Badge className="bg-gray-500">Restricted</Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg">{zone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-4">Starting at</div>
                  <div className="text-xl font-bold text-gray-900 mb-4">{zone.price}</div>
                  {zone.available && (
                    <Button variant="outline" className="w-full border-[#003366] text-[#003366] hover:bg-[#E8F0F9]">
                      Register
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Register a .bw Domain?</h2>
            <p className="text-xl text-gray-600">Your gateway to Botswana's digital economy</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Register */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Register Your .bw Domain</h2>
            <p className="text-xl text-gray-600">Simple 3-step process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-t-4 border-t-[#003366]">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-[#003366] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Search & Check</h3>
                <p className="text-gray-600">
                  Use our WHOIS tool to check if your desired domain name is available
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-t-4 border-t-[#003366]">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-[#003366] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Choose Registrar</h3>
                <p className="text-gray-600">
                  Select an accredited registrar from our list of trusted partners
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-t-4 border-t-[#003366]">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-[#003366] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Register & Go Live</h3>
                <p className="text-gray-600">
                  Complete registration with your chosen registrar and launch your online presence
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Accredited Registrars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Accredited .bw Registrars</h2>
            <p className="text-xl text-gray-600">Register your domain with trusted partners</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {registrars.map((registrar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{registrar.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 mr-2 text-[#003366]" />
                      {registrar.contact}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-[#003366]" />
                      {registrar.phone}
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-[#003366] hover:bg-[#0A4D8C]">
                    Visit Registrar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#E8F0F9]">
              View All Accredited Registrars
            </Button>
          </div>
        </div>
      </section>

      {/* Become a Registrar CTA */}
      <section className="py-16 bg-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Want to Become a .bw Registrar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our network of accredited registrars. Accreditation process takes only 7 working days.
          </p>
          <Button size="lg" className="bg-[#F47920] hover:bg-[#C25E00] text-white border-0">
            Apply for Accreditation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default DomainRegistry;
