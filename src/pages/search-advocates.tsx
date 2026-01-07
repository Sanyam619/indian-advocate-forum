import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Layout from '@/components/Layout';
import AdvocateSearch from '@/components/AdvocateSearch';

interface SearchAdvocatesPageProps {
  userEmail: string | null;
}

const SearchAdvocatesPage: React.FC<SearchAdvocatesPageProps> = ({ userEmail }) => {
  const router = useRouter();

  const handleSearchResults = (city: string, advocates: any[]) => {
    // Optional: Update URL with search parameters
    router.push(`/search-advocates?city=${encodeURIComponent(city)}`, undefined, { shallow: true });
  };

  const handleViewProfile = (advocateId: string) => {
    // All users can view profiles - preserve city parameter
    const city = router.query.city as string;
    if (city) {
      router.push(`/advocates/${advocateId}?city=${encodeURIComponent(city)}`);
    } else {
      router.push(`/advocates/${advocateId}`);
    }
  };

  const handleEmailAdvocate = (email: string, name: string) => {
    // All users can email advocates
    return true;
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
          />
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getSession(req, res);
    
    return {
      props: {
        userEmail: session?.user?.email || null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        userEmail: null,
      },
    };
  }
};

export default SearchAdvocatesPage;