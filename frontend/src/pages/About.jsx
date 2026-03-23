import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Target, Eye, Award, TrendingUp, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Years of Operation', value: '12+', icon: TrendingUp },
    { label: 'Licensed Operators', value: '50+', icon: Users },
    { label: 'Service Coverage', value: '100%', icon: Globe },
    { label: 'Customer Satisfaction', value: '95%', icon: Award },
  ];

  const values = [
    {
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all regulatory activities.',
      icon: Award,
    },
    {
      title: 'Innovation',
      description: 'We embrace technological advancement and encourage innovation in the communications sector.',
      icon: TrendingUp,
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in service delivery and regulatory oversight.',
      icon: Target,
    },
    {
      title: 'Accountability',
      description: 'We are accountable to stakeholders and committed to fair regulatory practices.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">About BOCRA</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Leading the transformation of Botswana's communications sector through effective regulation and innovation
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our History</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Botswana Communications Regulatory Authority (BOCRA) was established through the Communications
                  Regulatory Authority Act, 2012 (CRA Act) on the 1st of April 2013 to regulate the communications
                  sector in Botswana, comprising telecommunications, Internet and Information and Communications
                  Technologies (ICTs), radio communications, broadcasting, postal services and related matters.
                </p>
                <p>
                  The CRA Act replaced the Broadcasting Act [Cap 72:04], the Telecommunications Act [Cap 72:03], and
                  caused the amendment of the Postal Services Act to create a converged or an integrated regulatory
                  authority for the communications industry.
                </p>
                <p>
                  Since its establishment, BOCRA has been at the forefront of ensuring that Botswana's communications
                  sector remains competitive, innovative, and accessible to all citizens.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MHx8fHwxNzc0Mjc4ODEyfDA&ixlib=rb-4.1.0&q=85"
                alt="BOCRA Office"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8">
                    <Icon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-t-4 border-t-teal-600">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Target className="h-10 w-10 text-teal-600 mr-4" />
                  <CardTitle className="text-3xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To regulate the communications sector in Botswana through effective licensing, enforcement, and
                  policy development that promotes competition, innovation, consumer protection, and universal access
                  to quality communications services.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-cyan-600">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Eye className="h-10 w-10 text-cyan-600 mr-4" />
                  <CardTitle className="text-3xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To be a world-class communications regulator, facilitating a dynamic, competitive, and innovative
                  communications sector that supports Botswana's socio-economic development and positions the country
                  as a regional ICT hub.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide our regulatory approach</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the team driving BOCRA's vision</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership Member {i}</h3>
                  <p className="text-teal-600 font-semibold mb-2">Executive Position</p>
                  <p className="text-gray-600 text-sm">
                    Leading BOCRA's initiatives in regulatory excellence and sector development.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
