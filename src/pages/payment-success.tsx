import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const { status } = router.query;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/auth');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router]);

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment {status === 'success' ? 'Successful' : 'Failed'} - Indian Advocate Forum</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {status === 'success' ? (
            <>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Payment Successful!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Your account has been created successfully.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800">What's next?</h3>
                <ul className="mt-2 text-sm text-green-700 list-disc list-inside space-y-1">
                  <li>You can now log in to your account</li>
                  <li>Complete your profile setup</li>
                  <li>Start exploring the forum</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Redirecting to login in {countdown} seconds...
                </p>
                <Link
                  href="/auth"
                  className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Go to Login Now
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                  <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Payment Failed
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  There was an issue processing your payment.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">What to do next?</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>Check your payment details and try again</li>
                  <li>Ensure you have sufficient funds</li>
                  <li>Contact your bank if the issue persists</li>
                </ul>
              </div>

              <div className="text-center space-y-3">
                <Link
                  href="/signup"
                  className="inline-flex justify-center w-full py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Try Again
                </Link>
                <Link
                  href="/"
                  className="inline-flex justify-center w-full py-2 px-6 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
