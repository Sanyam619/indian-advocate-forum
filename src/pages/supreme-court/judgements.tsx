import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import Head from 'next/head';
import NewsList from '../../components/news/NewsList';
import { NewsItem } from '@/types/news';
import prisma from '@/lib/prisma';

interface SupremeCourtJudgementsProps {
  supremeCourtNews: NewsItem[];
}

export default function SupremeCourtJudgements({ supremeCourtNews }: SupremeCourtJudgementsProps) {

  return (
    <Layout>
      <Head>
        <title>Supreme Court Judgements - Indian Advocate Forum</title>
        <meta
          name="description"
          content="Latest judgements, orders, and legal updates from the Supreme Court of India"
        />
        <meta name="keywords" content="supreme court, judgements, orders, legal updates, constitutional law" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supreme Court Judgements</h1>
            <p className="text-gray-600">
              Stay updated with the latest judgements, constitutional interpretations, and landmark decisions from the Supreme Court of India.
            </p>
          </div>

          {/* Supreme Court News */}
          <NewsList 
            news={supremeCourtNews}
            title="Supreme Court News & Judgements"
            itemsPerPage={9}
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
      return { props: { supremeCourtNews: [] } };
    }

    // Fetch Supreme Court news from MongoDB
    const news = await prisma.news.findMany({
      where: {
        OR: [
          { courtName: 'Supreme Court of India' },
          { category: 'Supreme Court' },
          { category: 'Judgment' }
        ]
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

    const supremeCourtNews = news.map((item: any) => ({
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
        supremeCourtNews,
      },
    };
  } catch (error) {
    console.error('Error fetching Supreme Court news:', error);
    return {
      props: {
        supremeCourtNews: [],
      },
    };
  }
};