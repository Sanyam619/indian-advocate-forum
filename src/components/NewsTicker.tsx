import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  publishDate: string;
  category: string;
  slug: string;
  imageUrl?: string;
  videoThumbnail?: string;
  hasVideo?: boolean;
}

interface NewsTickerProps {
  speed?: number; // Speed in seconds for one complete cycle
  pauseOnHover?: boolean;
  showLabel?: boolean;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ 
  speed = 30, 
  pauseOnHover = true,
  showLabel = true 
}) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchRecentNews();
  }, []);

  const fetchRecentNews = async () => {
    try {
      setLoading(true);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('/api/news/recent', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (data.success && data.news?.length > 0) {
        setNewsItems(data.news);
      } else {
        // If API doesn't return data, let the error handler set fallback
        if (process.env.NODE_ENV === 'development') {
          console.log('API returned success but no news data:', data);
        }
        throw new Error('No news data received');
      }
    } catch (err) {
      console.error('News ticker error:', err);
      // Set sample news items from our data
      setNewsItems([
        {
          id: 'sc-001',
          title: 'Supreme Court Delivers Landmark Judgment on Environmental Protection',
          publishDate: '2025-09-28T10:30:00Z',
          category: 'Supreme Court',
          slug: 'sc-001',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop'
        },
        {
          id: 'sc-002',
          title: 'Constitutional Bench Reviews Digital Privacy Rights',
          publishDate: '2025-09-27T14:15:00Z',
          category: 'Supreme Court',
          slug: 'sc-002',
          imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=200&fit=crop'
        },
        {
          id: 'delhi-001',
          title: 'Delhi High Court Expedites Digital Transaction Dispute Cases',
          publishDate: '2025-09-26T09:45:00Z',
          category: 'Delhi High Court',
          slug: 'delhi-001',
          imageUrl: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=300&h=200&fit=crop'
        },
        {
          id: 'bombay-001',
          title: 'Bombay High Court Strengthens Consumer Protection Rights',
          publishDate: '2025-09-25T16:20:00Z',
          category: 'Bombay High Court',
          slug: 'bombay-001',
          imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop'
        },
        {
          id: 'calcutta-001',
          title: 'Calcutta High Court Rules on Property Dispute Resolution',
          publishDate: '2025-09-24T11:30:00Z',
          category: 'Calcutta High Court',
          slug: 'calcutta-001',
          imageUrl: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=300&h=200&fit=crop'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate news items for seamless loop
  const duplicatedNews = [...newsItems, ...newsItems];

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-2 overflow-hidden">
        <div className="flex items-center justify-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
          <span className="text-sm text-gray-600">Loading latest news...</span>
        </div>
      </div>
    );
  }

  if (error || newsItems.length === 0) {
    return null; // Don't show ticker if no news or error
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 py-3 overflow-hidden border-y border-gray-200 shadow-sm">
      <div className="flex items-center">
        {/* News Label */}
        {showLabel && (
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 mr-4 shadow-md">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-white" />
              <span className="text-sm font-bold uppercase tracking-wide text-white">
                Recent
              </span>
            </div>
          </div>
        )}

        {/* Scrolling News Container */}
        <div 
          className="flex-1 overflow-hidden relative"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
          <div 
            className="flex whitespace-nowrap"
            style={{
              animation: `scroll ${speed}s linear infinite`,
              animationFillMode: 'forwards',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {duplicatedNews.map((item, index) => (
              <div key={`${item.id}-${index}`} className="inline-flex items-center mr-8">
                {/* Thumbnail - always show a placeholder if no image */}
                <div className="flex-shrink-0 mr-3">
                  {(item.imageUrl || item.videoThumbnail) ? (
                    <img
                      src={item.imageUrl || item.videoThumbnail}
                      alt={item.title}
                      className="h-12 w-16 object-cover rounded shadow-sm border border-gray-200"
                      onError={(e) => {
                        // Show placeholder if image fails
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="48" viewBox="0 0 64 48"%3E%3Crect width="64" height="48" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af"%3ENews%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded border border-gray-300 flex items-center justify-center shadow-sm">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <Link 
                  href={`/article/${item.id}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item.title}
                  </span>
                </Link>
                <span className="mx-4 text-gray-300 text-sm">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;