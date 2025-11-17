import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    // Fetch all team members
    const allTeamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    return res.status(200).json({
      success: true,
      teamMembers: allTeamMembers,
      totalTeamMembers: allTeamMembers.length
    });

  } catch (error) {
    console.error('Error listing team members:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
