import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`Users in database: ${userCount}`);
    
    // Get all users
    const users = await prisma.user.findMany();
    console.log('Users:', users);
    
    // Count applications
    const appCount = await prisma.application.count();
    console.log(`Applications in database: ${appCount}`);
    
    // Get all applications
    const apps = await prisma.application.findMany();
    console.log('Applications:', apps);
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
