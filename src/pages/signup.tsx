import { useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Head from 'next/head';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthModal from '../components/auth/AuthModal';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const commonLanguages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi'];
const commonSpecializations = [
  'Criminal Law',
  'Civil Law',
  'Corporate Law',
  'Family Law',
  'Property Law',
  'Labour Law',
  'Tax Law',
  'Constitutional Law',
  'Intellectual Property',
  'Consumer Protection'
];

// Payment Form Component
function PaymentForm({ 
  formData, 
  onSuccess 
}: { 
  formData: any; 
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
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
            },
          },
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
        {isProcessing ? 'Processing...' : `Pay ₹${formData.isAdvocate ? '5,000' : '1,000'}`}
      </button>
    </form>
  );
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [clientSecret, setClientSecret] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isAdvocate: false,
    barRegistration: '',
    experience: '',
    city: '',
    specialization: [] as string[],
    bio: '',
    education: [''],
    languages: [] as string[],
    officeAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate advocate fields
      if (formData.isAdvocate) {
        if (!formData.barRegistration || !formData.experience) {
          setError('Please fill in Bar Registration and Experience');
          setLoading(false);
          return;
        }
        if (!formData.city) {
          setError('Please fill in your city');
          setLoading(false);
          return;
        }
        if (formData.specialization.length === 0) {
          setError('Please select at least one specialization');
          setLoading(false);
          return;
        }
        if (formData.education.some(edu => !edu.trim())) {
          setError('Please fill in all education fields or remove empty ones');
          setLoading(false);
          return;
        }
        if (formData.languages.length === 0) {
          setError('Please select at least one language');
          setLoading(false);
          return;
        }
      }

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.isAdvocate ? 5000 : 1000,
          userType: formData.isAdvocate ? 'advocate' : 'user',
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create user account without payment (test mode)
      const response = await fetch('/api/auth/signup-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentIntentId: 'test_skip_payment_' + Date.now(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create account');
      }

      // Account created - redirect to login
      window.location.href = '/api/auth/login?returnTo=/home';
    } catch (err: any) {
      setError(err.message || 'Account creation failed');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setLoading(true);

    try {
      // Create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentIntentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create account');
      }

      // Account created successfully - redirect to Auth0 login
      // User will need to login with their email and password
      window.location.href = '/api/auth/login?returnTo=/home';
    } catch (err: any) {
      setError(err.message || 'Account creation failed');
      setLoading(false);
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
    <>
      <Head>
        <title>Sign Up - Indian Advocate Forum</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {step === 'form' ? 'Create your account' : 'Complete Payment'}
            </h2>
            {step === 'payment' && (
              <p className="mt-2 text-center text-sm text-gray-600">
                Registration fee: ₹{formData.isAdvocate ? '5,000' : '1,000'}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {step === 'form' ? (
            <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdvocate"
                    name="isAdvocate"
                    checked={formData.isAdvocate}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdvocate" className="ml-2 text-sm text-gray-700">
                    I am an advocate (₹5,000 registration fee)
                  </label>
                </div>

                {formData.isAdvocate && (
                  <>
                    <div>
                      <label htmlFor="barRegistration" className="block text-sm font-medium text-gray-700">
                        Bar Registration Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="barRegistration"
                        name="barRegistration"
                        type="text"
                        required
                        value={formData.barRegistration}
                        onChange={handleInputChange}
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      >
                        <option value="">Select years of experience</option>
                        <option value="5+">5+ years</option>
                        <option value="10+">10+ years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {commonSpecializations.map((spec) => (
                          <label key={spec} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.specialization.includes(spec)}
                              onChange={() => {
                                if (formData.specialization.includes(spec)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    specialization: prev.specialization.filter(s => s !== spec)
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    specialization: [...prev.specialization, spec]
                                  }));
                                }
                              }}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself and your practice..."
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education <span className="text-red-500">*</span>
                      </label>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            required
                            value={edu}
                            onChange={(e) => {
                              const updated = [...formData.education];
                              updated[index] = e.target.value;
                              setFormData(prev => ({ ...prev, education: updated }));
                            }}
                            placeholder="e.g., LLB from Delhi University"
                            className="flex-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  education: prev.education.filter((_, i) => i !== index)
                                }));
                              }}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            education: [...prev.education, '']
                          }));
                        }}
                        className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-800"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Education
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {commonLanguages.map((lang) => (
                          <label key={lang} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.languages.includes(lang)}
                              onChange={() => {
                                if (formData.languages.includes(lang)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    languages: prev.languages.filter(l => l !== lang)
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    languages: [...prev.languages, lang]
                                  }));
                                }
                              }}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700">
                        Office Address
                      </label>
                      <textarea
                        id="officeAddress"
                        name="officeAddress"
                        rows={3}
                        value={formData.officeAddress}
                        onChange={handleInputChange}
                        placeholder="Enter your office address"
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                {!formData.isAdvocate && (
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                    Regular users: ₹1,000 registration fee
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <button
                type="button"
                onClick={handleSkipPayment}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 mt-3"
              >
                Skip Payment (Test Mode)
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign in
                </button>
              </p>
            </form>
          ) : (
            <>
              {!clientSecret ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading payment form...</p>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={options}>
                  <PaymentForm formData={formData} onSuccess={handlePaymentSuccess} />
                </Elements>
              )}
            </>
          )}

          {step === 'payment' && (
            <button
              onClick={() => setStep('form')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to form
            </button>
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}