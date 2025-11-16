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

export default function ChhattisgarhHighCourt({ news }: Props) {
  return (
    <Layout>
      <Head>
        <title>Chhattisgarh High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Chhattisgarh High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Chhattisgarh High Court, Chhattisgarh judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Chhattisgarh High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 2000
                  <span className="font-semibold">Jurisdiction:</span> Chhattisgarh
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Chhattisgarh High Court, established in 2000 after the formation of Chhattisgarh state, 
                serves as the principal judicial authority for the state. Known for its focus on tribal rights, 
                environmental protection, and forest conservation, it plays a crucial role in balancing development with sustainability.
              </p>
            </div>
          </div>

          <NewsList 
            news={news}
            title="Latest Updates from Chhattisgarh High Court"
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const newsData = await prisma.news.findMany({
      where: { courtName: 'Chhattisgarh High Court' },
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
    console.error('Error fetching Chhattisgarh High Court news:', error);
    return { props: { news: [] } };
  }
};
