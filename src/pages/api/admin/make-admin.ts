import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

/**
 * ADMIN ENDPOINT - Only existing admins can promote other users
 * First admin must be created directly in MongoDB
 */
export default async function makeAdmin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if requester is an admin
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const requester = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!requester || requester.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        role: 'ADMIN'
      }
    });

    console.log(`🔑 ADMIN GRANTED: ${userEmail} is now an admin`);

    return res.status(200).json({ 
      message: 'User promoted to admin successfully',
      user: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Make admin error:', error);
    return res.status(500).json({ error: 'Failed to make user admin' });
  }
}