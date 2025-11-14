import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth-helpers';

/**
 * ADMIN ENDPOINT - Remove admin privileges from a user
 * Requires admin authentication
 */
export default async function removeAdmin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

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

    // Update user role back to USER (or keep as ADVOCATE if they have advocate credentials)
    const newRole = user.barRegistrationNo ? 'ADVOCATE' : 'USER';
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole }
    });

    console.log(`🔓 ADMIN REMOVED: ${userEmail} is no longer an admin (now ${newRole})`);

    return res.status(200).json({ 
      message: 'Admin privileges removed successfully',
      user: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Remove admin error:', error);
    return res.status(500).json({ error: 'Failed to remove admin privileges' });
  }
}