import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid team member ID' });
  }

  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id: id
      }
    });

    if (!teamMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team member not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: teamMember,
      message: 'Team member retrieved successfully'
    });

  } catch (error) {
    console.error('Error reading team member:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to read team member data' 
    });
  }
}
