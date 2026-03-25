import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Upload, CheckCircle2 } from 'lucide-react';

const TenderSubmission = ({ setActiveTab }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Tender Submitted",
        description: "Your tender application has been successfully submitted.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your tender submission. You will receive an email confirmation shortly.
            </p>
            <Button onClick={() => setActiveTab ? setActiveTab('dashboard') : window.location.href = '/dashboard'}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tender Submission</h1>
        <p className="text-gray-600">
          Submit your proposal for active BOCRA tenders. Make sure all required documents are attached.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission Details</CardTitle>
          <CardDescription>Enter your company and tender details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 shadow-sm border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Consent to Data Collection</h3>
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="dataConsent" 
                  name="dataConsent" 
                  className="mt-1 w-4 h-4 text-teal-600 rounded" 
                  required 
                />
                <Label htmlFor="dataConsent" className="text-sm font-normal text-slate-600">
                  I consent to the collection and processing of my personal and company data for the purpose of this tender application in accordance with the <a href="/privacy-policy" className="text-teal-600 underline">Privacy Policy</a>. Data will be retained for up to 5 years per the Data Protection Act for audition purposes.
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" required placeholder="e.g. Solutions Ltd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenderReference">Tender Reference Number</Label>
                <Input id="tenderReference" required placeholder="e.g. BOCRA/PT/001/2026" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposalTitle">Proposal Title</Label>
              <Input id="proposalTitle" required placeholder="Title of your submission" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description / Executive Summary</Label>
              <Textarea id="description" required placeholder="Provide a brief overview of your proposal..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Upload Tender Documents (.pdf, .zip)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Drag and drop your files here, or click to browse</p>
                <Input id="documents" type="file" required className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('documents').click()}>
                  Select Files
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Tender'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderSubmission;
