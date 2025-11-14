import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

// Ensure environment variables are loaded
if (!process.env.DATABASE_URL) {
  console.error('AUTH0 CALLBACK ERROR: DATABASE_URL not found in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
}

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Debug environment variables
      console.log('NEXT_PUBLIC_BASE_URL =', process.env.NEXT_PUBLIC_BASE_URL);
      console.log('NEXT_PUBLIC_AUTH0_DOMAIN =', process.env.NEXT_PUBLIC_AUTH0_DOMAIN);
      console.log('Current callback URL should be:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`);
      
      // Handle the standard Auth0 callback
      await handleCallback(req, res, {
        afterCallback: async (req, res, session) => {
          try {
            console.log('Auth callback - DATABASE_URL exists:', !!process.env.DATABASE_URL)
            console.log('Auth callback - DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...')
            
            // Add timeout for database operations
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Database operation timeout')), 3000);
            });

            // Check if this is a new user
            const userPromise = prisma.user.findUnique({
              where: { auth0Id: session.user.sub }
            });

            const existingUser = await Promise.race([userPromise, timeoutPromise]) as any;

            if (!existingUser) {
              // Try to create a new user
              const createUserPromise = prisma.user.create({
                data: {
                  auth0Id: session.user.sub,
                  email: session.user.email || '',
                  fullName: session.user.name || '',
                  profilePhoto: session.user.picture || '',
                  role: 'USER',
                  isVerified: false,
                  isProfileSetup: false  // Explicitly set to false for new users
                }
              });

              await Promise.race([createUserPromise, timeoutPromise]);

              return {
                ...session,
                user: {
                  ...session.user,
                  isVerified: false,
                  isProfileSetup: false
                }
              };
            }

            return {
              ...session,
              user: {
                ...session.user,
                isVerified: existingUser.isVerified
              }
            };
          } catch (error) {
            console.log('Database unavailable in auth callback, proceeding with Auth0 session only');
            
            // Fallback: Allow login even when database is unavailable
            return {
              ...session,
              user: {
                ...session.user,
                isVerified: true // Allow access when DB is unavailable
              }
            };
          }
        }
      });
    } catch (error) {
      console.error('Auth0 Callback Error:', error);
      const statusCode = (error as any)?.status || 500;
      const errorMessage = (error as Error)?.message || 'Internal Server Error';
      
      res.status(statusCode).json({ 
        error: true, 
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error })
      });
    }
  }
});