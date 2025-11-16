import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import JudgeCard from '../../components/JudgeCard';
import { Judge } from '../../types/judges';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export default function ChiefJusticeAndJudges() {
  const [currentChiefJustice, setCurrentChiefJustice] = useState<any>(null);
  const [currentJudges, setCurrentJudges] = useState<Judge[]>([]);
  
  // Image error state
  const [imageError, setImageError] = useState(false);
  
  // Infinite scroll state
  const [displayedJudges, setDisplayedJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const itemsPerPage = 6;

  // Fetch judges data from API
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch('/api/judges');
        const result = await response.json();
        
        if (result.success && result.data) {
          setCurrentChiefJustice(result.data.currentChiefJustice);
          // Use allCurrentJudges which includes both Current Chief Justice and Current Judge categories
          const allJudges = result.data.allCurrentJudges || [];
          
          // Filter out the Chief Justice from the list to avoid duplication
          // since the Chief Justice is shown separately at the top
          const judgesWithoutChief = result.data.currentChiefJustice 
            ? allJudges.filter((j: Judge) => j.id !== result.data.currentChiefJustice.id)
            : allJudges;
          
          setCurrentJudges(judgesWithoutChief);
          
          // Initialize first batch
          setDisplayedJudges(judgesWithoutChief.slice(0, itemsPerPage));
          setHasMore(judgesWithoutChief.length > itemsPerPage);
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
    if (loading || !hasMore || currentJudges.length === 0) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedJudges.length;
      const nextBatch = currentJudges.slice(currentLength, currentLength + itemsPerPage);
      
      setDisplayedJudges(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + nextBatch.length < currentJudges.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, displayedJudges.length, currentJudges, itemsPerPage]);

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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading judges data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentChiefJustice && currentJudges.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 text-lg">No judge data available</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Chief Justice & Judges - Supreme Court of India | Indian Advocate Forum</title>
        <meta name="description" content="Meet the current Chief Justice and Judges of the Supreme Court of India. Learn about their backgrounds, qualifications, and judicial careers." />
        <meta name="keywords" content="Chief Justice of India, Supreme Court judges, current judges, CJI, judicial profiles" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentChiefJustice ? 'Chief Justice & Judges' : 'Current Judges'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentChiefJustice 
                ? 'The current Chief Justice and Honorable Judges of the Supreme Court of India'
                : 'The current Honorable Judges of the Supreme Court of India'
              }
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>

          {/* Chief Justice Section - Only show if exists */}
          {currentChiefJustice && (
            <div className="mb-16">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Chief Justice of India</h2>
                    <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
                  </div>
                  
                  <Link href={`/judges/${currentChiefJustice.id}`}>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 cursor-pointer hover:scale-105 transition-transform duration-300">
                      {/* Chief Justice Image */}
                      <div className="flex-shrink-0">
                        <div className="w-48 h-56 bg-white rounded-2xl p-1 shadow-2xl">
                          <div className="relative h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden flex items-center justify-center">
                            {currentChiefJustice.image && !imageError ? (
                              <Image
                                src={currentChiefJustice.image}
                                alt={currentChiefJustice.name}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                              />
                            ) : (
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="text-blue-600 text-xs font-medium px-2">{currentChiefJustice.name}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Chief Justice Info */}
                      <div className="text-center lg:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-yellow-200 transition-colors duration-300">{currentChiefJustice.name}</h3>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 inline-block mb-4">
                          <p className="text-lg font-medium">{currentChiefJustice.position}</p>
                        </div>
                        <p className="text-lg opacity-90 max-w-md mb-4">
                          Leading the Supreme Court of India with wisdom and justice
                        </p>
                        <div className="inline-flex items-center text-yellow-200 font-medium">
                          <span>View Complete Profile</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Current Judges Section */}
          {currentJudges.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {currentChiefJustice ? 'Judges of Supreme Court of India' : 'Supreme Court Judges'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {currentChiefJustice 
                    ? 'Honorable Judges serving alongside the Chief Justice'
                    : 'Honorable Judges of the Supreme Court of India'
                  }
                </p>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Judges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedJudges.map((judge) => (
                <JudgeCard key={judge.id} judge={judge as Judge} />
              ))}
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex flex-col items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mb-4"></div>
                <span className="text-gray-600 font-medium">Loading more judges...</span>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-10" />
            </div>
          )}


        </div>
      </div>
    </Layout>
  );
}