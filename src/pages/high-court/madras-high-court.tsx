import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import newsData from '../../data/news/madras-high-court.json';

export default function MadrasHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Madras High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Madras High Court. Get comprehensive coverage of judicial proceedings in Tamil Nadu and Puducherry." />
        <meta name="keywords" content="Madras High Court, Tamil Nadu judiciary, legal news, court judgments, judicial updates, Chennai High Court" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Madras High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 1862
                  <span className="font-semibold">Jurisdiction:</span> Tamil Nadu and Puducherry
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Madras High Court, established in 1862, is one of the oldest High Courts in India. 
                With jurisdiction over Tamil Nadu and Puducherry, it is renowned for its progressive judgments 
                and commitment to linguistic diversity and environmental protection.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Madras High Court"
          />
        </div>
      </div>
    </Layout>
  );
}