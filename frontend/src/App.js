import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TypeApproval from './pages/TypeApproval';
import LicenseApplication from './pages/LicenseApplication';
import Complaints from './pages/Complaints';
import QoSReporting from './pages/QoSReporting';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/type-approval" element={<TypeApproval />} />
          <Route path="/license-application" element={<LicenseApplication />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/qos-reporting" element={<QoSReporting />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
