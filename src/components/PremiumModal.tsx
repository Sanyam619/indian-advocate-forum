import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { XMarkIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  originalPrice: number;
  price: number;
  pricePerMonth: number;
  discount: number;
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    duration: '1 Month',
    originalPrice: 199,
    price: 199,
    pricePerMonth: 199,
    discount: 0,
  },
  {
    id: '6months',
    name: '6 Months',
    duration: '6 Months',
    originalPrice: 1194,
    price: 999,
    pricePerMonth: 166,
    discount: 12,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    duration: '1 Year',
    originalPrice: 2388,
    price: 1799,
    pricePerMonth: 150,
    discount: 25,
    popular: true,
  },
  {
    id: '3years',
    name: '3 Years',
    duration: '3 Years',
    originalPrice: 7164,
    price: 3999,
    pricePerMonth: 111,
    discount: 44,
  },
];

const premiumFeatures = [
  'Ad-free experience across the platform',
  'Access to weekly and monthly legal digests',
  'In-depth articles on current legal issues',
  'Unlimited access to archives and orders',
  'Free copies of judgments with download facility',
  'Exclusive notifications on important updates',
  'Special coverage on Tax, IBC, Arbitration',
  'Priority customer support',
];

// Payment Form Component
function PaymentForm({ 
  selectedPlan, 
  onSuccess 
}: { 
  selectedPlan: PricingPlan; 
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/premium/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-4">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
      </button>
    </form>
  );
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(pricingPlans[2]); // Default to yearly
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [clientSecret, setClientSecret] = useState('');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      setShowSignInDialog(true);
      return;
    }

    setSelectedPlan(plan);
    setLoadingPlanId(plan.id);
    setError('');

    try {
      const response = await fetch('/api/premium/create-subscription-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/premium/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          planId: selectedPlan.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate subscription');
      }

      // Success - reload page to update premium status
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Activation failed');
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#7c3aed',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-5xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {step === 'plans' ? (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <SparklesIcon className="h-12 w-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Subscribe to Premium
                </h2>
                <p className="text-lg text-gray-600">
                  Get unlimited access to all contents just at ₹111/Month
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Features Grid */}
              <div className="mb-8 bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Premium Features:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative border-2 rounded-lg p-6 cursor-pointer transition-all border-gray-200 hover:border-purple-400 hover:shadow-lg"
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        Most Popular
                      </div>
                    )}
                    {plan.discount > 0 && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-tl-lg rounded-br-lg">
                        Save {plan.discount}%
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-600">{plan.duration}</p>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-sm text-gray-400 line-through mb-1 h-5">
                        {plan.discount > 0 ? `₹${plan.originalPrice}` : '\u00A0'}
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        ₹{plan.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        ₹{plan.pricePerMonth}/month
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loadingPlanId !== null}
                      className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPlanId === plan.id ? 'Loading...' : 'Subscribe'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                By confirming your subscription, you allow us to charge you for future payments in accordance with our terms & conditions. 
                Subscription will auto renew based on the subscription plan you purchased, through your account till you cancel your subscription.
              </div>
            </div>
          ) : (
            <div className="p-8">
              {/* Payment Step */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setStep('plans');
                    setClientSecret('');
                  }}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  ← Back to plans
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Payment
                </h2>
                <p className="text-gray-600">
                  {selectedPlan.name} Plan - ₹{selectedPlan.price}
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="max-w-md mx-auto">
                {!clientSecret ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payment form...</p>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentForm 
                      selectedPlan={selectedPlan} 
                      onSuccess={handlePaymentSuccess} 
                    />
                  </Elements>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign In Dialog */}
      {showSignInDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please sign in or create an account to subscribe to premium features
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 justify-center">
                  <a
                    href="/api/auth/login"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-center"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
                  >
                    Sign Up
                  </a>
                </div>
                <button
                  onClick={() => setShowSignInDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumModal;
