import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import NewsList from '../../components/news/NewsList';
import { NewsItem } from '../../types/news';
import newsData from '../../data/news/punjab-haryana-high-court.json';

export default function PunjabHaryanaHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Punjab & Haryana High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Punjab & Haryana High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Punjab Haryana High Court, Punjab judiciary, Haryana judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Punjab & Haryana High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Established:</span> 1966
                </div>
                <div>
                  <span className="font-semibold">Jurisdiction:</span> Punjab, Haryana & Chandigarh
                </div>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Punjab & Haryana High Court, established in 1966, serves as the highest judicial authority for Punjab, 
                Haryana and Chandigarh. Located in Chandigarh, it addresses issues related to agricultural laws, 
                urban development, and inter-state disputes in the northern region.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Punjab & Haryana High Court"
          />
        </div>
      </div>
    </Layout>
  );
}