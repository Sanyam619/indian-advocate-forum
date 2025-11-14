import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (req.method === 'GET') {
    const { page = '1', limit = '12', category } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    try {
      // Build where clause
      const whereClause: any = {
        isPublished: true,
      };

      if (category && category !== 'all') {
        whereClause.category = category;
      }

      // Try database first with timeout
      const [podcasts, totalCount] = await Promise.race([
        Promise.all([
          prisma.podcast.findMany({
            where: whereClause,
            include: {
              uploadedBy: {
                select: {
                  fullName: true,
                  role: true,
                },
              },
            },
            orderBy: [
              { publishDate: 'desc' },
              { createdAt: 'desc' },
            ],
            skip: skip,
            take: limitNum,
          }),
          prisma.podcast.count({
            where: whereClause,
          })
        ]),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 1500)
        )
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      return res.status(200).json({
        success: true,
        podcasts,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error('Database unavailable, returning empty podcasts:', error);
      
      // Return empty results when database is unavailable
      return res.status(200).json({
        success: true,
        podcasts: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalCount: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }
  }

  if (req.method === 'POST') {
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
      });

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only admins can create podcasts' });
      }

      const { title, description, videoUrl, thumbnailUrl, category, tags } = req.body;

      // Validate required fields
      if (!title || !description || !videoUrl || !category) {
        return res.status(400).json({ 
          message: 'Title, description, video URL, and category are required' 
        });
      }

      // Validate video URL format
      if (!videoUrl.includes('cloudinary.com') && !videoUrl.includes('res.cloudinary.com')) {
        return res.status(400).json({ 
          message: 'Please provide a valid Cloudinary video URL' 
        });
      }

      const podcast = await prisma.podcast.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl?.trim() || null,
          category: category.trim(),
          tags: Array.isArray(tags) ? tags : [],
          uploadedById: user.id,
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

      return res.status(201).json({
        success: true,
        message: 'Podcast created successfully',
        podcast,
      });
    } catch (error) {
      console.error('Error creating podcast:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error creating podcast' 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}