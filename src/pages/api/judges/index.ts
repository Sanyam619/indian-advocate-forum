import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  try {
    // Fetch all judges from MongoDB
    const judges = await prisma.judge.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ 
      success: true, 
      data: judges,
      message: 'Judges data retrieved successfully'
    });

  } catch (error) {
    console.error('Error reading judges data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to read judges data' 
    });
  }
}