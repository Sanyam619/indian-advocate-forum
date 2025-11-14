import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

/**
 * SUPER ADMIN ENDPOINT - Only for system owner
 * This endpoint should be protected by environment variables
 */
export default async function makeAdmin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // SECURITY: Check if request has the master key (only system owner should know this)
    const masterKey = req.headers['x-master-key'];
    if (!masterKey || masterKey !== process.env.MASTER_ADMIN_KEY) {
      return res.status(403).json({ error: 'Unauthorized: Invalid master key' });
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
        role: 'ADMIN',
        isVerified: true // Admins should be verified
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