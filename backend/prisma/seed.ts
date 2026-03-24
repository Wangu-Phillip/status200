import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.statusCheck.deleteMany();

  // Hash demo passwords
  const passwordCitizen = await bcrypt.hash('demo123456', 10);
  const passwordAdmin = await bcrypt.hash('admin123456', 10);

  // Create demo citizen user
  const citizenUser = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'citizen@example.com',
      password: passwordCitizen,
      name: 'John Citizen',
      userType: 'client',
      organization: 'General Public',
    },
  });

  // Create demo admin users for different departments
  const adminLicensing = await prisma.user.create({
    data: {
      email: 'licensing@bocra.org.bw',
      password: passwordAdmin,
      name: 'Admin - Licensing',
      userType: 'admin',
      department: 'licensing',
      organization: 'BOCRA',
    },
  });

  const adminComplaints = await prisma.user.create({
    data: {
      email: 'complaints@bocra.org.bw',
      password: passwordAdmin,
      name: 'Admin - Complaints',
      userType: 'admin',
      department: 'complaints',
      organization: 'BOCRA',
    },
  });

  const adminQoS = await prisma.user.create({
    data: {
      email: 'qos@bocra.org.bw',
      password: passwordAdmin,
      name: 'Admin - QoS',
      userType: 'admin',
      department: 'qos',
      organization: 'BOCRA',
    },
  });

  const adminTenders = await prisma.user.create({
    data: {
      email: 'tenders@bocra.org.bw',
      password: passwordAdmin,
      name: 'Admin - Tenders',
      userType: 'admin',
      department: 'tenders',
      organization: 'BOCRA',
    },
  });

  const adminGeneral = await prisma.user.create({
    data: {
      email: 'admin@bocra.org.bw',
      password: passwordAdmin,
      name: 'Super Admin',
      userType: 'admin',
      organization: 'BOCRA',
    },
  });

  console.log('Users created:', {
    citizen: citizenUser.email,
    admins: [
      adminLicensing.email,
      adminComplaints.email,
      adminQoS.email,
      adminTenders.email,
      adminGeneral.email,
    ],
  });

  // Create sample status checks
  const statusCheck1 = await prisma.statusCheck.create({
    data: {
      clientName: 'Sample Client 1',
    },
  });

  const statusCheck2 = await prisma.statusCheck.create({
    data: {
      clientName: 'Sample Client 2',
    },
  });

  console.log('Seed data created:', { statusCheck1, statusCheck2 });
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
