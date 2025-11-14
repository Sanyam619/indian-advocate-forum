import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PlayIcon, EyeIcon, ClockIcon, UserIcon, TagIcon, ShareIcon } from '@heroicons/react/24/outline';

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

const PodcastPlayerPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPodcast();
    }
  }, [id]);

  const fetchPodcast = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/podcasts/${id}`);
      const data = await response.json();

      if (data.success) {
        setPodcast(data.podcast);
      } else {
        setError(data.message || 'Podcast not found');
      }
    } catch (err) {
      setError('Error loading podcast');
      console.error('Error fetching podcast:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && podcast) {
      try {
        await navigator.share({
          title: podcast.title,
          text: podcast.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
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
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="aspect-video bg-gray-300 rounded-lg mb-6"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !podcast) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-red-900 mb-4">Podcast Not Found</h1>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => router.push('/podcasts')}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Back to Podcasts
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{podcast.title} - Indian Advocate Forum</title>
        <meta name="description" content={podcast.description} />
        <meta name="keywords" content={`legal podcast, ${podcast.category}, ${podcast.tags.join(', ')}`} />
        <meta property="og:title" content={podcast.title} />
        <meta property="og:description" content={podcast.description} />
        <meta property="og:type" content="video" />
        {podcast.thumbnailUrl && <meta property="og:image" content={podcast.thumbnailUrl} />}
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <button onClick={() => router.push('/')} className="hover:text-purple-600">
                    Home
                  </button>
                </li>
                <li>/</li>
                <li>
                  <button onClick={() => router.push('/podcasts')} className="hover:text-purple-600">
                    Podcasts
                  </button>
                </li>
                <li>/</li>
                <li className="text-gray-900 truncate">{podcast.title}</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Video Player */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="aspect-video bg-black">
                    <video
                      controls
                      className="w-full h-full"
                      poster={podcast.thumbnailUrl}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source src={podcast.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Video Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(podcast.category)}`}>
                      {podcast.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {podcast.title}
                  </h1>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <EyeIcon className="h-5 w-5 mr-1" />
                        <span>{formatPlayCount(podcast.playCount)} views</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 mr-1" />
                        <span>{formatDate(podcast.publishDate)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 border border-gray-300 rounded-md hover:border-purple-300 transition-colors"
                    >
                      <ShareIcon className="h-5 w-5 mr-2" />
                      Share
                    </button>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{podcast.uploadedBy.fullName}</div>
                      <div className="text-sm text-gray-500">{podcast.uploadedBy.role}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About this podcast</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {podcast.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {podcast.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <TagIcon className="h-5 w-5 mr-2" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {podcast.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">More Podcasts</h3>
                  <p className="text-gray-600 text-sm">
                    Discover more legal content and educational videos from our collection.
                  </p>
                  <button
                    onClick={() => router.push('/podcasts')}
                    className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Browse All Podcasts
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default PodcastPlayerPage;