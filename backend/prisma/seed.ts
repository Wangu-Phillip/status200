import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in correct order to avoid FK issues
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.application.deleteMany();
  await prisma.tenderPostingDocument.deleteMany();
  await prisma.tenderPosting.deleteMany();
  await prisma.user.deleteMany();
  await prisma.statusCheck.deleteMany();
  await prisma.typeApprovedDevice.deleteMany();
  await prisma.systemSettings.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Hash demo passwords
  const passwordCitizen = await bcrypt.hash('password123', 10);
  const passwordAdmin = await bcrypt.hash('admin123456', 10);
  const passwordSuperAdmin = await bcrypt.hash('SuperAdmin123!', 10);
  const passwordLicenseAdmin = await bcrypt.hash('LicenseAdmin123!', 10);
  const passwordComplaintsAdmin = await bcrypt.hash('ComplaintsAdmin123!', 10);
  const passwordQoSAdmin = await bcrypt.hash('QoSAdmin123!', 10);
  const passwordTendersAdmin = await bcrypt.hash('TendersAdmin123!', 10);

  // Create test citizen user
  const citizen = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'citizen@example.com',
      password: passwordCitizen,
      name: 'John Doe',
      phone: '+260-977-123456',
      address: '123 Main Street, Lusaka',
      userType: 'client',
      tier: 'Tier 1 Citizen',
      trustScore: 82,
      organization: 'Tech Innovations Ltd',
    },
  });

  console.log('✅ Created test citizen:', citizen.email);

  // Create applications
  const app1 = await prisma.application.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      referenceNumber: 'APP0001',
      applicationType: 'network_license',
      businessName: 'BOCRA-INFRA',
      sector: 'Telecommunications',
      description:
        'Application for network license renewal for backbone infrastructure',
      status: 'Pending Documents',
    },
  });

  const app2 = await prisma.application.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      referenceNumber: 'APP0002',
      applicationType: 'type_approval',
      businessName: 'Device Certification Request',
      sector: 'Broadcasting',
      description: 'Type approval for new broadcasting equipment model TP-502',
      status: 'Under Review',
    },
  });

  console.log('✅ Created 2 test applications');

  // Create documents for applications
  await prisma.document.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      applicationId: app1.id,
      filename: 'License_Request.pdf',
      category: 'application',
      documentType: 'required',
      status: 'pending_upload',
    },
  });

  await prisma.document.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      applicationId: app1.id,
      filename: 'Company_Certificate.pdf',
      category: 'application',
      documentType: 'submitted',
      status: 'uploaded',
      uploadedDate: new Date('2024-03-24'),
    },
  });

  console.log('✅ Created application documents');

  // Create complaints
  const complaint1 = await prisma.complaint.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      ticketNumber: 'COMP0001',
      complaintType: 'broadcasting_complaint',
      complainantName: citizen.name,
      complainantEmail: citizen.email,
      complainantPhone: citizen.phone || '',
      description:
        'Complaint registered against Regional Operator for service disruption',
      againstOperator: 'Regional Operator Ltd',
      dateOfIncident: new Date('2024-03-23'),
      status: 'Under Review',
      priority: 'high',
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      ticketNumber: 'COMP0002',
      complaintType: 'service_violation',
      complainantName: citizen.name,
      complainantEmail: citizen.email,
      complainantPhone: citizen.phone || '',
      description:
        'Quality of service below minimum standards for mobile services',
      againstOperator: 'Mobile Network Operator',
      dateOfIncident: new Date('2024-03-20'),
      status: 'Registered',
      priority: 'normal',
    },
  });

  console.log('✅ Created 2 test complaints');

  // Create activity logs
  await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      action: 'login',
      actionType: 'login',
      description: 'User logged in',
      status: 'successful',
    },
  });

  await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      action: 'application_submitted',
      actionType: 'application',
      description: 'Submitted application: BOCRA-INFRA',
      entityId: app1.id,
      status: 'successful',
    },
  });

  await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      action: 'complaint_filed',
      actionType: 'complaint',
      description: 'Filed complaint against Regional Operator Ltd',
      entityId: complaint1.id,
      status: 'successful',
    },
  });

  await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      userId: citizen.id,
      action: 'document_uploaded',
      actionType: 'document',
      description: 'Uploaded document: Company_Certificate.pdf',
      status: 'successful',
    },
  });

  console.log('✅ Created activity logs');

  // Create admin users for different departments
  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'superadmin@bocra.org.bw',
      password: passwordSuperAdmin,
      name: 'Super Admin',
      userType: 'admin',
      adminLevel: 'superadmin',
      department: null, // Superadmin has no default department
      organization: 'BOCRA',
    },
  });

  console.log('✅ Created superadmin user');

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin.licensing@bocra.org.bw',
      password: passwordLicenseAdmin,
      name: 'Licensing Admin',
      userType: 'admin',
      adminLevel: 'admin',
      department: 'licensing',
      organization: 'BOCRA',
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin.complaints@bocra.org.bw',
      password: passwordComplaintsAdmin,
      name: 'Complaints Admin',
      userType: 'admin',
      adminLevel: 'admin',
      department: 'complaints',
      organization: 'BOCRA',
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin.qos@bocra.org.bw',
      password: passwordQoSAdmin,
      name: 'QoS Admin',
      userType: 'admin',
      adminLevel: 'admin',
      department: 'qos',
      organization: 'BOCRA',
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin.tenders@bocra.org.bw',
      password: passwordTendersAdmin,
      name: 'Tenders Admin',
      userType: 'admin',
      adminLevel: 'admin',
      department: 'tenders',
      organization: 'BOCRA',
    },
  });

  console.log('✅ Created 4 department-scoped admin users');

  // Create Tender Postings (Public view)
  const tenderPostings = [
    {
      tenderNumber: 'BOCRA/T/001/2025',
      title: 'Provision of Quality of Service (QoS) Regional Monitoring Systems',
      description: 'Supply, installation and commissioning of terrestrial QoS monitoring nodes for SADC regional integration.',
      status: 'Open',
      category: 'IT Infrastructure',
      estimatedValue: 1200000.00,
      location: 'Gaborone (Headquarters)',
      closingDate: new Date('2025-06-30'),
    },
    {
      tenderNumber: 'BOCRA/T/002/2025',
      title: 'Spectrum Management Software Upgrade',
      description: 'Consultancy services for the comprehensive upgrade of national spectrum monitoring software.',
      status: 'Open',
      category: 'Professional Services',
      estimatedValue: 450000.00,
      location: 'National Deployment',
      closingDate: new Date('2025-05-15'),
    },
    {
      tenderNumber: 'BOCRA/T/045/2024',
      title: 'Cybersecurity Awareness Campaign 2024/25',
      description: 'Implementation of a national digital literacy and cybersecurity safety campaign for SMEs.',
      status: 'Awarded',
      category: 'Marketing & Communication',
      estimatedValue: 280000.00,
      location: 'All Regions',
      closingDate: new Date('2024-12-10'),
    }
  ];

  for (const posting of tenderPostings) {
    const p = await prisma.tenderPosting.create({
      data: {
        id: uuidv4(),
        ...posting,
      },
    });

    // Add a document for the open tenders
    if (posting.status === 'Open') {
      await prisma.tenderPostingDocument.create({
        data: {
          id: uuidv4(),
          tenderPostingId: p.id,
          name: 'Technical_Specifications_v1.pdf',
          path: '/uploads/tender_specs.pdf',
          fileType: 'application/pdf',
        }
      });
    }
  }

  console.log('✅ Created 3 public tender postings');

  // Create test status checks
  await prisma.statusCheck.create({
    data: {
      id: uuidv4(),
      clientName: 'Test Client 1',
      timestamp: new Date(),
    },
  });

  console.log('✅ Created status checks');

  // Create type-approved devices
  const typeApprovedDevices = [
    {
      deviceName: 'Gaborone Fiber Gateway G1',
      manufacturer: 'BOCRA-Tech Solutions',
      model: 'GW-BW-500',
      certificateNumber: 'TA-BW-2025-001',
      category: 'Broadband CPE',
      approvalDate: new Date('2025-01-15'),
      expiryDate: new Date('2028-01-15'),
      standards: 'ITU-T Y.1564, IEEE 802.3',
      status: 'Active',
      frequency: 'Ethernet / GPON',
    },
    {
      deviceName: 'Mascom Multi-Band Router',
      manufacturer: 'Wireless Global',
      model: 'M-4G-5G-PRO',
      certificateNumber: 'TA-BW-2025-002',
      category: 'Cellular Equipment',
      approvalDate: new Date('2024-11-20'),
      expiryDate: new Date('2027-11-20'),
      standards: '3GPP Release 16',
      status: 'Active',
      frequency: '700MHz, 2100MHz, 3500MHz (5G)',
    },
    {
      deviceName: 'Orange Konnect Outdoor Unit',
      manufacturer: 'Satellite-Link',
      model: 'OK-SAT-2025',
      certificateNumber: 'TA-BW-2025-003',
      category: 'Satellite Terminal',
      approvalDate: new Date('2025-02-10'),
      expiryDate: new Date('2028-02-10'),
      standards: 'DVB-S2X',
      status: 'Active',
      frequency: 'Ka-Band (26-40 GHz)',
    },
    {
      deviceName: 'Enterprise WiFi 7 Access Point',
      manufacturer: 'OmniSignal Ltd',
      model: 'AP-W7-ENT',
      certificateNumber: 'TA-BW-2024-045',
      category: 'WLAN Access Point',
      approvalDate: new Date('2024-09-05'),
      expiryDate: new Date('2027-09-05'),
      standards: 'IEEE 802.11be',
      status: 'Active',
      frequency: '2.4GHz, 5GHz, 6GHz',
    }
  ];

  for (const device of typeApprovedDevices) {
    await prisma.typeApprovedDevice.create({
      data: {
        id: uuidv4(),
        ...device,
      },
    });
  }

  console.log('✅ Created 4 refined type-approved devices');

  console.log('\n✨ Database seed completed successfully!\n');
  console.log('📋 Test Credentials:');
  console.log('   Citizen User: citizen@example.com / password123');
  console.log('\n  👑 Super Admin (Can switch departments):');
  console.log('     superadmin@bocra.org.bw / SuperAdmin123!');
  console.log('\n  🛡️  Department Admins:');
  console.log('     Licensing: admin.licensing@bocra.org.bw / LicenseAdmin123!');
  console.log('     Complaints: admin.complaints@bocra.org.bw / ComplaintsAdmin123!');
  console.log('     QoS: admin.qos@bocra.org.bw / QoSAdmin123!');
  console.log('     Tenders: admin.tenders@bocra.org.bw / TendersAdmin123!');
  console.log('\n📊 Test Data Summary:');
  console.log('   - 1 citizen user created');
  console.log('   - 1 superadmin user created');
  console.log('   - 4 department-scoped admin users created');
  console.log('   - 2 applications created');
  console.log('   - 3 public tender postings created');
  console.log('   - 2 complaints created');
  console.log('   - 2 documents created');
  console.log('   - 4 activity logs created');
  console.log('   - 4 refined registry devices created');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

