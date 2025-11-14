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

    const { podcastId } = req.body;

    if (!podcastId) {
      return res.status(400).json({ error: 'Podcast ID is required' });
    }

    // Delete the podcast
    const deletedPodcast = await prisma.podcast.delete({
      where: { id: podcastId }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Podcast deleted successfully',
      deletedPodcast 
    });
  } catch (error: any) {
    console.error('Delete podcast error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Podcast not found' });
    }
    
    return res.status(500).json({ error: 'Failed to delete podcast' });
  }
}
