import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Custom hook that redirects to home page on refresh
 * Simple approach that only checks once on component mount
 */
export const useRefreshRedirect = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Only run this check once when the component first mounts
    if (isLoading || !user) {
      return;
    }

    const currentPath = router.pathname;
    
    // Don't redirect if already on news page, auth pages, or admin panel
    if (currentPath === '/news' || currentPath === '/' || currentPath === '/auth' || currentPath === '/admin-panel') {
      return;
    }

    // Check if this was a page refresh using sessionStorage
    const wasRefreshed = sessionStorage.getItem('pageWasRefreshed');
    
    if (!wasRefreshed) {
      // This is a normal navigation, mark it
      sessionStorage.setItem('pageWasRefreshed', 'false');
    } else if (wasRefreshed === 'true') {
      // This was a refresh, redirect to news and reset the flag
      console.log(`🔄 Page refresh detected on ${currentPath}, redirecting to news`);
      sessionStorage.setItem('pageWasRefreshed', 'false');
      router.replace('/news');
    }
  }, [router.pathname, user, isLoading]); // Only depend on pathname changes

  // Set up beforeunload event to mark when page is being refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('pageWasRefreshed', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useRefreshRedirect;