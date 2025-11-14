import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayIcon, ClockIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';

interface Podcast {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  playCount: number;
  publishDate: string;
  uploadedBy: {
    fullName: string;
    role: string;
  };
}

interface PodcastListProps {
  category?: string;
  limit?: number;
}

const PodcastList: React.FC<PodcastListProps> = ({ category = 'all', limit }) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPodcasts();
  }, [category, currentPage, limit]);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(limit && { limit: limit.toString() }),
        ...(category !== 'all' && { category }),
      });

      const response = await fetch(`/api/podcasts?${params}`);
      const data = await response.json();

      if (data.success) {
        setPodcasts(data.podcasts);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.message || 'Failed to load podcasts');
      }
    } catch (err) {
      setError('Error loading podcasts');
      console.error('Error fetching podcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Legal Discussion': 'bg-blue-100 text-blue-800',
      'Case Analysis': 'bg-green-100 text-green-800',
      'Supreme Court Updates': 'bg-purple-100 text-purple-800',
      'High Court News': 'bg-indigo-100 text-indigo-800',
      'Legal Education': 'bg-yellow-100 text-yellow-800',
      'Constitutional Law': 'bg-red-100 text-red-800',
      'Criminal Law': 'bg-orange-100 text-orange-800',
      'Civil Law': 'bg-teal-100 text-teal-800',
      'Corporate Law': 'bg-cyan-100 text-cyan-800',
      'Legal Tips': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Podcasts</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchPodcasts}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Podcasts Found</h3>
          <p className="text-gray-600">
            {category === 'all' 
              ? 'No podcasts have been uploaded yet.' 
              : `No podcasts found in "${category}" category.`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Podcasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
              {podcast.thumbnailUrl ? (
                <img
                  src={podcast.thumbnailUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                  <PlayIcon className="h-16 w-16 text-white opacity-80" />
                </div>
              )}
              
              {/* Play Button Overlay */}
              <Link href={`/podcast/${podcast.id}`}>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-200">
                    <PlayIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </Link>

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(podcast.category)}`}>
                  {podcast.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <Link href={`/podcast/${podcast.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                  {podcast.title}
                </h3>
              </Link>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {podcast.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{podcast.uploadedBy.fullName}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(podcast.publishDate)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{formatPlayCount(podcast.playCount)} views</span>
                </div>

                {/* Tags */}
                {podcast.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {podcast.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {podcast.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{podcast.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!limit && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PodcastList;