import React, { useMemo, useState } from 'react';
import { documents } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  ShieldCheck,
  Scale,
  ClipboardList,
  ArrowRight
} from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const unique = [...new Set(documents.map((doc) => doc.category))];
    return ['All', ...unique];
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory =
        activeCategory === 'All' || doc.category === activeCategory;

      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const getCategoryAccent = (category) => {
    const tones = {
      Legislation: {
        bg: 'bg-[#E8F0F9]',
        text: 'text-[#2C7DA0]',
        border: 'border-[#cfe0f1]',
        icon: Scale,
      },
      Framework: {
        bg: 'bg-[#E6F4EC]',
        text: 'text-[#2EAD6F]',
        border: 'border-[#cde8d7]',
        icon: ClipboardList,
      },
      Guidelines: {
        bg: 'bg-[#FFF5DA]',
        text: 'text-[#8A6A00]',
        border: 'border-[#f2e0a2]',
        icon: ShieldCheck,
      },
    };

    return (
      tones[category] || {
        bg: 'bg-[#FFF0E6]',
        text: 'text-[#F47920]',
        border: 'border-[#ffd8bf]',
        icon: FileText,
      }
    );
  };

  const summaryCards = [
    {
      label: 'Total Resources',
      value: documents.length,
      icon: FileText,
      tone: 'icon-badge-navy',
    },
    {
      label: 'Legislation',
      value: documents.filter((doc) => doc.category === 'Legislation').length,
      icon: Scale,
      tone: 'icon-badge-orange',
    },
    {
      label: 'Frameworks',
      value: documents.filter((doc) => doc.category === 'Framework').length,
      icon: ClipboardList,
      tone: 'icon-badge-navy',
    },
    {
      label: 'Guidelines',
      value: documents.filter((doc) => doc.category === 'Guidelines').length,
      icon: ShieldCheck,
      tone: 'icon-badge-orange',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] relative">
      <section className="relative bg-[#003366] py-24 overflow-hidden">
        <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <p className="section-kicker text-[#F47920] mb-3">Public resources</p>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Documents & Resources</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-white/80 leading-relaxed">
            Access BOCRA legislation, frameworks, guidelines, and other public regulatory resources in one place.
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

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-shell p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker mb-2">Find a document</p>
                <h2 className="section-title">Browse Resources</h2>
              </div>

              <div className="w-full lg:max-w-md relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or category..."
                  className="pl-11 h-12 bg-white border-[#d9e6f4] focus-visible:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {categories.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      active
                        ? 'bg-[#003366] text-white border-[#003366]'
                        : 'bg-white text-[#003366] border-[#d9e6f4] hover:bg-[#E8F0F9]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDocuments.length === 0 ? (
            <Card className="section-shell text-center py-12">
              <CardContent>
                <div className="w-16 h-16 icon-badge-navy mx-auto mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No matching resources</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Try adjusting your search term or selecting a different category.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => {
                const tone = getCategoryAccent(doc.category);
                const Icon = tone.icon;

                return (
                  <Card key={doc.id} className="section-shell h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1.5 rounded-full bg-[#003366]"></div>

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tone.bg} ${tone.text} border ${tone.border}`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>

                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] border ${tone.bg} ${tone.text} ${tone.border}`}
                        >
                          {doc.category}
                        </span>
                      </div>

                      <CardTitle className="text-xl leading-snug mt-4">{doc.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col justify-between h-full">
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Access this BOCRA resource for reference, compliance guidance, and regulatory information.
                      </p>

                      <div className="flex flex-wrap gap-3 mt-auto">
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto"
                        >
                          <Button variant="cta" className="rounded-xl w-full sm:w-auto">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </a>

                        <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Documents;