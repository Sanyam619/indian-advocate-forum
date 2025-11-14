import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Import all High Courts news data for article counts
import delhiHighCourtData from '@/data/news/delhi-high-court.json';
import bombayHighCourtData from '@/data/news/bombay-high-court.json';
import calcuttaHighCourtData from '@/data/news/calcutta-high-court.json';
import allahabadHighCourtData from '@/data/news/allahabad-high-court.json';
import andhraPradeshHighCourtData from '@/data/news/andhra-pradesh-high-court.json';
import gujaratHighCourtData from '@/data/news/gujarat-high-court.json';

export default function HighCourt() {
  const highCourts = [
    {
      name: 'Allahabad High Court',
      path: '/high-court/allahabad-high-court',
      description: 'Latest updates from Allahabad High Court - Uttar Pradesh',
      newsCount: allahabadHighCourtData.news.length,
      established: '1866',
      jurisdiction: 'Uttar Pradesh'
    },
    {
      name: 'Andhra Pradesh High Court',
      path: '/high-court/andhra-pradesh-high-court',
      description: 'Latest updates from Andhra Pradesh High Court',
      newsCount: andhraPradeshHighCourtData.news.length,
      established: '2014',
      jurisdiction: 'Andhra Pradesh'
    },
    {
      name: 'Bombay High Court', 
      path: '/high-court/bombay-high-court',
      description: 'Latest updates from Bombay High Court - Maharashtra, Goa, Dadra & Nagar Haveli',
      newsCount: bombayHighCourtData.news.length,
      established: '1862',
      jurisdiction: 'Maharashtra, Goa'
    },
    {
      name: 'Calcutta High Court',
      path: '/high-court/calcutta-high-court', 
      description: 'Latest updates from Calcutta High Court - West Bengal',
      newsCount: calcuttaHighCourtData.news.length,
      established: '1862',
      jurisdiction: 'West Bengal'
    },
    {
      name: 'Delhi High Court',
      path: '/high-court/delhi-high-court',
      description: 'Latest updates from Delhi High Court - National Capital Territory',
      newsCount: delhiHighCourtData.news.length,
      established: '1966',
      jurisdiction: 'Delhi'
    },
    {
      name: 'Gujarat High Court',
      path: '/high-court/gujarat-high-court',
      description: 'Latest updates from Gujarat High Court',
      newsCount: gujaratHighCourtData.news.length,
      established: '1960',
      jurisdiction: 'Gujarat'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>High Court News - Indian Advocate Forum</title>
        <meta
          name="description"
          content="Latest news, judgements, and updates from High Courts across India"
        />
        <meta name="keywords" content="high court, judgements, legal updates, court proceedings" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">High Court News</h1>
            <p className="text-gray-600">
              Stay updated with the latest developments, judgements, and proceedings from High Courts across India.
            </p>
          </div>

          {/* High Court Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {highCourts.map((court, index) => (
              <Link key={index} href={court.path}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{court.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{court.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">View Updates →</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {court.newsCount} articles
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>


        </div>
      </div>
    </Layout>
  );
}