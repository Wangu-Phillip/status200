import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, Globe, BarChart3, Search, Bell, Sun, Moon, ShieldCheck, Zap, MessageSquare, Briefcase } from 'lucide-react';
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
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const services = [
    { name: '.bw Domain Registry', path: '/domain-registry', icon: Globe },
    { name: 'Live QoS Monitoring', path: '/live-qos', icon: BarChart3 },
    { name: 'Type Approval', path: '/type-approval', icon: ShieldCheck },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'max-w-6xl' : 'max-w-7xl'
        }`}
      >
        <div
          className={`rounded-[2rem] px-6 py-2 transition-all duration-300 border border-white/10 ${
            scrolled
              ? 'bg-[#001F40]/95 backdrop-blur-xl shadow-2xl'
              : 'bg-[#003366]/95 backdrop-blur-md shadow-lg'
          }`}
        >
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="BOCRA Logo"
                className="h-20 w-auto object-contain group-hover:scale-105 transition-all duration-300"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white`}
                >
                  Home
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-xl px-4 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Services
                    <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-64 p-2 rounded-2xl border border-[#d9e6f4] bg-white shadow-2xl overflow-hidden relative"
                >
                  <div className="heritage-overlay basket-pattern text-[#003366] opacity-[0.03]"></div>
                  <div className="relative">
                    {services.map((service) => (
                      <DropdownMenuItem
                        key={service.name}
                        asChild
                        className="rounded-xl p-3 cursor-pointer focus:bg-[#E8F0F9] focus:text-[#003366]"
                      >
                        <Link to={service.path} className="flex items-center space-x-3 w-full">
                          <div className="text-[#003366]">
                            {React.createElement(service.icon || Globe, { className: 'h-4 w-4' })}
                          </div>
                          <span className="font-medium text-sm text-slate-700">{service.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/tenders">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/tenders')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white flex items-center gap-2`}
                >
                  Tenders
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/about')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white`}
                >
                  About
                </Button>
              </Link>

              <Link to="/careers">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/careers')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white`}
                >
                  Careers
                </Button>
              </Link>

              <Link to="/documents">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/documents')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white`}
                >
                  Resources
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  variant="ghost"
                  className={`rounded-xl px-4 ${
                    isActive('/contact')
                      ? 'bg-white/15 text-white'
                      : 'text-white/80'
                  } hover:bg-white/10 hover:text-white`}
                >
                  Contact
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  aria-label="Toggle Theme"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                <button onClick={() => toast({title: "Search functionality", description: "Global search will be integrated soon."})} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <Search className="h-5 w-5" />
                </button>

                {user && (
                  <button onClick={() => toast({title: "Notifications", description: "You have 0 new notifications."})} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#F47920] rounded-full border-2 border-[#003366]"></span>
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center space-x-3">
                {user ? (
                  user.userType === 'admin' ? (
                    <Link to="/admin">
                      <Button
                        variant="cta"
                        className="rounded-[1.25rem] px-8 font-extrabold tracking-wide shadow-lg shadow-[#F47920]/20"
                      >
                        Enter Admin Portal
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard">
                      <Button
                        className="rounded-[1.25rem] px-8 font-extrabold tracking-wide"
                      >
                        Enter Citizen Portal
                      </Button>
                    </Link>
                  )
                ) : (
                  <>
                    <Link to="/login?role=admin">
                      <Button
                        variant="ghost"
                        className="rounded-xl text-white/85 hover:bg-white/10 hover:text-white font-bold px-6"
                      >
                        BOCRA Staff
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        variant="cta"
                        className="rounded-[1.25rem] px-8 shadow-lg shadow-[#F47920]/20 font-extrabold tracking-wide"
                      >
                        Citizen Portal
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <button
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 pt-24 bg-[#001F40]/95 backdrop-blur-2xl animate-in fade-in duration-300 overflow-hidden">
          <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>

          <div className="px-6 space-y-4 relative">
            {['Home', 'Tenders', 'About', 'Careers', 'Documents', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-bold text-white hover:text-[#F47920] transition-colors"
              >
                {item}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-6"></div>

            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-lg font-medium text-white/85 hover:text-white"
                >
                  <service.icon className="h-5 w-5 text-[#F47920]" />
                  <span>{service.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <span className="text-sm font-bold text-white/60 uppercase tracking-widest">
                Theme Preference
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 p-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-all"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-5 w-5" />
                    <span className="font-semibold text-sm">Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-5 w-5" />
                    <span className="font-semibold text-sm">Switch to Light</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 pb-8 flex flex-col gap-3">
              {user ? (
                <>
                  {user.userType === 'admin' ? (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="cta"
                        className="w-full h-12 rounded-[1.25rem] font-bold text-lg"
                      >
                        Enter Admin Portal
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        className="w-full h-12 rounded-[1.25rem] font-bold text-lg"
                      >
                        Enter Citizen Portal
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full h-12 rounded-[1.25rem] border-white/20 bg-transparent text-white hover:bg-white/10 font-bold text-lg"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login?role=admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-[1.25rem] border-white/20 bg-transparent text-white hover:bg-white/10 font-bold text-lg"
                    >
                      BOCRA Staff Login
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="cta"
                      className="w-full h-12 rounded-[1.25rem] font-bold text-lg"
                    >
                      Citizen Portal
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;