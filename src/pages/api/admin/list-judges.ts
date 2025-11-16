import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/auth-helpers';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    // Fetch all judges from MongoDB
    const allJudges = await prisma.judge.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate breakdown by category
    const breakdown = {
      currentChiefJustice: allJudges.filter((j: any) => j.category === 'Current Chief Justice').length,
      currentJudges: allJudges.filter((j: any) => j.category === 'Current Judge').length,
      formerChiefJustices: allJudges.filter((j: any) => j.category === 'Former Chief Justice').length,
      formerJudges: allJudges.filter((j: any) => j.category === 'Former Judge').length
    };

    return res.status(200).json({
      success: true,
      allJudges,
      totalJudges: allJudges.length,
      breakdown
    });

  } catch (error: any) {
    console.error('List judges error:', error);
    return res.status(500).json({ error: 'Failed to retrieve judges data' });
  }
}
