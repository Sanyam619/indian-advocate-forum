import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    const { newsId } = req.body;

    if (!newsId) {
      return res.status(400).json({ error: 'News ID is required' });
    }

    // Delete the news article
    const deletedNews = await prisma.news.delete({
      where: { id: newsId }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'News article deleted successfully',
      deletedNews 
    });
  } catch (error: any) {
    console.error('Delete news error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News article not found' });
    }
    
    return res.status(500).json({ error: 'Failed to delete news article' });
  }
}
