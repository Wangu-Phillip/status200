import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();
  await prisma.statusCheck.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Hash demo passwords
  const passwordCitizen = await bcrypt.hash('password123', 10);
  const passwordAdmin = await bcrypt.hash('admin123456', 10);

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
      email: 'licensing@bocra.gov.zm',
      password: passwordAdmin,
      name: 'Admin - Licensing',
      userType: 'admin',
      department: 'licensing',
      organization: 'BOCRA',
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'complaints@bocra.gov.zm',
      password: passwordAdmin,
      name: 'Admin - Complaints',
      userType: 'admin',
      department: 'complaints',
      organization: 'BOCRA',
    },
  });

  console.log('✅ Created admin users');

  // Create test status checks
  await prisma.statusCheck.create({
    data: {
      id: uuidv4(),
      clientName: 'Test Client 1',
      timestamp: new Date(),
    },
  });

  console.log('✅ Created status checks');

  console.log('\n✨ Database seed completed successfully!\n');
  console.log('📋 Test Credentials:');
  console.log('   Citizen User: citizen@example.com / password123');
  console.log('   Admin (Licensing): licensing@bocra.gov.zm / admin123456');
  console.log('   Admin (Complaints): complaints@bocra.gov.zm / admin123456');
  console.log('\n📊 Test Data Summary:');
  console.log('   - 1 citizen user created');
  console.log('   - 2 admin users created');
  console.log('   - 2 applications created');
  console.log('   - 2 complaints created');
  console.log('   - 2 documents created');
  console.log('   - 4 activity logs created');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

