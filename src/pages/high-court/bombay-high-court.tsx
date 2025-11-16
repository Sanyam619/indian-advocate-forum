import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import NewsList from '../../components/news/NewsList';
import { NewsItem } from '@/types/news';
import prisma from '@/lib/prisma';

interface BombayHighCourtProps {
  news: NewsItem[];
}

export default function BombayHighCourt({ news }: BombayHighCourtProps) {

  return (
    <Layout>
      <Head>
        <title>Bombay High Court News - Indian Advocate Forum</title>
        <meta
          name="description"
          content="Latest news, judgements, and updates from Bombay High Court"
        />
        <meta name="keywords" content="bombay high court, mumbai, judgements, legal updates, court proceedings, maharashtra" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bombay High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Established:</span> 1862
                </div>
                <div>
                  <span className="font-semibold">Jurisdiction:</span> Maharashtra, Goa, Dadra and Nagar Haveli
                </div>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Bombay High Court, established in 1862, is one of the oldest high courts in India. 
                Located in Mumbai, it serves as the highest judicial authority for Maharashtra, Goa, and Dadra and Nagar Haveli. 
                The court is renowned for its progressive judgments on commercial law, constitutional matters, and public interest litigation.
              </p>
            </div>
          </div>

          <NewsList 
            news={news}
            title="Latest Updates from Bombay High Court"
            itemsPerPage={9}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const newsData = await prisma.news.findMany({
      where: {
        courtName: 'Bombay High Court',
      },
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

    const news = newsData.map((item) => ({
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
        news,
      },
    };
  } catch (error) {
    console.error('Error fetching Bombay High Court news:', error);
    return {
      props: {
        news: [],
      },
    };
  }
};