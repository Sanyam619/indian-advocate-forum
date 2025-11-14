import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import JudgeCard from '../../components/JudgeCard';
import { Judge } from '../../types/judges';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Scale, CalendarDays, Clock } from 'lucide-react';

export default function FormerChiefJustices() {
  const [formerChiefJustices, setFormerChiefJustices] = useState<Judge[]>([]);
  
  // Infinite scroll state
  const [displayedJudges, setDisplayedJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const itemsPerPage = 4;

  // Fetch judges data from API
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch('/api/judges');
        const result = await response.json();
        
        if (result.success && result.data) {
          const judges = result.data.formerChiefJustices || [];
          setFormerChiefJustices(judges);
          
          // Initialize first batch
          setDisplayedJudges(judges.slice(0, itemsPerPage));
          setHasMore(judges.length > itemsPerPage);
        }
      } catch (error) {
        console.error('Error fetching judges:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchJudges();
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore || formerChiefJustices.length === 0) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedJudges.length;
      const nextBatch = formerChiefJustices.slice(currentLength, currentLength + itemsPerPage);
      
      setDisplayedJudges(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + nextBatch.length < formerChiefJustices.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, displayedJudges.length, formerChiefJustices, itemsPerPage]);

  const observerTarget = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore
  });

  if (initialLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading former chief justices data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Former Chief Justices - Supreme Court of India | Indian Advocate Forum</title>
        <meta name="description" content="Learn about the former Chief Justices of India who have served the Supreme Court with distinction. Explore their judicial legacies and contributions." />
        <meta name="keywords" content="former Chief Justice of India, ex-CJI, Supreme Court history, judicial legacy" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Former Chief Justices
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Honoring the distinguished Chief Justices who have led the Supreme Court of India
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>

          {/* Former Chief Justices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedJudges.map((cji) => (
              <JudgeCard key={cji.id} judge={cji as Judge} />
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-gray-600">Loading more judges...</span>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="h-10" />

        </div>
      </div>
    </Layout>
  );
}