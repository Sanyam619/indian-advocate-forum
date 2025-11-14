import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { SparklesIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface SubscriptionData {
  isPremium: boolean;
  premiumPlan: string | null;
  premiumExpiresAt: string | null;
}

const planNames: Record<string, string> = {
  monthly: 'Monthly Plan',
  '6months': '6 Months Plan',
  yearly: 'Yearly Plan',
  '3years': '3 Years Plan',
};

const ManageSubscription: React.FC = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/api/auth/login?returnTo=/premium/manage');
      return;
    }

    // Fetch subscription data
    fetch('/api/auth/check-profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setSubscription({
            isPremium: data.user.isPremium || false,
            premiumPlan: data.user.premiumPlan || null,
            premiumExpiresAt: data.user.premiumExpiresAt || null,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching subscription:', err);
        setLoading(false);
      });
  }, [user, isLoading, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!subscription?.isPremium) {
    return (
      <Layout>
        <Head>
          <title>Manage Subscription - Indian Advocate Forum</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Active Subscription
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have an active premium subscription.
              </p>
              <button
                onClick={() => router.push('/news')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Explore Premium Plans
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const daysRemaining = subscription.premiumExpiresAt 
    ? getDaysRemaining(subscription.premiumExpiresAt) 
    : 0;

  return (
    <Layout>
      <Head>
        <title>Manage Subscription - Indian Advocate Forum</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Premium Badge */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <SparklesIcon className="h-8 w-8 mr-2" />
                  <h1 className="text-3xl font-bold">Premium Member</h1>
                </div>
                <p className="text-purple-100">
                  You're enjoying all premium features
                </p>
              </div>
              <div className="bg-white/20 rounded-lg px-6 py-4 text-center backdrop-blur-sm">
                <div className="text-4xl font-bold">{daysRemaining}</div>
                <div className="text-sm text-purple-100">Days Left</div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Subscription Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CreditCardIcon className="h-6 w-6 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Current Plan</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {subscription.premiumPlan ? planNames[subscription.premiumPlan] : 'Unknown'}
                  </div>
                </div>
              </div>

              {subscription.premiumExpiresAt && (
                <div className="flex items-start">
                  <CalendarIcon className="h-6 w-6 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Expires On</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatDate(subscription.premiumExpiresAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Warning if expiring soon */}
          {daysRemaining <= 30 && daysRemaining > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Subscription Expiring Soon
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Your premium subscription will expire in {daysRemaining} days. 
                    Renew now to continue enjoying premium features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Premium Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Ad-free experience',
                'Weekly legal digests',
                'In-depth articles',
                'Unlimited archives access',
                'Download judgments',
                'Exclusive notifications',
                'Tax, IBC coverage',
                'Priority support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              For any questions or support, please contact us at support@indianadvocateforum.com
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageSubscription;
