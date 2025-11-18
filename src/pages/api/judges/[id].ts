import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Judge ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const judge = await prisma.judge.findUnique({
        where: { id }
      });

      if (!judge) {
        return res.status(404).json({ success: false, message: 'Judge not found' });
      }

      // Format judge data for frontend compatibility
      const formattedJudge = {
        ...judge,
        image: judge.photoUrl,
        position: judge.designation,
      };

      return res.status(200).json({ 
        success: true, 
        judge: formattedJudge,
        message: 'Judge retrieved successfully'
      });

    } catch (error) {
      console.error('Error fetching judge:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch judge' 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
