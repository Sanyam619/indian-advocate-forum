import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    const { teamMemberId } = req.body;

    if (!teamMemberId) {
      return res.status(400).json({ error: 'Team member ID is required' });
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id: teamMemberId }
    });

    return res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting team member:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
