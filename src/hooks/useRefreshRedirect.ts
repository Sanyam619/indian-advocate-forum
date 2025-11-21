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
  const hasChecked = useRef(false);

  // Clear the flag on route change START (before navigation completes)
  useEffect(() => {
    const handleRouteChangeStart = () => {
      sessionStorage.setItem('pageWasRefreshed', 'false');
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Route change started - clearing refresh flag');
      }
    };

    const handleRouteChangeComplete = () => {
      sessionStorage.setItem('pageWasRefreshed', 'false');
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Route change completed - refresh flag cleared');
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    // Only run this check once
    if (hasChecked.current || isLoading || !user) {
      return;
    }

    const currentPath = router.pathname;
    
    // Don't redirect if already on landing page, auth pages, admin panel, profile page, or admin edit pages
    const excludedPaths = [
      '/landing',
      '/',
      '/auth',
      '/profile',
      '/profile-setup',
      '/admin-panel',
      '/admin/add-judge',
      '/admin/add-team-member',
      '/admin/upload-podcast'
    ];
    
    if (excludedPaths.some(path => currentPath === path || currentPath.startsWith(path))) {
      sessionStorage.setItem('pageWasRefreshed', 'false');
      hasChecked.current = true;
      return;
    }

    // Check if this was a page refresh using sessionStorage
    const wasRefreshed = sessionStorage.getItem('pageWasRefreshed');
    
    if (wasRefreshed === 'true') {
      // This was a refresh, redirect to landing page and reset the flag
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Page refresh detected on ${currentPath}, redirecting to landing`);
      }
      sessionStorage.setItem('pageWasRefreshed', 'false');
      router.replace('/landing');
    } else {
      // Normal navigation - clear any stale flags
      sessionStorage.setItem('pageWasRefreshed', 'false');
    }
    
    hasChecked.current = true;
  }, [router, user, isLoading]);

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