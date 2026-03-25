import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Briefcase,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle,
  FolderKanban,
  Shield,
  RadioTower,
  Wifi
} from 'lucide-react';

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
        'Deployment of an advanced spectrum monitoring and management system with automated violation detection capabilities across Botswana.',
      objectives: [
        'Install spectrum monitoring stations nationwide',
        'Implement real-time violation detection',
        'Integrate with the licence database',
        'Train staff on new systems',
      ],
      accent: '#2C7DA0',
      icon: RadioTower,
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
        'Launch of an online portal for equipment type approval submissions, streamlining workflows for manufacturers and importers.',
      objectives: [
        'Online application submission',
        'Digital document management',
        'Automated workflow system',
        'Real-time status tracking',
      ],
      accent: '#2EAD6F',
      icon: FolderKanban,
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
        'A national initiative to expand broadband coverage to underserved areas and promote universal access to high-speed internet.',
      objectives: [
        'Map underserved areas',
        'Develop infrastructure sharing framework',
        'Incentivise rural deployment',
        'Monitor coverage expansion',
      ],
      accent: '#F2C94C',
      icon: Wifi,
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
        'Strengthening national cybersecurity capabilities through bw-CIRT expansion and implementation of updated standards.',
      objectives: [
        'Expand CIRT capabilities',
        'Develop incident response protocols',
        'Conduct awareness campaigns',
        'Establish security standards',
      ],
      accent: '#C62828',
      icon: Shield,
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
      accent: '#F47920',
      icon: TrendingUp,
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
      accent: '#2C7DA0',
      icon: Briefcase,
    },
  ];

  const getStatusTone = (status) => {
    const tones = {
      'In Progress': 'bg-[#E8F0F9] text-[#003366] border-[#cfe0f1]',
      Completed: 'bg-[#E6F4EC] text-[#1A6B3C] border-[#cde8d7]',
      Planning: 'bg-[#FFF5DA] text-[#8A6A00] border-[#f2e0a2]',
      'On Hold': 'bg-[#FDEAEA] text-[#A12626] border-[#efcaca]',
    };
    return tones[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getCategoryTone = (category) => {
    const tones = {
      Infrastructure: 'bg-[#E8F0F9] text-[#2C7DA0] border-[#cfe0f1]',
      'Digital Transformation': 'bg-[#E6F4EC] text-[#2EAD6F] border-[#cde8d7]',
      Policy: 'bg-[#FFF5DA] text-[#8A6A00] border-[#f2e0a2]',
      Cybersecurity: 'bg-[#FDEAEA] text-[#C62828] border-[#efcaca]',
      Technology: 'bg-[#FFF0E6] text-[#F47920] border-[#ffd8bf]',
    };
    return tones[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return '#2EAD6F';
    if (progress >= 40) return '#2C7DA0';
    return '#F47920';
  };

  const summaryCards = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Briefcase,
      tone: 'icon-badge-navy',
    },
    {
      label: 'In Progress',
      value: projects.filter((p) => p.status === 'In Progress').length,
      icon: TrendingUp,
      tone: 'icon-badge-orange',
    },
    {
      label: 'Completed',
      value: projects.filter((p) => p.status === 'Completed').length,
      icon: CheckCircle,
      tone: 'icon-badge-navy',
    },
    {
      label: 'Planning',
      value: projects.filter((p) => p.status === 'Planning').length,
      icon: Calendar,
      tone: 'icon-badge-orange',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] relative">
      <section className="relative bg-[#003366] py-24 overflow-hidden">
        <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <p className="section-kicker text-[#F47920] mb-3">Strategic delivery</p>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Projects</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-white/80 leading-relaxed">
            Strategic initiatives driving innovation, regulatory excellence, and digital transformation in Botswana’s communications sector.
          </p>
        </div>
      </section>

      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {summaryCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="soft-panel">
                  <CardContent className="pt-6 text-center">
                    <div className={`w-12 h-12 ${item.tone} mx-auto mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{item.value}</div>
                    <div className="text-sm text-slate-600">{item.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <Card key={project.id} className="section-shell overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full w-1.5 rounded-full"
                  style={{ backgroundColor: project.accent }}
                ></div>

                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${project.accent}18`, color: project.accent }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={`border ${getCategoryTone(project.category)}`}>
                            {project.category}
                          </Badge>
                          <Badge className={`border ${getStatusTone(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>

                        <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                        <CardDescription className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {project.startDate} to {project.endDate}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-3xl font-bold text-[#003366]">{project.progress}%</div>
                      <div className="text-sm text-slate-500">Complete</div>
                    </div>
                  </div>

                  <div className="w-full bg-[#dbe6f2] rounded-full h-3 mt-4">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: getProgressColor(project.progress),
                      }}
                    ></div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-slate-600 mb-6 leading-relaxed">{project.description}</p>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Key Objectives</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {project.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#003366] mr-2.5 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" className="rounded-xl">
                      View Project Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Projects;