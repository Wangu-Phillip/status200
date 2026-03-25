import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#001F40] text-white/80 relative overflow-hidden">
      <div className="heritage-overlay basket-pattern text-white opacity-[0.03]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="BOCRA Logo" className="h-16 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-white/75">
              Botswana Communications Regulatory Authority regulates the communications sector including
              telecommunications, broadcasting, postal services, and ICT.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#F47920] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#F47920] transition-colors">About BOCRA</Link></li>
              <li><Link to="/mandate" className="hover:text-[#F47920] transition-colors">Our Mandate</Link></li>
              <li><Link to="/projects" className="hover:text-[#F47920] transition-colors">Projects</Link></li>
              <li><Link to="/documents" className="hover:text-[#F47920] transition-colors">Documents</Link></li>
              <li><Link to="/contact" className="hover:text-[#F47920] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/type-approval" className="hover:text-[#F47920] transition-colors">Type Approval</Link></li>
              <li><Link to="/license-application" className="hover:text-[#F47920] transition-colors">License Application</Link></li>
              <li><Link to="/complaints" className="hover:text-[#F47920] transition-colors">File Complaint</Link></li>
              <li><Link to="/qos-reporting" className="hover:text-[#F47920] transition-colors">QoS Monitoring</Link></li>
              <li><Link to="/media" className="hover:text-[#F47920] transition-colors">Media Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-[#F47920]" />
                <span>Plot 50671 Independence Avenue<br />Gaborone, Botswana</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#F47920]" />
                <span>+267 395 7755</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#F47920]" />
                <span>info@bocra.org.bw</span>
              </li>
            </ul>

            <div className="flex space-x-3 mt-6">
              <a href="https://facebook.com/bocra" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F47920] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/bocra" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F47920] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/company/bocra" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F47920] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://youtube.com/bocra" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F47920] transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p className="text-white/65 text-center md:text-left">
              &copy; 2025 Botswana Communications Regulatory Authority. All rights reserved. | Built by STATUS 200
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/cyber-incident" className="text-red-400 hover:text-red-300 transition-colors font-semibold">Report Cyber Incident</Link>
              <Link to="/privacy-policy" className="hover:text-[#F47920] transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-[#F47920] transition-colors">Terms of Service</Link>
              <Link to="/privacy-policy" className="hover:text-[#F47920] transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;