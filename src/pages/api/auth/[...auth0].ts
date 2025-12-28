import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

// Ensure environment variables are loaded
if (!process.env.DATABASE_URL) {
  console.error('AUTH0 CALLBACK ERROR: DATABASE_URL not found in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
}

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { connection } = req.query;
      
      await handleLogin(req, res, {
        authorizationParams: {
          ...(connection && typeof connection === 'string' ? { connection } : {}),
        },
        returnTo: (req.query.returnTo as string) || '/home',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).end();
    }
  },
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Debug environment variables
      if (process.env.NODE_ENV === 'development') {
        console.log('NEXT_PUBLIC_BASE_URL =', process.env.NEXT_PUBLIC_BASE_URL);
        console.log('NEXT_PUBLIC_AUTH0_DOMAIN =', process.env.NEXT_PUBLIC_AUTH0_DOMAIN);
        console.log('Current callback URL should be:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`);
      }
      
      // Handle the standard Auth0 callback
      await handleCallback(req, res, {
        afterCallback: async (req, res, session) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Auth callback - DATABASE_URL exists:', !!process.env.DATABASE_URL)
              console.log('Auth callback - DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...')
            }
            
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
              // Try to create a new user (social login users)
              const createUserPromise = prisma.user.create({
                data: {
                  auth0Id: session.user.sub,
                  email: session.user.email || '',
                  fullName: session.user.name || '',
                  profilePhoto: session.user.picture || '',
                  role: 'USER',
                  isProfileSetup: false  // Will need to complete profile setup
                }
              });

              await Promise.race([createUserPromise, timeoutPromise]);

              return {
                ...session,
                user: {
                  ...session.user,
                  isProfileSetup: false
                }
              };
            }

            return {
              ...session,
              user: {
                ...session.user
              }
            };
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Database unavailable in auth callback, proceeding with Auth0 session only');
            }
            
            // Fallback: Allow login even when database is unavailable
            return {
              ...session,
              user: {
                ...session.user
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