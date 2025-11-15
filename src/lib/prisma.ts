import { PrismaClient } from '@prisma/client'

// Function to get validated DATABASE_URL
function getDatabaseUrl(): string | undefined {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    // During build time, return undefined to skip Prisma initialization
    console.warn('DATABASE_URL not set - Prisma client will not be initialized')
    return undefined
  }

  // Validate the URL format and extract database name
  try {
    const url = new URL(dbUrl)
    const pathname = url.pathname.slice(1) // Remove leading slash
    
    if (!pathname || pathname.trim() === '') {
      console.warn(`Invalid DATABASE_URL: database name is empty`)
      return undefined
    }
    
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Database URL validated, connecting to database:', pathname)
      }
    }
    return dbUrl
  } catch (error) {
    console.error(`Invalid DATABASE_URL format: ${(error as Error).message}`)
    return undefined
  }
}

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const databaseUrl = getDatabaseUrl()

export const prisma = databaseUrl 
  ? (globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    }))
  : null as any // Return null if no database URL (build time)

// Graceful shutdown - only if prisma is initialized
if (prisma) {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma

export default prisma