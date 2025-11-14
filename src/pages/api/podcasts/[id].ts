import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Podcast ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const podcast = await prisma.podcast.findUnique({
        where: { id },
        include: {
          uploadedBy: {
            select: {
              fullName: true,
              role: true,
            },
          },
        },
      });

      if (!podcast) {
        return res.status(404).json({ message: 'Podcast not found' });
      }

      if (!podcast.isPublished) {
        return res.status(404).json({ message: 'Podcast not published' });
      }

      return res.status(200).json({
        success: true,
        podcast,
      });
    } catch (error) {
      console.error('Error fetching podcast:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error fetching podcast' 
      });
    }
  }

  if (req.method === 'PUT') {
    const session = await getSession(req, res);
    
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
      });

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only admins can edit podcasts' });
      }

      const { title, description, videoUrl, thumbnailUrl, category, tags, isPublished } = req.body;

      const podcast = await prisma.podcast.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(videoUrl && { videoUrl: videoUrl.trim() }),
          ...(thumbnailUrl !== undefined && { thumbnailUrl: thumbnailUrl?.trim() || null }),
          ...(category && { category: category.trim() }),
          ...(tags && { tags: Array.isArray(tags) ? tags : [] }),
          ...(typeof isPublished === 'boolean' && { isPublished }),
        },
        include: {
          uploadedBy: {
            select: {
              fullName: true,
              role: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Podcast updated successfully',
        podcast,
      });
    } catch (error) {
      console.error('Error updating podcast:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error updating podcast' 
      });
    }
  }

  if (req.method === 'DELETE') {
    const session = await getSession(req, res);
    
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
      });

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only admins can delete podcasts' });
      }

      await prisma.podcast.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Podcast deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting podcast:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error deleting podcast' 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}