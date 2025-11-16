import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

interface NewsItem {
  id: string;
  title: string;
  publishDate: string;
  category: string;
  courtName?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { limit = '10' } = req.query;
  const newsLimit = parseInt(limit as string, 10);

  try {
    // Fetch recent news from MongoDB
    const news = await prisma.news.findMany({
      take: newsLimit,
      orderBy: {
        publishDate: 'desc',
      },
      select: {
        id: true,
        title: true,
        publishDate: true,
        category: true,
        courtName: true,
      },
    });

    // Format the response
    const recentNews = news.map((item: any) => ({
      id: item.id,
      title: item.title,
      publishDate: item.publishDate.toISOString(),
      category: item.category || 'Legal News',
      courtName: item.courtName || undefined,
      slug: item.id,
    }));

    return res.status(200).json({
      success: true,
      count: recentNews.length,
      news: recentNews,
      source: 'database',
      message: 'News loaded from MongoDB'
    });
  } catch (error) {
    console.error('Error fetching recent news:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching news from database',
      news: []
    });
  }
}