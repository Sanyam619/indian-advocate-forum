import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { NewsItem } from "../../types/news";
import NewsList from '../../components/news/NewsList';
import newsData from '../../data/news/telangana-high-court.json';

export default function TelanganaHighCourt() {
  return (
    <Layout>
      <Head>
        <title>Telangana High Court - Latest News & Updates | Indian Advocate Forum</title>
        <meta name="description" content="Stay updated with the latest news, judgments, and legal developments from Telangana High Court. Get comprehensive coverage of judicial proceedings." />
        <meta name="keywords" content="Telangana High Court, Telangana judiciary, legal news, court judgments, judicial updates" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-pink-500">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Telangana High Court
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="font-semibold">Established:</span> 2014
                  <span className="font-semibold">Jurisdiction:</span> Telangana
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Telangana High Court, established in 2014 after the formation of Telangana state, 
                is located in Hyderabad. It focuses on IT sector governance, urban planning, 
                and balancing technological development with environmental conservation.
              </p>
            </div>
          </div>

          <NewsList 
            news={newsData.news as NewsItem[]}
            title="Latest Updates from Telangana High Court"
          />
        </div>
      </div>
    </Layout>
  );
}