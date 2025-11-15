import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For GET requests, allow unauthenticated access
  if (req.method === 'GET') {
    try {
      const news = await prisma.news.findMany({
        include: {
          author: {
            select: {
              fullName: true,
              role: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: {
          publishDate: 'desc',
        },
      });
      return res.status(200).json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      return res.status(500).json({ message: 'Error fetching news' });
    }
  }

  // For POST requests, check authentication
  const session = await getSession(req, res);

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const news = await prisma.news.findMany({
        include: {
          author: {
            select: {
              fullName: true,
              role: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: {
          publishDate: 'desc',
        },
      });
      return res.status(200).json(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      return res.status(500).json({ message: 'Error fetching news' });
    }
  }

  if (req.method === 'POST') {
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'ADVOCATE')) {
      return res.status(403).json({ message: 'Only admins and advocates can post news' });
    }

    try {
      const { title, content, category, imageUrl, videoUrl, videoThumbnail, hasVideo } = req.body;
      const news = await prisma.news.create({
        data: {
          title,
          content,
          category,
          imageUrl,
          videoUrl: videoUrl || null,
          videoThumbnail: videoThumbnail || null,
          hasVideo: hasVideo || false,
          authorId: user.id,
        },
      });
      return res.status(201).json(news);
    } catch (error) {
      console.error('Error creating news:', error);
      return res.status(500).json({ message: 'Error creating news' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}