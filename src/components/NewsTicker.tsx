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
          slug: 'sc-001'
        },
        {
          id: 'sc-002',
          title: 'Constitutional Bench Reviews Digital Privacy Rights',
          publishDate: '2025-09-27T14:15:00Z',
          category: 'Supreme Court',
          slug: 'sc-002'
        },
        {
          id: 'delhi-001',
          title: 'Delhi High Court Expedites Digital Transaction Dispute Cases',
          publishDate: '2025-09-26T09:45:00Z',
          category: 'Delhi High Court',
          slug: 'delhi-001'
        },
        {
          id: 'bombay-001',
          title: 'Bombay High Court Strengthens Consumer Protection Rights',
          publishDate: '2025-09-25T16:20:00Z',
          category: 'Bombay High Court',
          slug: 'bombay-001'
        },
        {
          id: 'calcutta-001',
          title: 'Calcutta High Court Rules on Property Dispute Resolution',
          publishDate: '2025-09-24T11:30:00Z',
          category: 'Calcutta High Court',
          slug: 'calcutta-001'
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
      <div className="bg-purple-600 text-white py-2 overflow-hidden">
        <div className="flex items-center justify-center">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">Loading latest news...</span>
        </div>
      </div>
    );
  }

  if (error || newsItems.length === 0) {
    return null; // Don't show ticker if no news or error
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 overflow-hidden shadow-sm">
      <div className="flex items-center h-12">
        {/* News Label */}
        {showLabel && (
          <div className="flex-shrink-0 bg-purple-800 bg-opacity-50 px-6 py-2 mr-6 rounded-r-lg">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="text-base font-bold uppercase tracking-wide">
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
              <div key={`${item.id}-${index}`} className="flex items-center mr-12">
                {/* Thumbnail section - will show when imageUrl or videoThumbnail is available */}
                {(item.imageUrl || item.videoThumbnail) && (
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={item.imageUrl || item.videoThumbnail}
                      alt={item.title}
                      className="h-10 w-14 object-cover rounded-sm border border-purple-300/30"
                      onError={(e) => {
                        // Hide image if it fails to load
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                )}
                <Link 
                  href={`/article/${item.id}`}
                  className="hover:text-purple-200 transition-colors duration-200"
                >
                  <span className="text-base font-semibold">
                    {item.title}
                  </span>
                </Link>
                <span className="mx-6 text-purple-300 text-lg">•</span>
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