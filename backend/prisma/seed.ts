import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.statusCheck.deleteMany();

  // Create sample data
  const statusCheck1 = await prisma.statusCheck.create({
    data: {
      id: uuidv4(),
      clientName: 'Sample Client 1',
    },
  });

  const statusCheck2 = await prisma.statusCheck.create({
    data: {
      id: uuidv4(),
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
