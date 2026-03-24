import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeProvider';
import { Menu, X, ChevronDown, Globe, BarChart3, Search, Bell, Sun, Moon, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem('bocra_user');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    window.location.href = '/';
  };

  const services = [
    { name: '.bw Domain Registry', path: '/domain-registry', icon: Globe },
    { name: 'Live QoS Monitoring', path: '/live-qos', icon: BarChart3 },
    { name: 'Type Approval', path: '/type-approval', icon: ShieldCheck },
    { name: 'License Applications', path: '/license-application', icon: Zap },
    { name: 'Complaints', path: '/complaints', icon: MessageSquare },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'max-w-6xl' : 'max-w-7xl'
      }`}>
        <div className={`glass border-slate-200/50 rounded-[2rem] px-6 py-2 transition-all duration-300 shadow-sm ${
          scrolled ? 'shadow-xl bg-white/90 backdrop-blur-xl border-slate-200' : ''
        }`}>
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" alt="BOCRA Logo" className="h-20 w-auto object-contain group-hover:scale-105 transition-all duration-300" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-slate-600'} hover:text-teal-600 hover:bg-teal-50`}
                >
                  Home
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-xl px-4 text-slate-600 hover:text-teal-600 hover:bg-teal-50">
                    Services
                    <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl glass-dark md:glass-light border-slate-200 shadow-2xl overflow-hidden relative">
                  <div className="heritage-overlay basket-pattern text-slate-900 opacity-[0.02]"></div>
                  <div className="relative">
                    {services.map((service) => (
                      <DropdownMenuItem key={service.name} asChild className="rounded-xl p-3 cursor-pointer focus:bg-teal-50 focus:text-teal-600">
                        <Link to={service.path} className="flex items-center space-x-3 w-full">
                          <div className="text-slate-400 group-focus:text-teal-500">
                            {React.createElement(service.icon || Globe, { className: 'h-4 w-4' })}
                          </div>
                          <span className="font-medium text-sm">{service.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/about">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${isActive('/about') ? 'text-teal-600 bg-teal-50' : 'text-slate-600'} hover:text-teal-600 hover:bg-teal-50`}
                >
                  About
                </Button>
              </Link>
              <Link to="/documents">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${isActive('/documents') ? 'text-teal-600 bg-teal-50' : 'text-slate-600'} hover:text-teal-600 hover:bg-teal-50`}
                >
                  Resources
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${isActive('/contact') ? 'text-teal-600 bg-teal-50' : 'text-slate-600'} hover:text-teal-600 hover:bg-teal-50`}
                >
                  Contact
                </Button>
              </Link>
            </div>

            {/* Icons & CTA */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <button 
                  onClick={toggleTheme}
                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                  aria-label="Toggle Theme"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
                  <Search className="h-5 w-5" />
                </button>
                {user && (
                  <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                )}
              </div>
              
              {user ? (
                <Link to="/dashboard">
                  <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 hidden sm:flex">
                    Portal
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 shadow-lg shadow-teal-500/20">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 pt-24 bg-white/80 backdrop-blur-3xl animate-in fade-in zoom-in duration-300 overflow-hidden">
          <div className="heritage-overlay basket-pattern text-teal-900 opacity-[0.04]"></div>
          <div className="px-6 space-y-4 relative">
            {['Home', 'About', 'Documents', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-bold text-slate-900 hover:text-teal-600 transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-6"></div>
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <Link 
                  key={service.name} 
                  to={service.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-lg font-medium text-slate-600"
                >
                  <service.icon className="h-5 w-5 text-teal-600" />
                  <span>{service.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>

  );
};

export default Navbar;

