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

  const handleViewProfile = (advocateId: string) => {
    if (isPremium) {
      // Premium users can view profiles
      router.push(`/advocates/${advocateId}`);
    } else {
      // Non-premium users see the modal
      setShowPremiumModal(true);
    }
  };

  const handleEmailAdvocate = (email: string, name: string) => {
    if (isPremium) {
      // Premium users can email advocates
      // This will be handled by AdvocateSearch component
      return true;
    } else {
      // Non-premium users see the modal
      setShowPremiumModal(true);
      return false;
    }
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
          <AdvocateSearch 
            onSearch={handleSearchResults}
            onViewProfile={handleViewProfile}
            onEmailAdvocate={handleEmailAdvocate}
            isPremium={isPremium}
          />
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
      // Not logged in - allow search but mark as non-premium
      return {
        props: {
          isPremium: false,
          userEmail: null,
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