import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const TypeApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    equipmentName: '',
    manufacturer: '',
    model: '',
    category: 'Radio Communication',
    standards: '',
    description: '',
    technicalSpecs: '',
  });
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission - will be replaced with actual API call
    toast({
      title: 'Application Submitted Successfully',
      description: 'Your Type Approval application has been submitted. Application ID: APP' + Math.floor(Math.random() * 10000),
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Type Approval Application</h1>
          <p className="text-lg text-gray-600">
            Apply for equipment type approval to ensure compliance with Botswana communications standards
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-l-4 border-l-teal-600">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-teal-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Technical specifications and user manual</li>
                  <li>• Test reports from accredited laboratories</li>
                  <li>• Certificate of conformity</li>
                  <li>• Declaration of conformity signed by manufacturer</li>
                  <li>• Equipment photographs (internal and external)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Please provide accurate information about the equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Equipment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Equipment Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentName">Equipment Name *</Label>
                    <Input
                      id="equipmentName"
                      name="equipmentName"
                      value={formData.equipmentName}
                      onChange={handleInputChange}
                      placeholder="e.g., Wireless Router XR-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer *</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="e.g., Tech Corp Ltd"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model Number *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., XR500-2025"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Equipment Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option>Radio Communication</option>
                      <option>Telecommunications</option>
                      <option>Broadcasting Equipment</option>
                      <option>Wireless Devices</option>
                      <option>Satellite Equipment</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standards">Applicable Standards *</Label>
                  <Input
                    id="standards"
                    name="standards"
                    value={formData.standards}
                    onChange={handleInputChange}
                    placeholder="e.g., ITU-R, ETSI, FCC"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Equipment Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the equipment and its intended use"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicalSpecs">Technical Specifications *</Label>
                  <Textarea
                    id="technicalSpecs"
                    name="technicalSpecs"
                    value={formData.technicalSpecs}
                    onChange={handleInputChange}
                    placeholder="Frequency range, power output, modulation type, etc."
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-teal-600 font-semibold hover:text-teal-700">Click to upload</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (max. 10MB each)</p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Uploaded Files:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-teal-600 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypeApproval;
