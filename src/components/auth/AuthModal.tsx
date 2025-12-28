import { FC, useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import auth0 from 'auth0-js';

interface AuthModalProps {
  onClose?: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ onClose }) => {
  const { user, error: authError, isLoading } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webAuth, setWebAuth] = useState<auth0.WebAuth | null>(null);
  const router = useRouter();

  // Initialize Auth0 WebAuth only on client side to avoid SSR warnings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = new auth0.WebAuth({
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
        clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
        redirectUri: `${window.location.origin}/api/auth/callback`,
        responseType: 'code',
        scope: 'openid profile email',
      });
      setWebAuth(auth);
    }
  }, []);

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

  const handleSocialLogin = (connection: string) => {
    if (!webAuth) return;
    webAuth.authorize({
      connection: connection,
      redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '',
    });
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!webAuth) {
        setError('Authentication service not ready. Please try again.');
        setIsSubmitting(false);
        return;
      }
      // Redirect to Auth0 login with email pre-filled and direct to email/password screen
      webAuth.authorize({
        connection: 'Username-Password-Authentication',
        login_hint: email,
        redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '',
        prompt: 'login',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setIsSubmitting(false);
    }
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
              </div>
            )}

            <div className="space-y-3">
              {/* Social Login Buttons */}
              <button
                onClick={() => handleSocialLogin("google-oauth2")}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Continue with GitHub
              </button>

              <button
                onClick={() => handleSocialLogin("linkedin")}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="#0077B5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </button>

              <button
                onClick={() => handleSocialLogin("twitter")}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Continue with Twitter
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
                </div>
              </div>

              {/* Email/Password Button */}
              <a
                href={`/api/auth/login?connection=Username-Password-Authentication&returnTo=${typeof window !== 'undefined' ? window.location.pathname : '/'}`}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with Email
              </a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-purple-600 hover:text-purple-500 font-medium"
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
