import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Layout from '@/components/Layout';
import AdvocateSearch from '@/components/AdvocateSearch';
import PremiumModal from '@/components/PremiumModal';
import { SparklesIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface SearchAdvocatesPageProps {
  isPremium: boolean;
  userEmail: string | null;
}

const SearchAdvocatesPage: React.FC<SearchAdvocatesPageProps> = ({ isPremium, userEmail }) => {
  const router = useRouter();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleSearchResults = (city: string, advocates: any[]) => {
    // Optional: Update URL with search parameters
    router.push(`/search-advocates?city=${encodeURIComponent(city)}`, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>Find Legal Advocates - Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Search and find qualified legal advocates in your city. Connect with experienced lawyers for legal consultation and representation." 
        />
        <meta name="keywords" content="legal advocates, lawyers, legal consultation, India, law, attorney" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          {isPremium ? (
            <AdvocateSearch onSearch={handleSearchResults} />
          ) : (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-4">
                    <LockClosedIcon className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Premium Feature
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    Search Advocates is an exclusive feature for premium members
                  </p>
                  <p className="text-gray-500">
                    Upgrade to premium to access our comprehensive advocate search and connect with qualified legal professionals in your city.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                    <SparklesIcon className="h-6 w-6 text-purple-600" />
                    Premium Benefits
                  </h2>
                  <ul className="text-left space-y-3 max-w-md mx-auto">
                    <li className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Search advocates by city and specialization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">View detailed advocate profiles with experience and credentials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Direct contact with advocates via phone and email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Access to exclusive legal resources and content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Priority support and updates</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <SparklesIcon className="h-5 w-5" />
                  Upgrade to Premium
                </button>

                <p className="mt-6 text-sm text-gray-500">
                  Starting from ₹199/month • Cancel anytime
                </p>
              </div>
            </div>
          )}
        </div>
      </Layout>

      {showPremiumModal && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getSession(req, res);
    
    if (!session?.user) {
      // Not logged in - redirect to auth
      return {
        redirect: {
          destination: '/auth?returnTo=/search-advocates',
          permanent: false,
        },
      };
    }

    // Import Prisma dynamically
    const prisma = (await import('@/lib/prisma')).default;

    // Check user's premium status
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), 3000);
    });

    const userPromise = prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: {
        isPremium: true,
        premiumExpiresAt: true,
        email: true,
      },
    });

    const user = await Promise.race([userPromise, timeoutPromise]) as any;

    if (!user) {
      // User not found in database - allow but show as non-premium
      return {
        props: {
          isPremium: false,
          userEmail: session.user.email || null,
        },
      };
    }

    // Check if premium is active and not expired
    const isPremiumActive = user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

    return {
      props: {
        isPremium: isPremiumActive,
        userEmail: user.email || null,
      },
    };
  } catch (error) {
    console.error('Error checking premium status:', error);
    // On error, allow access but show as non-premium
    return {
      props: {
        isPremium: false,
        userEmail: null,
      },
    };
  }
};

export default SearchAdvocatesPage;