import React, { useState, useMemo } from 'react';
import { NewsItem } from '@/types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  news: NewsItem[];
  title?: string;
  itemsPerPage?: number;
  className?: string;
}

const NewsList: React.FC<NewsListProps> = ({
  news,
  title = 'Latest News',
  itemsPerPage = 9,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure news is an array
  const newsArray = Array.isArray(news) ? news : [];

  // Sort news by date (newest first)
  const sortedNews = useMemo(() => {
    return [...newsArray].sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }, [newsArray]);

  // Paginate results
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const paginatedNews = sortedNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>


      {/* News Grid */}
      {paginatedNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              news={newsItem}
              onClick={() => {
                // Handle news item click - could navigate to detail page
                if (process.env.NODE_ENV === 'development') {
                  console.log('News clicked:', newsItem.id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No news articles found</div>
          <p className="text-gray-400">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 0);
            }}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 0);
              }}
              className={`px-3 py-2 text-sm border rounded-md ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 0);
            }}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsList;