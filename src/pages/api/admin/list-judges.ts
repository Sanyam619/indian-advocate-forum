import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../../../lib/auth-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    // Path to judges.json file
    const judgesFilePath = path.join(process.cwd(), 'src', 'data', 'judges.json');

    if (!fs.existsSync(judgesFilePath)) {
      return res.status(404).json({ error: 'Judges data file not found' });
    }

    // Read judges data
    const judgesData = JSON.parse(fs.readFileSync(judgesFilePath, 'utf8'));

    // Compile all judges into a single array for admin viewing
    const allJudges: any[] = [];

    // Add current chief justice
    if (judgesData.currentChiefJustice) {
      allJudges.push({
        id: judgesData.currentChiefJustice.id,
        name: judgesData.currentChiefJustice.name,
        designation: judgesData.currentChiefJustice.position || 'Chief Justice of India',
        court: 'Supreme Court of India',
        photoUrl: judgesData.currentChiefJustice.image,
        appointmentDate: judgesData.currentChiefJustice.appointmentDate,
        category: 'Current Chief Justice'
      });
    }

    // Add current judges
    if (judgesData.currentJudges && Array.isArray(judgesData.currentJudges)) {
      judgesData.currentJudges.forEach((judge: any) => {
        allJudges.push({
          id: judge.id,
          name: judge.name,
          designation: judge.position || 'Judge',
          court: 'Supreme Court of India',
          photoUrl: judge.image,
          appointmentDate: judge.appointmentDate,
          category: 'Current Judge'
        });
      });
    }

    // Add former chief justices
    if (judgesData.formerChiefJustices && Array.isArray(judgesData.formerChiefJustices)) {
      judgesData.formerChiefJustices.forEach((judge: any) => {
        allJudges.push({
          id: judge.id,
          name: judge.name,
          designation: judge.position || 'Former Chief Justice of India',
          court: 'Supreme Court of India',
          photoUrl: judge.image,
          appointmentDate: judge.appointmentDate,
          category: 'Former Chief Justice'
        });
      });
    }

    // Add former judges
    if (judgesData.formerJudges && Array.isArray(judgesData.formerJudges)) {
      judgesData.formerJudges.forEach((judge: any) => {
        allJudges.push({
          id: judge.id,
          name: judge.name,
          designation: judge.position || 'Former Judge',
          court: 'Supreme Court of India',
          photoUrl: judge.image,
          appointmentDate: judge.appointmentDate,
          category: 'Former Judge'
        });
      });
    }

    return res.status(200).json({
      success: true,
      allJudges,
      totalJudges: allJudges.length,
      breakdown: {
        currentChiefJustice: judgesData.currentChiefJustice ? 1 : 0,
        currentJudges: judgesData.currentJudges?.length || 0,
        formerChiefJustices: judgesData.formerChiefJustices?.length || 0,
        formerJudges: judgesData.formerJudges?.length || 0
      }
    });

  } catch (error: any) {
    console.error('List judges error:', error);
    return res.status(500).json({ error: 'Failed to retrieve judges data' });
  }
}
