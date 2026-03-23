import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem('bocra_user');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('bocra_user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-teal-200 transition-colors">Search BOCRA</a>
              <a href="#" className="hover:text-teal-200 transition-colors">BOCRA Portal</a>
              <a href="#" className="hover:text-teal-200 transition-colors">QOS Monitoring</a>
            </div>
            <div className="flex items-center space-x-4">
              <span>Plot 50671 Independence Avenue, Gaborone</span>
              <span>|</span>
              <span>+267 395 7755</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold text-gray-900">BOCRA</div>
                <div className="text-xs text-gray-600">Communications Regulatory Authority</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant="ghost"
                className={`${isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Home
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className={`${isActive('/about') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                About
              </Button>
            </Link>
            <Link to="/mandate">
              <Button
                variant="ghost"
                className={`${isActive('/mandate') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Mandate
              </Button>
            </Link>
            <Link to="/projects">
              <Button
                variant="ghost"
                className={`${isActive('/projects') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Projects
              </Button>
            </Link>
            <Link to="/documents">
              <Button
                variant="ghost"
                className={`${isActive('/documents') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Documents
              </Button>
            </Link>
            <Link to="/media">
              <Button
                variant="ghost"
                className={`${isActive('/media') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Media
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="ghost"
                className={`${isActive('/contact') ? 'text-teal-600 bg-teal-50' : 'text-gray-700'} hover:text-teal-600 hover:bg-teal-50`}
              >
                Contact
              </Button>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="bg-teal-600 hover:bg-teal-700 text-white">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Home
              </Button>
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                About
              </Button>
            </Link>
            <Link to="/mandate" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Mandate
              </Button>
            </Link>
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Projects
              </Button>
            </Link>
            <Link to="/documents" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Documents
              </Button>
            </Link>
            <Link to="/media" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Media
              </Button>
            </Link>
            <Link to="/type-approval" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Type Approval
              </Button>
            </Link>
            <Link to="/complaints" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Complaints
              </Button>
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Contact
              </Button>
            </Link>
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Login
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Register
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
