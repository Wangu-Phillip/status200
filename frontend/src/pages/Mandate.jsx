import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Radio, Tv, Mail, Wifi, ArrowRight, CheckCircle } from 'lucide-react';

const Mandate = () => {
  const mandates = [
    {
      id: 'telecommunications',
      title: 'Telecommunications',
      icon: Radio,
      color: 'from-teal-500 to-teal-600',
      description:
        'BOCRA regulates all aspects of telecommunications services to ensure competitive, reliable, and affordable services for all Botswana citizens.',
      responsibilities: [
        'Licensing of telecommunications operators',
        'Spectrum management and allocation',
        'Numbering plan administration',
        'Interconnection and infrastructure sharing',
        'Quality of Service monitoring and enforcement',
        'Consumer protection and dispute resolution',
        'Tariff regulation and price controls',
      ],
      image: 'https://images.unsplash.com/photo-1511233744044-194342066754?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHx0ZWxlY29tbXVuaWNhdGlvbnMlMjB0b3dlcnxlbnwwfHx8fDE3NzQyNzg3Nzl8MA&ixlib=rb-4.1.0&q=85',
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting',
      icon: Tv,
      color: 'from-cyan-500 to-cyan-600',
      description:
        'Regulation of commercial radio and television broadcasting to promote diversity, local content, and quality programming.',
      responsibilities: [
        'Broadcasting license issuance and renewal',
        'Content regulation and standards',
        'Local content quota enforcement',
        'Frequency assignment for broadcasting',
        'Technical standards compliance',
        'Monitoring broadcast quality',
        'Public interest broadcasting oversight',
      ],
      image: 'https://images.pexels.com/photos/918283/pexels-photo-918283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: 'postal',
      title: 'Postal Services',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      description:
        'Ensuring safe, reliable, efficient, and affordable postal services throughout Botswana through effective regulation.',
      responsibilities: [
        'Postal service licensing framework',
        'Universal postal service obligations',
        'Postal service quality standards',
        'Tariff approval and monitoring',
        'Consumer complaint handling',
        'Innovation and modernization support',
        'Courier and express mail regulation',
      ],
      image: 'https://images.pexels.com/photos/94844/pexels-photo-94844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: 'internet',
      title: 'Internet & ICT',
      icon: Wifi,
      color: 'from-teal-600 to-cyan-600',
      description:
        'Management of the .bw domain registry and regulation of Internet services to support Botswana\'s digital economy.',
      responsibilities: [
        '.bw country code top-level domain (ccTLD) management',
        'Internet Service Provider (ISP) licensing',
        'Cybersecurity coordination through bw-CIRT',
        'Electronic transactions regulation',
        'Data protection and privacy oversight',
        'Digital infrastructure development',
        'Internet governance participation',
      ],
      image: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxmaWJlciUyMG9wdGljfGVufDB8fHx8MTc3NDI3ODc5NXww&ixlib=rb-4.1.0&q=85',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Our Mandate</h1>
          <p className="text-xl max-w-3xl mx-auto">
            BOCRA regulates four key sectors to ensure efficient, reliable, and accessible communications services
            throughout Botswana
          </p>
        </div>
      </section>

      {/* Mandate Sections */}
      {mandates.map((mandate, index) => {
        const Icon = mandate.icon;
        const isEven = index % 2 === 0;
        return (
          <section key={mandate.id} className={`py-20 ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                <div className={!isEven ? 'md:order-2' : ''}>
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${mandate.color} flex items-center justify-center mb-6`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">{mandate.title}</h2>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">{mandate.description}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-3 mb-8">
                    {mandate.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-teal-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className={!isEven ? 'md:order-1' : ''}>
                  <img
                    src={mandate.image}
                    alt={mandate.title}
                    className="rounded-lg shadow-2xl w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Questions About Our Regulatory Framework?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our team is available to provide guidance on licensing, compliance, and regulatory matters
          </p>
          <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
            Contact Regulatory Team
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Mandate;
