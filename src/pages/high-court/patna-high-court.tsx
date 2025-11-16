import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import prisma from '@/lib/prisma';

interface Props {
  news: NewsItem[];
}

export default function PatnaHighCourt({ news }: Props) {
  return (
    <Layout>
      <Head>
        <title>Patna High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Patna High Court. Get comprehensive coverage of judicial proceedings in Bihar." />
        <meta name="keywords" content="Patna High Court, Bihar judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Patna High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 1916
                  <span className="font-semibold">Jurisdiction:</span> Bihar
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Patna High Court, established in 1916, is one of the oldest High Courts in India, serving Bihar. 
                It addresses critical issues including flood management, rural development, and agricultural welfare 
                in one of India's most populous states.
              </p>
            </div>
          </div>

          <NewsList 
            news={news}
            title="Latest Updates from Patna High Court"
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const newsData = await prisma.news.findMany({
      where: { courtName: 'Patna High Court' },
      orderBy: { publishDate: 'desc' },
      include: { author: { select: { fullName: true, role: true, profilePhoto: true } } }
    });
    const news = newsData.map((item: any) => ({
      id: item.id, title: item.title, content: item.content, category: item.category,
      publishDate: item.publishDate.toISOString(), imageUrl: item.imageUrl || null,
      videoUrl: item.videoUrl || null, videoThumbnail: item.videoThumbnail || null,
      hasVideo: item.hasVideo || false, courtName: item.courtName || null,
      tags: item.tags || [], readTime: item.readTime || null,
      author: item.author ? { fullName: item.author.fullName, role: item.author.role, profilePhoto: item.author.profilePhoto } : null
    }));
    return { props: { news } };
  } catch (error) {
    console.error('Error fetching Patna High Court news:', error);
    return { props: { news: [] } };
  }
};
