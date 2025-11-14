import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AdvocateSearch from '@/components/AdvocateSearch';

const SearchAdvocatesPage: React.FC = () => {
  const router = useRouter();

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
          <AdvocateSearch onSearch={handleSearchResults} />
        </div>
      </Layout>
    </>
  );
};

export default SearchAdvocatesPage;