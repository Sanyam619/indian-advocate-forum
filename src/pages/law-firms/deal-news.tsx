import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import PremiumModal from '@/components/PremiumModal';
import prisma from '@/lib/prisma';
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface DealNewsProps {
  isPremium: boolean;
  isAuthenticated: boolean;
}

const DealNews: React.FC<DealNewsProps> = ({ isPremium, isAuthenticated }) => {
  const router = useRouter();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!isPremium) {
    return (
      <>
        <Head>
          <title>Deal News - Premium Content | Indian Advocate Forum</title>
        </Head>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 flex items-center justify-center py-12">
            <div className="max-w-2xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-purple-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-6">
                    <LockClosedIcon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Content</h2>
                  <p className="text-lg text-gray-600 mb-8">Upgrade to premium to access Deal News and stay updated with latest transactions from India's leading law firms</p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                      <SparklesIcon className="h-6 w-6 text-purple-600" />
                      Premium Benefits
                    </h3>
                    <ul className="text-left space-y-3 max-w-md mx-auto">
                      <li className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Access to all law firm content</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Search and connect with advocates</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">Read full articles without restrictions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-gray-700">View team member profiles</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    {isAuthenticated ? (
                      <button onClick={() => setShowPremiumModal(true)} className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <SparklesIcon className="h-5 w-5" />
                        Upgrade to Premium
                      </button>
                    ) : (
                      <button onClick={() => router.push('/auth?returnTo=' + router.asPath)} className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Sign In to Continue
                      </button>
                    )}
                  </div>
                  <p className="mt-6 text-sm text-gray-500">Starting from ₹199/month • Cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
          {showPremiumModal && <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />}
        </Layout>
      </>
    );
  }

  return (
    <Layout title="Deal News - Law Firms | Indian Advocate Forum">
      <Head>
        <title>Deal News - Law Firms | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Latest deal news from law firms across India. Stay updated with major transactions, mergers, acquisitions, and corporate deals handled by leading law firms." 
        />
        <meta name="keywords" content="deal news, law firms, mergers, acquisitions, corporate deals, legal transactions, India" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                💼 Deal News
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                Latest transactions, mergers & acquisitions from India's leading law firms
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Coming Soon Section */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  We're working on bringing you the latest deal news and corporate transactions from India's top law firms. 
                  This section will feature:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="bg-blue-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">M&A Transactions</h3>
                  <p className="text-blue-700 text-sm">Major mergers and acquisitions handled by law firms</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="bg-green-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Capital Markets</h3>
                  <p className="text-green-700 text-sm">IPOs, bond issues, and capital raising activities</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="bg-purple-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Corporate Restructuring</h3>
                  <p className="text-purple-700 text-sm">Restructuring deals and corporate reorganizations</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="bg-orange-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Cross-border Deals</h3>
                  <p className="text-orange-700 text-sm">International transactions and joint ventures</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="bg-red-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Real Estate Deals</h3>
                  <p className="text-red-700 text-sm">Major real estate transactions and developments</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                  <div className="bg-teal-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">Tech & Startups</h3>
                  <p className="text-teal-700 text-sm">Technology sector deals and startup funding</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <p className="text-purple-800 font-medium mb-2">
                  📧 Want to be notified when this section launches?
                </p>
                <p className="text-purple-600 text-sm">
                  This feature is currently under development. We'll be featuring the latest deal announcements, 
                  transaction values, and insights from India's leading law firms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let isPremium = false;
  let isAuthenticated = false;

  try {
    const session = await getSession(req, res);
    
    if (session?.user) {
      isAuthenticated = true;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timeout')), 3000);
      });

      const userPromise = prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        select: {
          isPremium: true,
          premiumExpiresAt: true,
        },
      });

      try {
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        if (user) {
          isPremium = user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    }
  } catch (sessionError) {
    console.error('Session error:', sessionError);
  }

  return {
    props: {
      isPremium,
      isAuthenticated,
    },
  };
};

export default DealNews;