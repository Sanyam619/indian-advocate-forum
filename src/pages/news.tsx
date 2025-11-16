import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import NewsList from '../components/news/NewsList';
import { NewsItem } from '@/types/news';
import prisma from '@/lib/prisma';

interface NewsPageProps {
  allNews: NewsItem[];
}

export default function News({ allNews }: NewsPageProps) {

  return (
    <Layout title="Legal News">
      <Head>
        <title>Legal News - Indian Advocate Forum</title>
        <meta name="description" content="Latest news and updates from Supreme Court and High Courts across India" />
        <meta name="keywords" content="legal news, court judgments, supreme court, high court, legal updates" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal News & Updates</h1>
            <p className="text-gray-600">
              Stay informed with the latest judgments, legal developments, and court proceedings from across India's judicial system.
            </p>
          </div>

          {/* News List Component */}
          <NewsList 
            news={allNews}
            title="All Court News"
            itemsPerPage={12}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Check if Prisma is available
    if (!prisma) {
      return { props: { allNews: [] } };
    }

    // Fetch all news from MongoDB, sorted by publish date
    const news = await prisma.news.findMany({
      orderBy: {
        publishDate: 'desc',
      },
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

    // Convert to plain objects and format dates
    const allNews = news.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      publishDate: item.publishDate.toISOString(),
      imageUrl: item.imageUrl || null,
      videoUrl: item.videoUrl || null,
      videoThumbnail: item.videoThumbnail || null,
      hasVideo: item.hasVideo || false,
      courtName: item.courtName || null,
      tags: item.tags || [],
      readTime: item.readTime || null,
      author: item.author ? {
        fullName: item.author.fullName,
        role: item.author.role,
        profilePhoto: item.author.profilePhoto,
      } : null,
    }));

    return {
      props: {
        allNews,
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      props: {
        allNews: [],
      },
    };
  }
};