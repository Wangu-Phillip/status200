// Mock data for BOCRA clone

export const newsItems = [
  {
    id: '1',
    title: 'PUBLIC NOTICE - BOCRA WEBSITE DEVELOPMENT HACKATHON',
    date: '2025-03-15',
    category: 'Public Notice',
    excerpt: 'BOCRA invites developers to participate in website development hackathon...',
  },
  {
    id: '2',
    title: 'Press Release - BOTSWANA COLLABORATES WITH FIVE SADC MEMBER STATES',
    date: '2025-03-10',
    category: 'Press Release',
    excerpt: 'Botswana collaborates to substantially reduce and harmonise international roaming tariffs...',
  },
  {
    id: '3',
    title: 'MEDIA RELEASE - BOCRA Approves Reduced Data Prices for BTC',
    date: '2025-03-05',
    category: 'Media Release',
    excerpt: 'BOCRA has approved reduced data prices for Botswana Telecommunications Corporation...',
  },
  {
    id: '4',
    title: 'PUBLIC NOTICE - EXPRESSION OF INTEREST FOR SUPPLIER DATABASE',
    date: '2025-02-28',
    category: 'Public Notice',
    excerpt: 'Expression of Interest for inclusion in BOCRA supplier database...',
  },
];

export const documents = [
  {
    id: '1',
    title: 'Communications Regulatory Authority Act 2012',
    category: 'Legislation',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Postal Sector Licensing Framework',
    category: 'Framework',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Quality of Service Guidelines 2025',
    category: 'Guidelines',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Enforcement Guidelines',
    category: 'Guidelines',
    downloadUrl: '#',
  },
];

export const licenseTypes = [
  'Aircraft Radio Licence',
  'Amateur Radio License',
  'Broadcasting Licence',
  'Cellular Licence',
  'Citizen Band Radio Licence',
  'Point-to-Multipoint Licence',
  'Point-to-Point Licence',
  'Private Radio Communication Licence',
  'Radio Dealers Licence',
  'Radio Frequency Licence',
  'Satellite Service Licence',
  'Type Approval Licence',
  'VANS Licence',
];

export const userApplications = [
  {
    id: 'APP001',
    type: 'Type Approval',
    equipmentName: 'Wireless Router XR-500',
    submittedDate: '2025-03-01',
    status: 'Under Review',
    lastUpdated: '2025-03-15',
  },
  {
    id: 'APP002',
    type: 'Broadcasting Licence',
    equipmentName: 'FM Radio Station',
    submittedDate: '2025-02-15',
    status: 'Approved',
    lastUpdated: '2025-03-10',
  },
  {
    id: 'APP003',
    type: 'Cellular Licence',
    equipmentName: 'Mobile Network Infrastructure',
    submittedDate: '2025-01-20',
    status: 'Pending Documents',
    lastUpdated: '2025-02-28',
  },
];

export const userComplaints = [
  {
    id: 'COM001',
    subject: 'Network Quality Issues',
    operator: 'Service Provider A',
    submittedDate: '2025-03-10',
    status: 'In Progress',
  },
  {
    id: 'COM002',
    subject: 'Billing Dispute',
    operator: 'Service Provider B',
    submittedDate: '2025-02-25',
    status: 'Resolved',
  },
];

export const adminApplications = [
  {
    id: 'APP001',
    applicantName: 'Tech Solutions Ltd',
    applicantEmail: 'info@techsolutions.bw',
    type: 'Type Approval',
    equipmentName: 'Wireless Router XR-500',
    submittedDate: '2025-03-01',
    status: 'Under Review',
    priority: 'High',
  },
  {
    id: 'APP004',
    applicantName: 'Radio Waves FM',
    applicantEmail: 'admin@radiowaves.bw',
    type: 'Broadcasting Licence',
    equipmentName: 'FM Broadcasting Equipment',
    submittedDate: '2025-03-14',
    status: 'Pending Review',
    priority: 'Medium',
  },
  {
    id: 'APP005',
    applicantName: 'Network Connect Botswana',
    applicantEmail: 'licensing@netconnect.bw',
    type: 'Cellular Licence',
    equipmentName: '5G Network Infrastructure',
    submittedDate: '2025-03-12',
    status: 'Pending Review',
    priority: 'High',
  },
];

export const qosMetrics = [
  {
    operator: 'BTC',
    month: 'February 2025',
    callSuccessRate: 98.5,
    dataSpeed: 45.2,
    networkAvailability: 99.8,
    compliant: true,
  },
  {
    operator: 'Mascom',
    month: 'February 2025',
    callSuccessRate: 97.8,
    dataSpeed: 42.1,
    networkAvailability: 99.5,
    compliant: true,
  },
  {
    operator: 'Orange',
    month: 'February 2025',
    callSuccessRate: 96.9,
    dataSpeed: 38.5,
    networkAvailability: 98.9,
    compliant: false,
  },
];
