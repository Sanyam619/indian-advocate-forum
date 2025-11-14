import { NextApiRequest, NextApiResponse } from 'next';
import supremeCourtNews from '../../../../data/news/supreme-court.json';
import bombayHighCourtNews from '../../../../data/news/bombay-high-court.json';
import calcuttaHighCourtNews from '../../../../data/news/calcutta-high-court.json';
import delhiHighCourtNews from '../../../../data/news/delhi-high-court.json';

import highCourtNews from '../../../../data/news/high-courts.json';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  courtType: string;
  publishDate: string;
  readTime: number;
  tags: string[];
  imageUrl: string;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  hasVideo?: boolean;
}

interface CourtNewsData {
  courtType: string;
  courtName: string;
  description: string;
  news: NewsItem[];
}

const newsData: { [key: string]: CourtNewsData } = {
  'supreme-court': supremeCourtNews as CourtNewsData,
  'bombay-high-court': bombayHighCourtNews as CourtNewsData,
  'calcutta-high-court': calcuttaHighCourtNews as CourtNewsData,
  'delhi-high-court': delhiHighCourtNews as CourtNewsData,
  'high-courts': highCourtNews as CourtNewsData,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type } = req.query;

  if (typeof type !== 'string' || !newsData[type]) {
    return res.status(400).json({ message: 'Invalid court type' });
  }

  try {
    const courtData = newsData[type];
    const news = courtData.news;
    
    // Sort by publish date (newest first)
    const sortedNews = news.sort((a: NewsItem, b: NewsItem) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return res.status(200).json({
      courtInfo: {
        courtType: courtData.courtType,
        courtName: courtData.courtName,
        description: courtData.description,
      },
      news: sortedNews
    });
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return res.status(500).json({ message: 'Error fetching news' });
  }
}