import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Custom hook that redirects to home page on refresh
 */
export const useRefreshRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.pathname;
    
    // Don't redirect if already on landing page, auth pages, admin panel, profile page, or admin edit pages
    const excludedPaths = [
      '/landing',
      '/',
      '/auth',
      '/profile',
      '/profile-setup',
      '/admin-panel',
      '/admin/',
    ];
    
    const isExcluded = excludedPaths.some(path => currentPath === path || currentPath.startsWith(path));
    
    if (!isExcluded) {
      // Check if navigation happened (which means this is NOT a refresh)
      const navigationHappened = sessionStorage.getItem('navigationHappened');
      
      if (!navigationHappened) {
        // No navigation flag = this is a refresh, redirect to landing
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 Page refresh detected on ${currentPath}, redirecting to landing`);
        }
        router.replace('/landing');
      }
      
      // Clear the flag for next time
      sessionStorage.removeItem('navigationHappened');
    }
  }, [router]);

  // Set flag when navigating between pages
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('navigationHappened', 'true');
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
};

export default useRefreshRedirect;