import React, { useMemo } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import NewsList from '../../components/news/NewsList';
import { NewsItem } from '@/types/news';

// Import Calcutta High Court news data
import calcuttaHighCourtData from '@/data/news/calcutta-high-court.json';

export default function CalcuttaHighCourt({ news }: { news: NewsItem[] }) {
  // Use pre-loaded news data
  const calcuttaCourtNews = useMemo(() => {
    return news;
  }, [news]);

  return (
    <Layout>
      <Head>
        <title>Calcutta High Court News - Indian Advocate Forum</title>
        <meta
          name="description"
          content="Latest news, judgements, and updates from Calcutta High Court"
        />
        <meta name="keywords" content="calcutta high court, kolkata, judgements, legal updates, court proceedings, west bengal" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calcutta High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Established:</span> 1862
                </div>
                <div>
                  <span className="font-semibold">Jurisdiction:</span> West Bengal, Sikkim, Andaman and Nicobar Islands
                </div>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Calcutta High Court, established in 1862, is one of the three original High Courts of India. 
                Located in Kolkata, it has jurisdiction over West Bengal, Sikkim, and the Andaman and Nicobar Islands. 
                The court has played a pivotal role in Indian jurisprudence and is known for its landmark judgments on constitutional law, labor rights, and intellectual property.
              </p>
            </div>
          </div>

          <NewsList 
            news={calcuttaCourtNews}
            title="Latest Updates from Calcutta High Court"
            itemsPerPage={9}
          />
        </div>
      </div>
    </Layout>
  );
}

// Add static generation for better performance
export async function getStaticProps() {
  const news = calcuttaHighCourtData.news as NewsItem[];
  
  return {
    props: {
      news
    },
    // Regenerate page every hour
    revalidate: 3600
  };
}