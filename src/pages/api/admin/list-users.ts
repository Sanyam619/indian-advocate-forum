import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth-helpers';

/**
 * ADMIN ENDPOINT - List all users and their roles
 * Requires user to be logged in as an admin
 */
export default async function listUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    // Get all users with their basic info and roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        barRegistrationNo: true,
        yearsOfExperience: true,
        createdAt: true,
        profilePhoto: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group users by role for easier viewing
    const usersByRole = {
      ADMIN: users.filter((u: typeof users[0]) => u.role === 'ADMIN'),
      ADVOCATE: users.filter((u: typeof users[0]) => u.role === 'ADVOCATE'),
      USER: users.filter((u: typeof users[0]) => u.role === 'USER')
    };

    return res.status(200).json({ 
      totalUsers: users.length,
      usersByRole,
      allUsers: users
    });

  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Failed to list users' });
  }
}