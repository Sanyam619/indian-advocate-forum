import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PremiumModal from '@/components/PremiumModal';
import prisma from '@/lib/prisma';
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface LawFirmEventsProps {
  isPremium: boolean;
  isAuthenticated: boolean;
}

const LawFirmEvents: React.FC<LawFirmEventsProps> = ({ isPremium, isAuthenticated }) => {
  const router = useRouter();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!isPremium) {
    return (
      <>
        <Head>
          <title>Law Firm Events - Premium Content | Indian Advocate Forum</title>
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
                  <p className="text-lg text-gray-600 mb-8">Upgrade to premium to access Law Firm Events and professional networking opportunities</p>
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
    <Layout title="Law Firm Events | Indian Advocate Forum">
      <Head>
        <title>Law Firm Events | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Legal events, seminars, conferences, and webinars organized by law firms in India. Stay updated with networking opportunities and professional development events." 
        />
        <meta name="keywords" content="law firm events, legal seminars, conferences, webinars, networking, legal education, professional development" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                🎯 Legal Events
              </h1>
              <p className="text-xl md:text-2xl text-violet-100 max-w-3xl mx-auto">
                Professional conferences, seminars & networking events from India's leading law firms
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
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg className="h-12 w-12 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  We're building a comprehensive platform for legal events and professional development opportunities. 
                  This section will feature:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="bg-blue-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Legal Conferences</h3>
                  <p className="text-blue-700 text-sm">Major legal conferences and summit events</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="bg-green-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Knowledge Seminars</h3>
                  <p className="text-green-700 text-sm">Educational seminars and thought leadership sessions</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="bg-purple-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Webinars</h3>
                  <p className="text-purple-700 text-sm">Online sessions and virtual legal discussions</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="bg-orange-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Networking Events</h3>
                  <p className="text-orange-700 text-sm">Professional networking and relationship building</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="bg-red-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Training Programs</h3>
                  <p className="text-red-700 text-sm">Professional development and skill enhancement programs</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                  <div className="bg-teal-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">Panel Discussions</h3>
                  <p className="text-teal-700 text-sm">Expert panel discussions on current legal topics</p>
                </div>
              </div>

              {/* Event Categories */}
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                  <h3 className="text-xl font-bold text-violet-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Event Types
                  </h3>
                  <ul className="space-y-2 text-violet-700">
                    <li className="flex items-center">
                      <span className="text-violet-500 mr-2">•</span>
                      Annual Legal Summits
                    </li>
                    <li className="flex items-center">
                      <span className="text-violet-500 mr-2">•</span>
                      Practice Area Conferences
                    </li>
                    <li className="flex items-center">
                      <span className="text-violet-500 mr-2">•</span>
                      Client Appreciation Events
                    </li>
                    <li className="flex items-center">
                      <span className="text-violet-500 mr-2">•</span>
                      Legal Tech Workshops
                    </li>
                    <li className="flex items-center">
                      <span className="text-violet-500 mr-2">•</span>
                      Regulatory Update Sessions
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Event Locations
                  </h3>
                  <ul className="space-y-2 text-indigo-700">
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Mumbai & Delhi NCR
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Bangalore & Chennai
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Kolkata & Hyderabad
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Pune & Ahmedabad
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Virtual/Online Events
                    </li>
                  </ul>
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Features</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-violet-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Event Calendar</h4>
                    <p className="text-gray-600 text-sm">Comprehensive calendar view of all upcoming legal events</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Event Registration</h4>
                    <p className="text-gray-600 text-sm">Easy online registration and ticket booking system</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Event Resources</h4>
                    <p className="text-gray-600 text-sm">Access to presentations, recordings, and event materials</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                <p className="text-violet-800 font-medium mb-2">
                  🎯 Professional Development Hub
                </p>
                <p className="text-violet-600 text-sm">
                  This platform will serve as your central hub for discovering legal events, conferences, and professional 
                  development opportunities organized by India's leading law firms and legal organizations.
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
          role: true,
        },
      });

      try {
        const user = await Promise.race([userPromise, timeoutPromise]) as any;
        
        if (user) {
          // Admins get free access to everything
          isPremium = user.role === 'ADMIN' || (user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date()));
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

export default LawFirmEvents;