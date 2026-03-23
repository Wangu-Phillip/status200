import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Radio, Tv, Mail, Wifi, FileText, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { newsItems, documents } from '../mockData';

const Home = () => {
  const mandates = [
    {
      title: 'TELECOMMUNICATIONS',
      icon: Radio,
      description: 'Regulation of telecommunications services, cellular networks, and related infrastructure across Botswana.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'BROADCASTING',
      icon: Tv,
      description: 'Regulation of commercial radio stations and television broadcasting services including content requirements.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'POSTAL',
      icon: Mail,
      description: 'Supervision of postal services ensuring safe, reliable, and affordable delivery throughout Botswana.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'INTERNET',
      icon: Wifi,
      description: 'Management of .bw domain registry and regulation of Internet services and ICT infrastructure.',
      color: 'from-teal-600 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511233744044-194342066754?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85"
            alt="Telecommunications"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-cyan-900/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Botswana Communications
            <br />
            <span className="text-cyan-300">Regulatory Authority</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Regulating telecommunications, broadcasting, postal services, and ICT for a connected Botswana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-white text-teal-900 hover:bg-gray-100 text-lg px-8 py-6">
                Client Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About BOCRA</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Botswana Communications Regulatory Authority (BOCRA) was established through the Communications
                Regulatory Authority Act, 2012 (CRA Act) on the 1st of April 2013 to regulate the communications
                sector in Botswana.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The CRA Act replaced the Broadcasting Act, the Telecommunications Act, and caused the amendment of
                the Postal Services Act to create a converged or an integrated regulatory authority for the
                communications industry.
              </p>
              <Link to="/about">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MHx8fHwxNzc0Mjc4ODEyfDA&ixlib=rb-4.1.0&q=85"
                alt="BOCRA Office"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mandates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mandate</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BOCRA regulates four key sectors to ensure efficient and reliable communications services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mandates.map((mandate, index) => {
              const Icon = mandate.icon;
              return (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${mandate.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{mandate.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{mandate.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive regulatory and compliance services</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/domain-registry">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">.bw Domain Registry</CardTitle>
                  <CardDescription>Register and manage your .bw domain names</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/live-qos">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">Live QoS Monitoring</CardTitle>
                  <CardDescription>Real-time network performance dashboard</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/type-approval">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">Type Approval</CardTitle>
                  <CardDescription>Equipment certification and approval services</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/license-application">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">License Applications</CardTitle>
                  <CardDescription>Apply for various communication licenses</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/complaints">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">Complaints</CardTitle>
                  <CardDescription>Submit and track consumer complaints</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/qos-reporting">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
                <CardHeader>
                  <CardTitle className="text-lg">QoS Reporting</CardTitle>
                  <CardDescription>Quality of Service monitoring and reports</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">News & Events</h2>
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {newsItems.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-teal-600 transition-colors cursor-pointer">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{news.excerpt}</CardDescription>
                  <Button variant="link" className="text-teal-600 hover:text-teal-700 mt-4 px-0">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Documents & Legislation</h2>
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <CardDescription className="text-sm">{doc.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Need Assistance?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our team is here to help with licensing, compliance, and regulatory inquiries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/complaints">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                File a Complaint
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
