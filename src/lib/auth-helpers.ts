import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from './prisma';

/**
 * Check if the current user is an admin
 * Returns the admin user if authorized, or sends an error response and returns null
 */
export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    
    if (!session?.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return null;
    }

    // Check if user exists in database and is an admin
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized: Admin access required' });
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Authentication error' });
    return null;
  }
}
