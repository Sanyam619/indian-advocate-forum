import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  courtName?: string;
  publishDate: string;
  readTime?: number | null;
  tags: string[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  hasVideo?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type } = req.query;

  if (typeof type !== 'string') {
    return res.status(400).json({ message: 'Invalid court type' });
  }

  try {
    // Map URL-friendly court type to database court name
    const courtNameMap: { [key: string]: string } = {
      'supreme-court': 'Supreme Court of India',
      'bombay-high-court': 'Bombay High Court',
      'calcutta-high-court': 'Calcutta High Court',
      'delhi-high-court': 'Delhi High Court',
      'allahabad-high-court': 'Allahabad High Court',
      'andhra-pradesh-high-court': 'Andhra Pradesh High Court',
      'chhattisgarh-high-court': 'Chhattisgarh High Court',
      'gauhati-high-court': 'Gauhati High Court',
      'gujarat-high-court': 'Gujarat High Court',
      'himachal-pradesh-high-court': 'Himachal Pradesh High Court',
      'jammu-kashmir-ladakh-high-court': 'Jammu & Kashmir and Ladakh High Court',
      'jharkhand-high-court': 'Jharkhand High Court',
      'karnataka-high-court': 'Karnataka High Court',
      'kerala-high-court': 'Kerala High Court',
      'madhya-pradesh-high-court': 'Madhya Pradesh High Court',
      'madras-high-court': 'Madras High Court',
      'manipur-high-court': 'Manipur High Court',
      'meghalaya-high-court': 'Meghalaya High Court',
      'orissa-high-court': 'Orissa High Court',
      'patna-high-court': 'Patna High Court',
      'punjab-haryana-high-court': 'Punjab and Haryana High Court',
      'rajasthan-high-court': 'Rajasthan High Court',
      'sikkim-high-court': 'Sikkim High Court',
      'telangana-high-court': 'Telangana High Court',
      'tripura-high-court': 'Tripura High Court',
      'uttarakhand-high-court': 'Uttarakhand High Court',
    };

    const courtName = courtNameMap[type];

    // For "high-courts" category, fetch all high court news
    if (type === 'high-courts') {
      const news = await prisma.news.findMany({
        where: {
          courtName: {
            not: 'Supreme Court of India',
          },
        },
        orderBy: {
          publishDate: 'desc',
        },
      });

      const formattedNews = news.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        courtName: item.courtName || undefined,
        publishDate: item.publishDate.toISOString(),
        readTime: item.readTime,
        tags: item.tags || [],
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        videoThumbnail: item.videoThumbnail,
        hasVideo: item.hasVideo || false,
      }));

      return res.status(200).json({
        courtInfo: {
          courtType: 'high-courts',
          courtName: 'All High Courts',
          description: 'News and updates from all High Courts across India',
        },
        news: formattedNews,
      });
    }

    // Fetch news for specific court
    if (!courtName) {
      return res.status(400).json({ message: 'Invalid court type' });
    }

    const news = await prisma.news.findMany({
      where: {
        courtName: courtName,
      },
      orderBy: {
        publishDate: 'desc',
      },
    });

    const formattedNews = news.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      courtName: item.courtName || undefined,
      publishDate: item.publishDate.toISOString(),
      readTime: item.readTime,
      tags: item.tags || [],
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      videoThumbnail: item.videoThumbnail,
      hasVideo: item.hasVideo || false,
    }));

    return res.status(200).json({
      courtInfo: {
        courtType: type,
        courtName: courtName,
        description: `News and updates from ${courtName}`,
      },
      news: formattedNews,
    });
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return res.status(500).json({ message: 'Error fetching news' });
  }
}