import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { seedDemoData } from './utils/persistence';
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
import Tenders from './pages/Tenders';

import Ruby from './components/Chatbot';

// Seed demo data on first load
seedDemoData();

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      <div className={isDashboard ? '' : 'pt-28'}>
        {children}
      </div>
      {!isDashboard && <Footer />}
      <Ruby />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/type-approval" element={<TypeApproval />} />
            <Route path="/license-application" element={<LicenseApplication />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/qos-reporting" element={<QoSReporting />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/domain-registry" element={<DomainRegistry />} />
            <Route path="/live-qos" element={<LiveQoSMonitoring />} />
            <Route path="/tenders" element={<Tenders />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
