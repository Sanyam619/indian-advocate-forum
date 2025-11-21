import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Redirect to landing page
  useEffect(() => {
    if (isLoading) return;
    
    // Always redirect to landing page
    router.replace('/landing');
  }, [router, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to home page...</p>
      </div>
    </div>
  );
}
