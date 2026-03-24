import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityMenu from './components/AccessibilityMenu';
import Home from './pages/Home';
import About from './pages/About';
import Mandate from './pages/Mandate';
import Projects from './pages/Projects';
import Documents from './pages/Documents';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TypeApproval from './pages/TypeApproval';
import LicenseApplication from './pages/LicenseApplication';
import Complaints from './pages/Complaints';
import QoSReporting from './pages/QoSReporting';
import AdminDashboard from './pages/AdminDashboard';
import DomainRegistry from './pages/DomainRegistry';
import LiveQoSMonitoring from './pages/LiveQoSMonitoring';

import Ruby from './components/Chatbot';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      <div className={isDashboard ? '' : 'pt-28'}>
        {children}
      </div>
      {!isDashboard && <Footer />}
      <Ruby />
      <AccessibilityMenu />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mandate" element={<Mandate />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/media" element={<Media />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/type-approval" element={<TypeApproval />} />
          <Route path="/license-application" element={<LicenseApplication />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/qos-reporting" element={<QoSReporting />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/domain-registry" element={<DomainRegistry />} />
          <Route path="/live-qos" element={<LiveQoSMonitoring />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
