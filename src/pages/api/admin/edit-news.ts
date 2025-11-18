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

    const { 
      newsId, 
      title, 
      content, 
      category, 
      imageUrl, 
      videoUrl, 
      videoThumbnail,
      courtName,
      tags,
      hasVideo 
    } = req.body;

    if (!newsId) {
      return res.status(400).json({ error: 'News ID is required' });
    }

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    // Validate Cloudinary URLs if provided
    if (imageUrl && !imageUrl.includes('cloudinary.com') && !imageUrl.includes('res.cloudinary.com')) {
      return res.status(400).json({ error: 'Please provide a valid Cloudinary image URL' });
    }

    if (videoUrl && !videoUrl.includes('cloudinary.com') && !videoUrl.includes('res.cloudinary.com')) {
      return res.status(400).json({ error: 'Please provide a valid Cloudinary video URL' });
    }

    // Update the news article
    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: {
        title,
        content,
        category,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        videoThumbnail: videoThumbnail || null,
        courtName: courtName || null,
        tags: tags || [],
        hasVideo: hasVideo || false
      }
    });

    return res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      news: updatedNews
    });

  } catch (error: any) {
    console.error('Error updating news:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News article not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
