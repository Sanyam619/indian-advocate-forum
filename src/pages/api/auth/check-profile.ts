import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Add shorter timeout for database operations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), 2000) // Reduced to 2s
    });

    const userPromise = prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub
      }
    });

    const user = await Promise.race([userPromise, timeoutPromise]);

    return res.status(200).json({
      isProfileSetup: Boolean((user as any)?.isProfileSetup),
      user: user
    });
  } catch (error) {
    // Silently handle database timeouts to reduce console noise
    if (error instanceof Error && 
        (error.message.includes('Database operation timeout') || 
         error.message.includes('Server selection timeout') ||
         error.message.includes('InternalError'))) {
      // Return default response for timeout issues without logging
      return res.status(200).json({
        isProfileSetup: false,
        user: null
      });
    }
    
    console.error('Check profile error:', error);
    return res.status(500).json({ error: 'Failed to check profile' });
  }
}