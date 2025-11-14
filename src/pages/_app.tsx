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