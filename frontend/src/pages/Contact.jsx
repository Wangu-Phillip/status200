import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Message Sent Successfully',
      description: 'We will respond to your inquiry within 24-48 hours.',
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Physical Address',
      details: ['Plot 50671 Independence Avenue', 'Gaborone', 'Botswana'],
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+267 395 7755', '+267 395 7976 (Fax)'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@bocra.org.bw', 'complaints@bocra.org.bw'],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 7:30 AM - 4:30 PM', 'Saturday - Sunday: Closed'],
    },
  ];

  const departments = [
    { name: 'General Inquiries', email: 'info@bocra.org.bw', phone: '+267 395 7755' },
    { name: 'Licensing & Type Approval', email: 'licensing@bocra.org.bw', phone: '+267 395 7756' },
    { name: 'Consumer Complaints', email: 'complaints@bocra.org.bw', phone: '+267 395 7757' },
    { name: 'Spectrum Management', email: 'spectrum@bocra.org.bw', phone: '+267 395 7758' },
    { name: 'QoS & Compliance', email: 'qos@bocra.org.bw', phone: '+267 395 7759' },
    { name: 'Media Relations', email: 'media@bocra.org.bw', phone: '+267 395 7760' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#003366] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with BOCRA for inquiries, complaints, or regulatory guidance
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#E8F0F9] rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#003366]" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm mb-1">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+267 xxx xxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Your message here..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#003366] hover:bg-[#0A4D8C] text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map and Departments */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Location</h2>
              <Card className="shadow-lg mb-6">
                <CardContent className="p-0">
                  <div className="w-full h-80 bg-gray-200 rounded-t-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.123!2d25.908!3d-24.653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM5JzEwLjgiUyAyNcKwNTQnMjguOCJF!5e0!3m2!1sen!2sbw!4v1234567890"
                      width="100%"
                      height="320"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="BOCRA Location"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Department Contacts</h3>
              <div className="space-y-3">
                {departments.map((dept, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{dept.name}</h4>
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-[#003366]" />
                          {dept.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-[#003366]" />
                          {dept.phone}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
