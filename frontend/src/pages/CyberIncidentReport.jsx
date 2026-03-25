import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

const CyberIncidentReport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Incident Reported",
        description: "Your cyber incident report has been securely submitted.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="text-center py-12 border-red-100">
          <CardContent className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
            <p className="text-gray-600 mb-6 font-medium">Ticket ID: CYB-{Math.floor(Math.random() * 90000) + 10000}</p>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this incident. Our Cybersecurity response team has been alerted and will investigate immediately.
            </p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Cyber Incident Reporting</h1>
          <p className="text-gray-600">
            Report security breaches, vulnerabilities, or cyber incidents directly to BOCRA as per Cybersecurity Act requirements.
          </p>
        </div>
      </div>

      <Card className="border-red-100 shadow-md">
        <CardHeader className="bg-slate-50 border-b border-red-50">
          <CardTitle className="text-red-700">Incident Details Form</CardTitle>
          <CardDescription>All fields marked with an asterisk (*) are required.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4 shadow-sm border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Consent to Data Collection</h3>
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="incidentConsent" 
                  name="incidentConsent" 
                  className="mt-1 w-4 h-4 text-teal-600 rounded" 
                  required 
                />
                <Label htmlFor="incidentConsent" className="text-sm font-normal text-slate-600">
                  I consent to the processing of the information provided strictly for the purpose of cyber incident investigation by BOCRA according to the <a href="/privacy-policy" className="text-teal-600 underline">Privacy Policy</a>. Data will only be shared with law enforcement if legally mandated.
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Your Name / Organization</Label>
                <Input id="reporterName" required placeholder="John Doe or Company Ltd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input id="contactEmail" type="email" required placeholder="For follow-up contact" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentType">Type of Incident *</Label>
              <select 
                id="incidentType" 
                required 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an incident type...</option>
                <option value="data_breach">Data Breach (Unauthorized Access)</option>
                <option value="ransomware">Ransomware / Malware</option>
                <option value="ddos">DDoS Attack</option>
                <option value="phishing">Phishing / Social Engineering</option>
                <option value="vulnerability">System Vulnerability Discovery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfIncident">Approximate Date & Time of Incident</Label>
              <Input id="dateOfIncident" type="datetime-local" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Incident Description *</Label>
              <Textarea 
                id="description" 
                required 
                placeholder="Please describe exactly what happened, when you noticed it, and any systems affected..." 
                rows={5} 
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Reporting...' : 'Submit Incident Report securely'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CyberIncidentReport;
