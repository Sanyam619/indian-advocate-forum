import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PremiumSuccess: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to manage page after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/premium/manage');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Premium Subscription Activated - Indian Advocate Forum</title>
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Premium! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your premium subscription has been activated successfully.
          </p>

          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-800">
              You now have access to all premium features including ad-free experience, 
              exclusive content, and priority support.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Redirecting to your subscription dashboard...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumSuccess;
