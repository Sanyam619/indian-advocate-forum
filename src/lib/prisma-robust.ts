import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Function to manually load .env.local if DATABASE_URL is missing
function ensureEnvironmentVariables() {
  if (process.env.DATABASE_URL) {
    return; // Already loaded
  }

  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          if (key === 'DATABASE_URL' && !process.env[key]) {
            process.env[key] = value;
            console.log('📋 Manually loaded DATABASE_URL from .env.local');
          }
        }
      }
    });
  } catch (error) {
    console.error('⚠️  Could not manually load .env.local:', (error as Error).message);
  }
}

// Ensure environment variables are loaded
ensureEnvironmentVariables();

// Function to get validated DATABASE_URL
function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set even after manual loading');
  }

  // Validate the URL format and extract database name
  try {
    const url = new URL(dbUrl);
    const pathname = url.pathname.slice(1); // Remove leading slash
    
    if (!pathname || pathname.trim() === '') {
      throw new Error(`Invalid DATABASE_URL: database name is empty. URL: ${dbUrl}`);
    }
    
    console.log('🔗 Database URL validated, connecting to database:', pathname);
    return dbUrl;
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL format: ${(error as Error).message}`);
  }
}

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;