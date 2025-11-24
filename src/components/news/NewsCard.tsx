import React, { useState } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { Calendar, Clock, Tag } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onClick?: () => void;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, className = '' }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
            'Supreme Court': 'bg-purple-100 text-purple-800',
      'High Court': 'bg-blue-100 text-blue-800',
      'Legal Update': 'bg-indigo-100 text-indigo-800',
      'Judgment': 'bg-red-100 text-red-800',
      'Case Analysis': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Function to truncate content for preview
  const getTruncatedContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${rotateX !== 0 || rotateY !== 0 ? '-8px' : '0px'})`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
      }}
    >
      {/* Image Only - Videos will appear in full article */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-white/50 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <span className="text-sm font-medium">Image will be added soon</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
          {news.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {news.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getTruncatedContent(news.content)}
        </p>

        {/* Court Name */}
        {news.courtName && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {news.courtName}
            </span>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.publishDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{news.readTime} min read</span>
          </div>
        </div>



        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {news.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {news.tags.length > 3 && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              +{news.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read More Button */}
        <Link 
          href={`/article/${news.id}`}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium text-center"
        >
          Read Full Article
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;