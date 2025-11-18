import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/auth-helpers';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { podcastId, title, description, videoUrl, thumbnailUrl, category, tags } = req.body;

    if (!podcastId) {
      return res.status(400).json({ error: 'Podcast ID is required' });
    }

    if (!title || !videoUrl) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }

    // Validate Cloudinary URLs
    if (videoUrl && !videoUrl.includes('cloudinary.com') && !videoUrl.includes('res.cloudinary.com')) {
      return res.status(400).json({ error: 'Please provide a valid Cloudinary video URL' });
    }

    if (thumbnailUrl && !thumbnailUrl.includes('cloudinary.com') && !thumbnailUrl.includes('res.cloudinary.com')) {
      return res.status(400).json({ error: 'Please provide a valid Cloudinary thumbnail URL' });
    }

    // Update the podcast
    const updatedPodcast = await prisma.podcast.update({
      where: { id: podcastId },
      data: {
        title,
        description: description || '',
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        category: category || 'General',
        tags: tags || []
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Podcast updated successfully',
      podcast: updatedPodcast
    });

  } catch (error: any) {
    console.error('Error updating podcast:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Podcast not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
