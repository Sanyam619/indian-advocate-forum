import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { requireAdmin } from '../../../lib/auth-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    const { judgeId } = req.body;

    if (!judgeId) {
      return res.status(400).json({ error: 'Judge ID is required' });
    }

    // Path to judges.json file
    const judgesFilePath = path.join(process.cwd(), 'src', 'data', 'judges.json');

    // Read current judges data
    const judgesFileContent = await fs.readFile(judgesFilePath, 'utf8');
    const judgesData = JSON.parse(judgesFileContent);

    // Find the judge index
    const judgeIndex = judgesData.judges.findIndex((judge: any) => judge.id === judgeId);

    if (judgeIndex === -1) {
      return res.status(404).json({ error: 'Judge not found' });
    }

    // Remove the judge
    const deletedJudge = judgesData.judges.splice(judgeIndex, 1)[0];

    // Write updated data back to file
    await fs.writeFile(judgesFilePath, JSON.stringify(judgesData, null, 2));

    return res.status(200).json({ 
      success: true, 
      message: 'Judge deleted successfully',
      deletedJudge 
    });
  } catch (error: any) {
    console.error('Delete judge error:', error);
    return res.status(500).json({ error: 'Failed to delete judge' });
  }
}
