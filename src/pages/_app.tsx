import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { validateEnvironment, EnvironmentError } from '@/utils/validateEnv';
import RefreshHandler from '@/components/RefreshHandler';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Validate environment variables in development
    if (process.env.NODE_ENV === 'development') {
      try {
        validateEnvironment();
        console.log('Environment validation passed successfully');
      } catch (error) {
        if (error instanceof EnvironmentError) {
          console.error('Environment Error:', error.message);
        } else {
          console.error('Unexpected error during environment validation:', error);
        }
      }
    }
  }, [router.pathname]);

  // Debug route navigation to diagnose profile navigation issues
  useEffect(() => {
    const handleStart = (url: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚦 routeChangeStart:', url);
      }
    };
    const handleComplete = (url: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ routeChangeComplete:', url);
      }
    };
    const handleError = (err: any, url: string) => {
      // Ignore cancelled route changes (this is normal when navigating quickly)
      if (err?.cancelled) return;
      
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ routeChangeError:', url, err);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router.events]);

  return (
    <UserProvider user={pageProps.user}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RefreshHandler />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </UserProvider>
  );
}

export default App;