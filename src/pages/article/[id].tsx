import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import PremiumModal from '@/components/PremiumModal';
import { NewsItem } from '@/types/news';
import { Calendar, Clock, ArrowLeft, Tag, Lock, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';

interface ArticlePageProps {
  article: NewsItem | null;
  isPremium: boolean;
  isAuthenticated: boolean;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, isPremium, isAuthenticated }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Handle case where article is not found
  if (!article) {
    return (
      <Layout>
        <Head>
          <title>Article Not Found - Indian Advocate Forum</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link 
              href="/news" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to News
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  // Get preview content (first 300 characters)
  const getPreviewContent = (content: string) => {
    if (!content) return '';
    const preview = content.substring(0, 300);
    return preview + (content.length > 300 ? '...' : '');
  };

  return (
    <Layout>
      <Head>
        <title>{article.title} - Indian Advocate Forum</title>
        <meta name="description" content={article.content?.substring(0, 160) || 'Legal news and updates'} />
        <meta name="keywords" content={article.tags?.join(', ') || 'legal news'} />
      </Head>

      <article className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/news" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {/* Category and Court Info */}
            <div className="flex flex-wrap gap-3 mb-4">
              {article.category && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              )}
              {article.courtName && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {article.courtName}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title || 'Untitled Article'}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              {article.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(article.publishDate)}</span>
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.readTime} min read</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Video/Image */}
          <div className="mb-8">
            {article.hasVideo && article.videoUrl ? (
              <div className="w-full h-64 md:h-96 rounded-lg shadow-lg overflow-hidden">
                <video
                  controls
                  poster={article.videoThumbnail || undefined}
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  <source src={article.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="w-24 h-24 bg-white/50 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <Tag className="w-12 h-12 text-gray-400" />
                  </div>
                  <span className="text-lg font-medium">Media will be added soon</span>
                </div>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {isPremium ? (
              // Full content for premium users
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                  {article.content || 'Article content not available.'}
                </div>
              </div>
            ) : (
              // Preview content with premium upgrade prompt for non-premium users
              <div>
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {getPreviewContent(article.content || 'Article content not available.')}
                  </div>
                </div>

                {/* Premium Content Blur Overlay */}
                <div className="relative">
                  {/* Blurred preview text */}
                  <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line blur-sm select-none pointer-events-none opacity-50">
                    {article.content?.substring(300, 800) || ''}
                  </div>

                  {/* Premium Upgrade Card Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center -mt-20">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 border-2 border-purple-200">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-4">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Premium Content
                        </h3>
                        
                        <p className="text-gray-600 mb-6">
                          Unlock full access to this article and thousands more with a premium membership
                        </p>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                          <ul className="text-left space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">Read complete articles without restrictions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">Search and connect with advocates</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">Access exclusive legal resources</span>
                            </li>
                          </ul>
                        </div>

                        {isAuthenticated ? (
                          <button
                            onClick={() => setShowPremiumModal(true)}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Sparkles className="h-5 w-5" />
                            Upgrade to Premium
                          </button>
                        ) : (
                          <Link
                            href="/auth?returnTo=/article/[id]"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Sign In to Continue
                          </Link>
                        )}
                        
                        <p className="mt-4 text-xs text-gray-500">
                          Starting from ₹199/month • Cancel anytime
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles / Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Reading</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/news" 
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                View All News
              </Link>
              {article.courtName && (
                <Link 
                  href={
                    article.courtName === 'Supreme Court of India' || article.category === 'Supreme Court'
                      ? '/supreme-court'
                      : `/high-court/${article.courtName.toLowerCase().replace(/\s+/g, '-')}`
                  }
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                >
                  More from {article.courtName}
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {showPremiumModal && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const articleId = params?.id as string;

  try {
    // Check authentication and premium status
    let isPremium = false;
    let isAuthenticated = false;

    const session = await getSession(req, res);
    
    if (session?.user) {
      isAuthenticated = true;

      // Check premium status
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timeout')), 3000);
      });

      const userPromise = prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        select: {
          isPremium: true,
          premiumExpiresAt: true,
        },
      });

      try {
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        if (user) {
          // Check if premium is active and not expired
          isPremium = user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        // Continue with isPremium = false
      }
    }

    // Check if Prisma is available
    if (!prisma) {
      console.error('Prisma client not initialized');
      return {
        notFound: true,
      };
    }

    // Fetch the specific article from MongoDB
    const article = await prisma.news.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            fullName: true,
            role: true,
            profilePhoto: true,
          },
        },
      },
    });

    if (!article) {
      return {
        notFound: true,
      };
    }

    // Convert to plain object and format dates
    const formattedArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      category: article.category,
      publishDate: article.publishDate.toISOString(),
      imageUrl: article.imageUrl || null,
      videoUrl: article.videoUrl || null,
      videoThumbnail: article.videoThumbnail || null,
      hasVideo: article.hasVideo || false,
      courtName: article.courtName || null,
      tags: article.tags || [],
      readTime: article.readTime || null,
      author: article.author ? {
        fullName: article.author.fullName,
        role: article.author.role,
        profilePhoto: article.author.profilePhoto,
      } : null,
    };

    return {
      props: {
        article: formattedArticle,
        isPremium,
        isAuthenticated,
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticlePage;