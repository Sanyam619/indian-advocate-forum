import { useMemo } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import Layout from '../components/Layout';
import NewsList from '../components/news/NewsList';
import { NewsItem } from '@/types/news';

// Import static news data from ALL courts
import supremeCourtData from '@/data/news/supreme-court.json';
import allahabadHighCourtData from '@/data/news/allahabad-high-court.json';
import andhraHighCourtData from '@/data/news/andhra-pradesh-high-court.json';
import bombayHighCourtData from '@/data/news/bombay-high-court.json';
import calcuttaHighCourtData from '@/data/news/calcutta-high-court.json';
import chhattisgarhHighCourtData from '@/data/news/chhattisgarh-high-court.json';
import delhiHighCourtData from '@/data/news/delhi-high-court.json';
import gauhatiHighCourtData from '@/data/news/gauhati-high-court.json';
import gujaratHighCourtData from '@/data/news/gujarat-high-court.json';
import himachalHighCourtData from '@/data/news/himachal-pradesh-high-court.json';
import jkHighCourtData from '@/data/news/jammu-kashmir-ladakh-high-court.json';
import jharkhandHighCourtData from '@/data/news/jharkhand-high-court.json';
import karnatakaHighCourtData from '@/data/news/karnataka-high-court.json';
import keralaHighCourtData from '@/data/news/kerala-high-court.json';
import mpHighCourtData from '@/data/news/madhya-pradesh-high-court.json';
import madrasHighCourtData from '@/data/news/madras-high-court.json';
import manipurHighCourtData from '@/data/news/manipur-high-court.json';
import meghalayaHighCourtData from '@/data/news/meghalaya-high-court.json';
import orissaHighCourtData from '@/data/news/orissa-high-court.json';
import patnaHighCourtData from '@/data/news/patna-high-court.json';
import punjabHaryanaHighCourtData from '@/data/news/punjab-haryana-high-court.json';
import rajasthanHighCourtData from '@/data/news/rajasthan-high-court.json';
import sikkimHighCourtData from '@/data/news/sikkim-high-court.json';
import telanganaHighCourtData from '@/data/news/telangana-high-court.json';
import tripuraHighCourtData from '@/data/news/tripura-high-court.json';
import uttarakhandHighCourtData from '@/data/news/uttarakhand-high-court.json';

export default function News() {
  const { user, isLoading } = useUser();

  // Combine all news from ALL courts (Supreme Court + 25 High Courts)
  const allNews = useMemo(() => {
    const combined: NewsItem[] = [
      // Supreme Court
      ...(supremeCourtData.news as NewsItem[]),
      // All High Courts (A-Z)
      ...(allahabadHighCourtData.news as NewsItem[]),
      ...(andhraHighCourtData.news as NewsItem[]),
      ...(bombayHighCourtData.news as NewsItem[]),
      ...(calcuttaHighCourtData.news as NewsItem[]),
      ...(chhattisgarhHighCourtData.news as NewsItem[]),
      ...(delhiHighCourtData.news as NewsItem[]),
      ...(gauhatiHighCourtData.news as NewsItem[]),
      ...(gujaratHighCourtData.news as NewsItem[]),
      ...(himachalHighCourtData.news as NewsItem[]),
      ...(jkHighCourtData.news as NewsItem[]),
      ...(jharkhandHighCourtData.news as NewsItem[]),
      ...(karnatakaHighCourtData.news as NewsItem[]),
      ...(keralaHighCourtData.news as NewsItem[]),
      ...(mpHighCourtData.news as NewsItem[]),
      ...(madrasHighCourtData.news as NewsItem[]),
      ...(manipurHighCourtData.news as NewsItem[]),
      ...(meghalayaHighCourtData.news as NewsItem[]),
      ...(orissaHighCourtData.news as NewsItem[]),
      ...(patnaHighCourtData.news as NewsItem[]),
      ...(punjabHaryanaHighCourtData.news as NewsItem[]),
      ...(rajasthanHighCourtData.news as NewsItem[]),
      ...(sikkimHighCourtData.news as NewsItem[]),
      ...(telanganaHighCourtData.news as NewsItem[]),
      ...(tripuraHighCourtData.news as NewsItem[]),
      ...(uttarakhandHighCourtData.news as NewsItem[])
    ];
    
    // Sort by publish date (newest first)
    return combined.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }, []);

  return (
    <Layout title="Legal News">
      <Head>
        <title>Legal News - Indian Advocate Forum</title>
        <meta name="description" content="Latest news and updates from Supreme Court and High Courts across India" />
        <meta name="keywords" content="legal news, court judgments, supreme court, high court, legal updates" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal News & Updates</h1>
            <p className="text-gray-600">
              Stay informed with the latest judgments, legal developments, and court proceedings from across India's judicial system.
            </p>
          </div>

          {/* News List Component */}
          <NewsList 
            news={allNews}
            title="All Court News"
            itemsPerPage={12}
          />
        </div>
      </div>
    </Layout>
  );
}