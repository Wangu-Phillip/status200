import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Briefcase, TrendingUp, Users, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: '1',
      title: 'National Spectrum Monitoring System Upgrade',
      status: 'In Progress',
      category: 'Infrastructure',
      startDate: '2024-03',
      endDate: '2025-10',
      progress: 65,
      description:
        'Deployment of Advanced Spectrum Monitoring and Management System (ASMMS) with Automatic Violation Detection capabilities across Botswana.',
      objectives: [
        'Install spectrum monitoring stations nationwide',
        'Implement real-time violation detection',
        'Integrate with license database',
        'Train staff on new systems',
      ],
    },
    {
      id: '2',
      title: 'Digital Type Approval Portal',
      status: 'Completed',
      category: 'Digital Transformation',
      startDate: '2024-06',
      endDate: '2025-10',
      progress: 100,
      description:
        'Launch of online portal for equipment type approval submissions, streamlining the approval process for manufacturers and importers.',
      objectives: [
        'Online application submission',
        'Digital document management',
        'Automated workflow system',
        'Real-time status tracking',
      ],
    },
    {
      id: '3',
      title: 'Broadband Infrastructure Development',
      status: 'In Progress',
      category: 'Policy',
      startDate: '2024-01',
      endDate: '2026-12',
      progress: 40,
      description:
        'Initiative to expand broadband coverage to underserved areas and promote universal access to high-speed internet across Botswana.',
      objectives: [
        'Map underserved areas',
        'Develop infrastructure sharing framework',
        'Incentivize rural deployment',
        'Monitor coverage expansion',
      ],
    },
    {
      id: '4',
      title: 'National Cybersecurity Enhancement',
      status: 'In Progress',
      category: 'Cybersecurity',
      startDate: '2024-05',
      endDate: '2025-12',
      progress: 55,
      description:
        'Strengthening national cybersecurity capabilities through bw-CIRT expansion and implementation of new security standards.',
      objectives: [
        'Expand CIRT capabilities',
        'Develop incident response protocols',
        'Conduct awareness campaigns',
        'Establish security standards',
      ],
    },
    {
      id: '5',
      title: 'QoS Monitoring Platform Enhancement',
      status: 'Planning',
      category: 'Technology',
      startDate: '2025-04',
      endDate: '2026-03',
      progress: 15,
      description:
        'Upgrade of Quality of Service monitoring systems to enable real-time data collection and automated compliance reporting.',
      objectives: [
        'Deploy automated monitoring tools',
        'Implement real-time dashboards',
        'Enable predictive analytics',
        'Improve reporting accuracy',
      ],
    },
    {
      id: '6',
      title: 'Broadcasting Content Regulation Review',
      status: 'In Progress',
      category: 'Policy',
      startDate: '2024-09',
      endDate: '2025-06',
      progress: 70,
      description:
        'Comprehensive review and update of broadcasting content standards and local content requirements.',
      objectives: [
        'Stakeholder consultations',
        'Review international standards',
        'Update content guidelines',
        'Implement new requirements',
      ],
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-[#E8F0F9] text-blue-800',
      Completed: 'bg-[#E6F4EC] text-[#1A6B3C]',
      Planning: 'bg-yellow-100 text-yellow-800',
      'On Hold': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Infrastructure: 'bg-purple-100 text-purple-800',
      'Digital Transformation': 'bg-[#E8F0F9] text-[#001F40]',
      Policy: 'bg-indigo-100 text-indigo-800',
      Cybersecurity: 'bg-red-100 text-red-800',
      Technology: 'bg-[#E8F0F9] text-[#001F40]',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#003366] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Briefcase className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Strategic initiatives driving innovation and excellence in Botswana's communications sector
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6 text-center">
                <Briefcase className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === 'In Progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === 'Completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6 text-center">
                <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === 'Planning').length}
                </div>
                <div className="text-sm text-gray-600">Planning</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(project.category)}>{project.category}</Badge>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.startDate} to {project.endDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#003366]">{project.progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#003366] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Objectives:</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {project.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#003366] mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#E8F0F9]">
                      View Project Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
