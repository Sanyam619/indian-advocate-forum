import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  try {
    // Fetch all judges from MongoDB
    const allJudges = await prisma.judge.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group judges by category
    const currentChiefJustice = allJudges.find((j: any) => j.category === 'Current Chief Justice');
    const currentJudges = allJudges.filter((j: any) => j.category === 'Current Judge');
    const formerChiefJustices = allJudges.filter((j: any) => j.category === 'Former Chief Justice');
    const formerJudges = allJudges.filter((j: any) => j.category === 'Former Judge');
    
    // Combine all current judges (both Chief Justice and regular judges) for the current judges page
    const allCurrentJudges = allJudges.filter((j: any) => 
      j.category === 'Current Chief Justice' || j.category === 'Current Judge'
    );

    // Format judges for frontend (map photoUrl to image field for backwards compatibility)
    const formatJudge = (judge: any) => ({
      ...judge,
      image: judge.photoUrl,
      position: judge.designation,
    });

    return res.status(200).json({ 
      success: true, 
      data: {
        currentChiefJustice: currentChiefJustice ? formatJudge(currentChiefJustice) : null,
        currentJudges: currentJudges.map(formatJudge),
        allCurrentJudges: allCurrentJudges.map(formatJudge), // Combined current judges for /judges/current page
        formerChiefJustices: formerChiefJustices.map(formatJudge),
        formerJudges: formerJudges.map(formatJudge),
      },
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