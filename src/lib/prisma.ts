import { PrismaClient } from '@prisma/client'

// Function to get validated DATABASE_URL
function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Validate the URL format and extract database name
  try {
    const url = new URL(dbUrl)
    const pathname = url.pathname.slice(1) // Remove leading slash
    
    if (!pathname || pathname.trim() === '') {
      throw new Error(`Invalid DATABASE_URL: database name is empty. URL: ${dbUrl}`)
    }
    
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.log('Database URL validated, connecting to database:', pathname)
    }
    return dbUrl
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL format: ${(error as Error).message}`)
  }
}

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'], // Reduced logging
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma