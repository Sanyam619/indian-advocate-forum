import { FC, useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

interface AuthModalProps {
  onClose?: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ onClose }) => {
  const { user, error: authError, isLoading } = useUser();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Set error message if Auth0 returns an error
  useEffect(() => {
    if (authError) {
      // Check if it's a timeout error and provide helpful message
      if (authError.message.includes('timed out') || authError.message.includes('Discovery requests failing')) {
        setError('Auth0 connection timeout. Please try signing in again - this usually works on the second attempt.');
      } else {
        setError(authError.message);
      }
      console.error("Auth0 error:", authError);
    }
  }, [authError]);

  // Convert connectionName to Auth0 format for the login URL
  const getLoginUrl = (connection?: string, screenHint?: string) => {
    let url = '/api/auth/login';
    const params = new URLSearchParams();
    
    if (connection) {
      params.append('connection', connection);
    }
    
    if (screenHint) {
      params.append('screen_hint', screenHint);
    }
    
    // Add the current URL as returnTo parameter
    params.append('returnTo', window.location.pathname);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return url;
  };

  const handleLogin = (connection?: string, screenHint?: string) => {
    const loginUrl = getLoginUrl(connection, screenHint);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Login button clicked! Redirecting to: ${loginUrl}`);
      console.log('Connection:', connection, 'Screen hint:', screenHint);
    }
    
    // Use window.location for more reliable redirect
    window.location.href = loginUrl;
  };

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!user ? (
          <>
            <div className="text-center mb-6">
              <img 
                src="/logo.jpg" 
                alt="Indian Advocate Forum Logo" 
                className="mx-auto h-12 w-12 rounded-lg mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome to Indian Advocate Forum
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Authentication Error</p>
                <p className="text-sm">{error}</p>
                <p className="text-sm mt-2">
                  Please ensure your Auth0 application has these URLs configured:
                  <br />
                  • Callback URL: <code className="bg-red-100 px-1">{typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback</code>
                  <br />
                  • Web Origins: <code className="bg-red-100 px-1">{typeof window !== 'undefined' ? window.location.origin : ''}</code>
                </p>
                <p className="text-sm mt-2">
                  Current application port: <code className="bg-red-100 px-1">{typeof window !== 'undefined' ? window.location.port || "80/443" : ''}</code>
                </p>
              </div>
            )}

            <div className="space-y-6 mt-8">
              <button
                onClick={() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔴 Google login button clicked!');
                  }
                  handleLogin("google-oauth2");
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('📧 Email login button clicked!');
                  }
                  handleLogin();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#616161">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Continue with Email
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">Logged in as <b>{user.name || user.email}</b></p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
