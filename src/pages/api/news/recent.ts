import { NextApiRequest, NextApiResponse } from 'next';

// Import static news data as fallback
import supremeCourtData from '../../../data/news/supreme-court.json';
import delhiHighCourtData from '../../../data/news/delhi-high-court.json';
import bombayHighCourtData from '../../../data/news/bombay-high-court.json';
import calcuttaHighCourtData from '../../../data/news/calcutta-high-court.json';

interface NewsItem {
  id: string;
  title: string;
  publishDate: string;
  category: string;
  courtName?: string;
}

// Cache for fallback news data
let cachedFallbackNews: NewsItem[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

// Fallback function using static data
function getFallbackRecentNews(limit: number = 10) {
  const now = Date.now();
  
  // Check if we have cached data that's still valid
  if (cachedFallbackNews && (now - cacheTimestamp) < CACHE_DURATION) {
    const sortedNews = cachedFallbackNews
      .slice(0, limit)
      .map(item => ({
        id: item.id,
        title: item.title,
        publishDate: item.publishDate,
        category: item.category || 'Legal News',
        author: 'Indian Advocate Forum',
        slug: item.id
      }));
    return sortedNews;
  }

  console.log('📰 Loading fallback news data...');
  try {
    const allNews: NewsItem[] = [
      ...(supremeCourtData.news as NewsItem[]),
      ...(delhiHighCourtData.news as NewsItem[]),
      ...(bombayHighCourtData.news as NewsItem[]),
      ...(calcuttaHighCourtData.news as NewsItem[])
    ];
    
    // Cache the processed news data
    cachedFallbackNews = allNews.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    cacheTimestamp = now;
    
    console.log('📊 Total static news items loaded and cached:', allNews.length);

    const sortedNews = cachedFallbackNews
      .slice(0, limit)
      .map(item => ({
        id: item.id,
        title: item.title,
        publishDate: item.publishDate,
        category: item.category || 'Legal News',
        author: 'Indian Advocate Forum',
        slug: item.id
      }));

    console.log(`✅ Returning ${sortedNews.length} fallback news items`);
    return sortedNews;
  } catch (error) {
    console.error('Error processing fallback data:', error);
    // Return hardcoded fallback if JSON files fail
    return [
      {
        id: 'fallback-1',
        title: 'Supreme Court Delivers Landmark Judgment on Environmental Protection',
        publishDate: '2025-09-28T10:30:00Z',
        category: 'Supreme Court',
        author: 'News Team',
        slug: 'fallback-1'
      },
      {
        id: 'fallback-2',
        title: 'Delhi High Court Expedites Digital Transaction Dispute Cases',
        publishDate: '2025-09-27T14:15:00Z',
        category: 'Delhi High Court',
        author: 'News Team',
        slug: 'fallback-2'
      }
    ];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { limit = '10' } = req.query;
  const newsLimit = parseInt(limit as string, 10);

  console.log('� Loading recent news from static JSON files...');
  
  // Always use static JSON files for news data
  const recentNews = getFallbackRecentNews(newsLimit);
  
  return res.status(200).json({
    success: true,
    count: recentNews.length,
    news: recentNews,
    source: 'static-files',
    message: 'News loaded from court JSON files'
  });
}