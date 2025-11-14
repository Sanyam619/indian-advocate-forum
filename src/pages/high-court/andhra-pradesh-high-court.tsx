import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import newsData from '../../data/news/andhra-pradesh-high-court.json';

export default function AndhraPradeshHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Andhra Pradesh High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Andhra Pradesh High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Andhra Pradesh High Court, AP judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Andhra Pradesh High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 2014
                  <span className="font-semibold">Jurisdiction:</span> Andhra Pradesh
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Andhra Pradesh High Court, established in 2014 following the bifurcation of the state, 
                serves as the principal judicial authority for Andhra Pradesh. 
                Stay informed about the latest legal developments, judgments, and court proceedings.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Andhra Pradesh High Court"
          />
        </div>
      </div>
    </Layout>
  );
}