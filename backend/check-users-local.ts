import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@db.mqbffqueueqqklvuxqdz.supabase.co:5432/postgres"      
    }
  }
})

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('Users count:', users.length)
    console.log('Users:', JSON.stringify(users, null, 2))
  } catch (e) {
    console.error('Error connecting to DB:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
