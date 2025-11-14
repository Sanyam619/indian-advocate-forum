import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import newsData from '../../data/news/orissa-high-court.json';

export default function OrissaHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Orissa High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Orissa High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Orissa High Court, Odisha judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Orissa High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 1948
                  <span className="font-semibold">Jurisdiction:</span> Odisha
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Orissa High Court, established in 1948, serves as the highest judicial authority for Odisha. 
                Located in Cuttack, it addresses issues related to tribal rights, coastal environmental protection, 
                and traditional land laws in the eastern state.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Orissa High Court"
          />
        </div>
      </div>
    </Layout>
  );
}