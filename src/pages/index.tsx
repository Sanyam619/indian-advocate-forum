import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect once and when router is ready
    if (!router.isReady || hasRedirected) return;
    
    setHasRedirected(true);
    const showAuth = router.query.showAuth;
    if (showAuth === 'true') {
      router.replace('/landing?showAuth=true');
    } else {
      router.replace('/landing');
    }
  }, [router.isReady, router.query.showAuth, hasRedirected]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
