import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  try {
    // Fetch all team members from MongoDB
    const allMembers = await prisma.teamMember.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Separate President from other members
    const president = allMembers.find((member: any) => member.role === 'President');
    const otherMembers = allMembers.filter((member: any) => member.role !== 'President');

    // Sort other members by role hierarchy
    const roleHierarchy: { [key: string]: number } = {
      'DG': 1,
      'AVS': 2,
      'Secretary': 3,
      'Joint Secretary': 4,
      'Treasurer': 5,
      'Member': 6
    };

    const sortedMembers = otherMembers.sort((a: any, b: any) => {
      const aOrder = roleHierarchy[a.role] || 999;
      const bOrder = roleHierarchy[b.role] || 999;
      return aOrder - bOrder;
    });

    return res.status(200).json({ 
      success: true, 
      data: {
        president: president || null,
        members: sortedMembers
      },
      message: 'Team members retrieved successfully'
    });

  } catch (error) {
    console.error('Error reading team members:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to read team members' 
    });
  }
}
