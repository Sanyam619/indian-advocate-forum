import React, { useMemo } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import NewsList from '../../components/news/NewsList';
import { NewsItem } from '@/types/news';

// Import Supreme Court news data
import supremeCourtData from '@/data/news/supreme-court.json';

export default function SupremeCourtJudgements() {
  // Filter Supreme Court news for judgments and related content
  const supremeCourtNews = useMemo(() => {
    return (supremeCourtData.news as NewsItem[]).filter(news => 
      news.courtType === 'supreme' && 
      (news.category === 'Judgment' || news.category === 'Supreme Court')
    );
  }, []);

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