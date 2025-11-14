import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import AuthModal from '../components/auth/AuthModal';



export default function Auth() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const { returnTo } = router.query;

  useEffect(() => {
    if (user) {
      // Redirect to returnTo URL or home if already authenticated
      router.push(returnTo && typeof returnTo === 'string' ? returnTo : '/home');
    }
  }, [user, router, returnTo]);

  return (
    <div className="relative">
      <Head>
        <title>Indian Advocate Forum - Sign In</title>
      </Head>

      {/* Home page content in background */}
      <div className="fixed inset-0">
        <div className="h-full w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                India's Premier Legal Platform
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Connect with verified advocates, access legal news, and participate in professional video conferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <div className="relative z-10">
        <AuthModal />
      </div>
    </div>
  );
}
