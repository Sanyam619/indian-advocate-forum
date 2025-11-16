import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/auth-helpers';
import prisma from '../../../lib/prisma';

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

    // Delete judge from MongoDB
    const deletedJudge = await prisma.judge.delete({
      where: { id: judgeId }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Judge deleted successfully',
      deletedJudge 
    });
  } catch (error: any) {
    console.error('Delete judge error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Judge not found' });
    }
    return res.status(500).json({ error: 'Failed to delete judge' });
  }
}
