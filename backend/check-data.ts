import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllData() {
  try {
    console.log('📊 Database Contents Summary:\n');
    
    const users = await prisma.user.count();
    const apps = await prisma.application.count();
    const docs = await prisma.document.count();
    const complaints = await prisma.complaint.count();
    const logs = await prisma.activityLog.count();
    const status = await prisma.statusCheck.count();
    
    console.log(`✅ Users: ${users}`);
    console.log(`✅ Applications: ${apps}`);
    console.log(`✅ Documents: ${docs}`);
    console.log(`✅ Complaints: ${complaints}`);
    console.log(`✅ Activity Logs: ${logs}`);
    console.log(`✅ Status Checks: ${status}`);
    
    console.log('\n📝 Sample Data:\n');
    
    const citizen = await prisma.user.findUnique({
      where: { email: 'citizen@example.com' }
    });
    console.log('Citizen:', citizen?.email, citizen?.name);
    
    const app = await prisma.application.findFirst();
    console.log('Application:', app?.referenceNumber, app?.businessName);
    
    const doc = await prisma.document.findFirst();
    console.log('Document:', doc?.fileName);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllData();
