import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import newsData from '../../data/news/himachal-pradesh-high-court.json';

export default function HimachalPradeshHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Himachal Pradesh High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Himachal Pradesh High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Himachal Pradesh High Court, HP judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Himachal Pradesh High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 1971
                  <span className="font-semibold">Jurisdiction:</span> Himachal Pradesh
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Himachal Pradesh High Court, established in 1971, serves as the highest judicial authority for Himachal Pradesh. 
                Located in Shimla, it is known for its environmental consciousness and progressive judgments on hill station 
                conservation, sustainable tourism, and agricultural development in mountainous regions.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Himachal Pradesh High Court"
          />
        </div>
      </div>
    </Layout>
  );
}