import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import prisma from '@/lib/prisma';
import { NewspaperIcon, ScaleIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

interface LandingPageProps {
  supremeCourtNews: NewsItem[];
  highCourtNews: NewsItem[];
}

const LandingPage: React.FC<LandingPageProps> = ({ supremeCourtNews = [], highCourtNews = [] }) => {
  const loading = false;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Head>
        <title>Indian Advocate Forum - Legal News & Updates</title>
        <meta name="description" content="Stay updated with the latest legal news from Supreme Court, High Courts, and legal community across India" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50">
          
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Welcome to Indian Advocate Forum
                </h1>
                <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                  Your trusted source for legal news, updates, and insights from India's judicial system
                </p>
              </div>
            </div>
          </section>

          {/* Supreme Court Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                  <ScaleIcon className="h-10 w-10 text-purple-600 mr-4" />
                  <h2 className="text-4xl font-bold text-gray-900">Supreme Court Updates</h2>
                </div>
                <Link 
                  href="/supreme-court"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-lg flex items-center"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  <div className="col-span-4 text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading news...</p>
                  </div>
                ) : supremeCourtNews.length > 0 ? (
                  supremeCourtNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/article/${news.id}`}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {news.imageUrl && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {truncateText(news.content, 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500" suppressHydrationWarning>
                            {new Date(news.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-16 bg-gray-50 rounded-xl">
                    <ScaleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No Supreme Court news available at the moment</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon for updates</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Advertisement Section 1 */}
          <section className="py-12 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-12 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute transform rotate-12 -right-20 -top-20">
                    <ScaleIcon className="h-64 w-64 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                      <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <span className="text-sm font-semibold">PREMIUM LEGAL SERVICES</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-4">
                        Kumar & Associates
                      </h3>
                      <p className="text-xl text-purple-100 mb-6">
                        Leading Law Firm in Supreme Court Practice
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center">
                          <svg className="h-6 w-6 mr-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-purple-100">25+ Years of Experience</span>
                        </li>
                        <li className="flex items-center">
                          <svg className="h-6 w-6 mr-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-purple-100">500+ Cases Won</span>
                        </li>
                        <li className="flex items-center">
                          <svg className="h-6 w-6 mr-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-purple-100">Expert Supreme Court Advocates</span>
                        </li>
                      </ul>
                      <button className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg">
                        Schedule Consultation
                      </button>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 border border-white border-opacity-20">
                      <div className="text-center mb-6">
                        <div className="bg-white rounded-full p-6 inline-block mb-4">
                          <ScaleIcon className="h-16 w-16 text-purple-600" />
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2">Contact Us</h4>
                        <p className="text-purple-100">Expert legal representation</p>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                          <p className="text-sm text-purple-100 mb-1">Phone</p>
                          <p className="text-white font-semibold text-lg">+91 98765 43210</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                          <p className="text-sm text-purple-100 mb-1">Email</p>
                          <p className="text-white font-semibold text-lg">info@kumarassociates.in</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                          <p className="text-sm text-purple-100 mb-1">Office</p>
                          <p className="text-white font-semibold">Supreme Court Complex, New Delhi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* High Court Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                  <BuildingLibraryIcon className="h-10 w-10 text-purple-600 mr-4" />
                  <h2 className="text-4xl font-bold text-gray-900">High Court Updates</h2>
                </div>
                <Link 
                  href="/news?category=High Court"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-lg flex items-center"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                  <div className="col-span-4 text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading news...</p>
                  </div>
                ) : highCourtNews.length > 0 ? (
                  highCourtNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/article/${news.id}`}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {news.imageUrl && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {truncateText(news.content, 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500" suppressHydrationWarning>
                            {new Date(news.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-16 bg-gray-50 rounded-xl">
                    <BuildingLibraryIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No High Court news available at the moment</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon for updates</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Advertisement Section 2 */}
          <section className="py-12 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  {/* Left Side - Purple Section */}
                  <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex flex-col justify-center">
                    <div className="text-white">
                      <div className="inline-block bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        LIMITED TIME OFFER
                      </div>
                      <h3 className="text-4xl font-bold mb-4">
                        Master Legal Practice
                      </h3>
                      <p className="text-xl text-purple-100 mb-8">
                        Comprehensive online courses for aspiring advocates
                      </p>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start">
                          <div className="bg-purple-500 rounded-lg p-2 mr-4">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">100+ Video Lectures</h4>
                            <p className="text-purple-200 text-sm">Expert faculty from top law schools</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-purple-500 rounded-lg p-2 mr-4">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Certification</h4>
                            <p className="text-purple-200 text-sm">Recognized certificate upon completion</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-6">
                        <div className="flex items-baseline">
                          <span className="text-5xl font-bold">₹4,999</span>
                          <span className="text-xl line-through text-purple-200 ml-3">₹9,999</span>
                          <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold ml-3">50% OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - White Section */}
                  <div className="md:col-span-3 p-12">
                    <div className="mb-8">
                      <h4 className="text-3xl font-bold text-gray-900 mb-4">LegalEdu Academy</h4>
                      <p className="text-gray-600 text-lg mb-6">
                        India's premier online platform for legal education and professional development
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                        <div className="text-purple-600 font-bold text-3xl mb-2">10,000+</div>
                        <div className="text-gray-600">Active Students</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                        <div className="text-indigo-600 font-bold text-3xl mb-2">4.8★</div>
                        <div className="text-gray-600">Average Rating</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                        <div className="text-purple-600 font-bold text-3xl mb-2">50+</div>
                        <div className="text-gray-600">Expert Instructors</div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                        <div className="text-indigo-600 font-bold text-3xl mb-2">24/7</div>
                        <div className="text-gray-600">Support Available</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg">
                        Enroll Now - Limited Seats!
                      </button>
                      <button className="w-full bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all">
                        View Course Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Podcasts Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                  <svg className="h-10 w-10 text-purple-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <h2 className="text-4xl font-bold text-gray-900">Legal Podcasts & Discussions</h2>
                </div>
                <Link 
                  href="/podcasts"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-lg flex items-center"
                >
                  Explore All →
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-2xl p-10 border border-purple-200 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                      Stay Informed with Expert Legal Insights
                    </h3>
                    <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                      Listen to in-depth discussions on landmark judgments, legal reforms, and expert commentary from India's leading legal minds. Our podcast library covers constitutional law, criminal law, civil matters, and more.
                    </p>
                    <Link 
                      href="/podcasts"
                      className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Browse Podcasts
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-purple-100 rounded-full p-4 mr-4">
                        <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xl">Featured Episode</h4>
                        <p className="text-sm text-gray-600">Latest Legal Discussion</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900">🎙️ Supreme Court Updates</p>
                        <p className="text-xs text-gray-600 mt-1">Analysis of recent landmark judgments</p>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900">⚖️ Legal Education Series</p>
                        <p className="text-xs text-gray-600 mt-1">Expert insights for law students</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch Supreme Court news
    const scNews = await prisma.news.findMany({
      where: {
        OR: [
          { courtName: 'Supreme Court of India' },
          { category: 'Supreme Court' },
        ]
      },
      orderBy: {
        publishDate: 'desc',
      },
      take: 4,
      include: {
        author: {
          select: {
            fullName: true,
            role: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Fetch High Court news
    const hcNews = await prisma.news.findMany({
      where: {
        OR: [
          { category: 'High Court' },
          { courtName: { contains: 'High Court' } },
        ]
      },
      orderBy: {
        publishDate: 'desc',
      },
      take: 4,
      include: {
        author: {
          select: {
            fullName: true,
            role: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Convert to plain objects
    const supremeCourtNews = scNews.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      createdAt: item.publishDate.toISOString(),
      imageUrl: item.imageUrl || null,
    }));

    const highCourtNews = hcNews.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      createdAt: item.publishDate.toISOString(),
      imageUrl: item.imageUrl || null,
    }));

    return {
      props: {
        supremeCourtNews,
        highCourtNews,
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      props: {
        supremeCourtNews: [],
        highCourtNews: [],
      },
    };
  }
};

export default LandingPage;
