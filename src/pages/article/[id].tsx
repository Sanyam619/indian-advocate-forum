import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { NewsItem } from '@/types/news';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';

interface ArticlePageProps {
  article: NewsItem;
}

// Helper function to load news data
async function loadAllNewsData() {
  const [
    supremeCourtData,
    delhiHighCourtData,
    bombayHighCourtData,
    calcuttaHighCourtData
  ] = await Promise.all([
    import('@/data/news/supreme-court.json'),
    import('@/data/news/delhi-high-court.json'),
    import('@/data/news/bombay-high-court.json'),
    import('@/data/news/calcutta-high-court.json')
  ]);

  return [
    ...(supremeCourtData.default.news as NewsItem[]),
    ...(delhiHighCourtData.default.news as NewsItem[]),
    ...(bombayHighCourtData.default.news as NewsItem[]),
    ...(calcuttaHighCourtData.default.news as NewsItem[])
  ];
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
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
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                {article.content || 'Article content not available.'}
              </div>
            </div>
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
                  href={`/high-court/${article.courtName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                >
                  More from {article.courtName}
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Load all news data dynamically
  const allNews = await loadAllNewsData();

  // Generate paths for all articles
  const paths = allNews.map((article) => ({
    params: { id: article.id }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articleId = params?.id as string;

  // Load all news data dynamically
  const allNews = await loadAllNewsData();

  // Find the specific article
  const article = allNews.find((item) => item.id === articleId);

  if (!article) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      article
    }
  };
};

export default ArticlePage;