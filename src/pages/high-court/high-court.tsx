import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import prisma from '@/lib/prisma';

interface HighCourtProps {
  courtCounts: { [key: string]: number };
}

export default function HighCourt({ courtCounts }: HighCourtProps) {
  const highCourts = [
    {
      name: 'Allahabad High Court',
      path: '/high-court/allahabad-high-court',
      description: 'Latest updates from Allahabad High Court - Uttar Pradesh',
      newsCount: courtCounts['Allahabad High Court'] || 0,
      established: '1866',
      jurisdiction: 'Uttar Pradesh'
    },
    {
      name: 'Andhra Pradesh High Court',
      path: '/high-court/andhra-pradesh-high-court',
      description: 'Latest updates from Andhra Pradesh High Court',
      newsCount: courtCounts['Andhra Pradesh High Court'] || 0,
      established: '2014',
      jurisdiction: 'Andhra Pradesh'
    },
    {
      name: 'Bombay High Court', 
      path: '/high-court/bombay-high-court',
      description: 'Latest updates from Bombay High Court - Maharashtra, Goa, Dadra & Nagar Haveli',
      newsCount: courtCounts['Bombay High Court'] || 0,
      established: '1862',
      jurisdiction: 'Maharashtra, Goa'
    },
    {
      name: 'Calcutta High Court',
      path: '/high-court/calcutta-high-court', 
      description: 'Latest updates from Calcutta High Court - West Bengal',
      newsCount: courtCounts['Calcutta High Court'] || 0,
      established: '1862',
      jurisdiction: 'West Bengal'
    },
    {
      name: 'Delhi High Court',
      path: '/high-court/delhi-high-court',
      description: 'Latest updates from Delhi High Court - National Capital Territory',
      newsCount: courtCounts['Delhi High Court'] || 0,
      established: '1966',
      jurisdiction: 'Delhi'
    },
    {
      name: 'Gujarat High Court',
      path: '/high-court/gujarat-high-court',
      description: 'Latest updates from Gujarat High Court',
      newsCount: courtCounts['Gujarat High Court'] || 0,
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Get counts for each high court
    const courtNames = [
      'Allahabad High Court',
      'Andhra Pradesh High Court',
      'Bombay High Court',
      'Calcutta High Court',
      'Delhi High Court',
      'Gujarat High Court'
    ];

    const courtCounts: { [key: string]: number } = {};
    
    await Promise.all(
      courtNames.map(async (courtName) => {
        const count = await prisma.news.count({
          where: { courtName }
        });
        courtCounts[courtName] = count;
      })
    );

    return {
      props: {
        courtCounts,
      },
    };
  } catch (error) {
    console.error('Error fetching court counts:', error);
    return {
      props: {
        courtCounts: {},
      },
    };
  }
};