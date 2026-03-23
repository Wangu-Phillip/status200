import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Search, FileText, Newspaper, Briefcase, X } from 'lucide-react';
import { newsItems, documents } from '../mockData';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // All searchable content
  const searchableContent = [
    ...documents.map(doc => ({
      type: 'document',
      title: doc.title,
      description: doc.category,
      url: '/documents',
      icon: FileText,
    })),
    ...newsItems.map(news => ({
      type: 'news',
      title: news.title,
      description: news.excerpt,
      url: '/media',
      icon: Newspaper,
    })),
    { type: 'page', title: 'Type Approval Application', description: 'Apply for equipment type approval', url: '/type-approval', icon: Briefcase },
    { type: 'page', title: 'License Application', description: 'Apply for communications license', url: '/license-application', icon: Briefcase },
    { type: 'page', title: 'File a Complaint', description: 'Submit consumer complaint', url: '/complaints', icon: Briefcase },
    { type: 'page', title: 'QoS Reporting', description: 'Quality of Service monitoring', url: '/qos-reporting', icon: Briefcase },
    { type: 'page', title: 'About BOCRA', description: 'Learn about our organization', url: '/about', icon: Briefcase },
    { type: 'page', title: 'Our Mandate', description: 'Regulatory mandate and responsibilities', url: '/mandate', icon: Briefcase },
    { type: 'page', title: 'Projects', description: 'View ongoing and completed projects', url: '/projects', icon: Briefcase },
    { type: 'page', title: 'Contact Us', description: 'Get in touch with BOCRA', url: '/contact', icon: Briefcase },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (url) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline px-2 py-1 text-xs bg-white rounded border">Ctrl+K</kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Card className="shadow-2xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4 border-b">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    ref={searchRef}
                    type="text"
                    placeholder="Search documents, news, services..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 text-lg"
                    autoFocus
                    aria-label="Global search input"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Results */}
                {results.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {results.map((result, index) => {
                      const Icon = result.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleResultClick(result.url)}
                          className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Icon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{result.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-1">{result.description}</div>
                          </div>
                          <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : query.trim().length > 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">Type to search across BOCRA services, documents, and news</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
