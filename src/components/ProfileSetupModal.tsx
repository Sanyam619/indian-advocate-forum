import { useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

interface ProfileSetupModalProps {
  userEmail: string;
  onComplete: () => void;
}

export default function ProfileSetupModal({ userEmail, onComplete }: ProfileSetupModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    email: userEmail,
    firstName: '',
    lastName: '',
    isAdvocate: false,
    barRegistration: '',
    experience: '',
    city: '',
    specialization: [] as string[],
    languages: [] as string[],
    customSpecialization: '',
    customLanguage: '',
    phoneNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (field: 'specialization' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleAddCustom = (field: 'specialization' | 'languages', customField: 'customSpecialization' | 'customLanguage') => {
    const customValue = formData[customField].trim();
    if (customValue && !formData[field].includes(customValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], customValue],
        [customField]: ''
      }));
    }
  };

  const handleRemoveItem = (field: 'specialization' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.isAdvocate && (!formData.barRegistration || !formData.experience)) {
      alert('Please fill in all advocate details');
      return;
    }

    // Create payment intent
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.isAdvocate ? 500000 : 100000, // Amount in paise
          userType: formData.isAdvocate ? 'advocate' : 'user',
        }),
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Update user profile
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentIntentId,
        }),
      });

      if (response.ok) {
        onComplete();
        router.push('/profile-setup?success=true');
      } else {
        alert('Profile setup failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error setting up profile:', error);
      alert('An error occurred. Please contact support.');
    }
  };

  const handleSkipPayment = async () => {
    // Validate required fields first
    if (!formData.firstName || !formData.lastName) {
      alert('Please fill in your name before skipping payment');
      setStep('form');
      return;
    }

    if (formData.isAdvocate && (!formData.barRegistration || !formData.experience)) {
      alert('Please fill in all advocate details before skipping payment');
      setStep('form');
      return;
    }

    try {
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentIntentId: 'test_skip_payment',
        }),
      });

      if (response.ok) {
        onComplete();
        router.push('/profile-setup?success=true');
      } else {
        const errorData = await response.json();
        alert(`Failed to setup profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while setting up your profile. Please try again.');
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#7c3aed',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            {step === 'form' ? 'Please provide your details to continue' : 'Complete your payment to activate your account'}
          </p>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {step === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdvocate"
                    checked={formData.isAdvocate}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    I am a Legal Advocate
                  </span>
                </label>
              </div>

              {/* Advocate-specific fields */}
              {formData.isAdvocate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bar Council Registration Number *
                    </label>
                    <input
                      type="text"
                      name="barRegistration"
                      value={formData.barRegistration}
                      onChange={handleInputChange}
                      required={formData.isAdvocate}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required={formData.isAdvocate}
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Specializations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization(s)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonSpecializations.map((spec) => (
                        <label key={spec} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.specialization.includes(spec)}
                            onChange={() => handleCheckboxChange('specialization', spec)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={formData.customSpecialization}
                        onChange={(e) => setFormData(prev => ({ ...prev, customSpecialization: e.target.value }))}
                        placeholder="Add custom specialization"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustom('specialization', 'customSpecialization')}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {formData.specialization.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.specialization.map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('specialization', spec)}
                              className="ml-2"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonLanguages.map((lang) => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.languages.includes(lang)}
                            onChange={() => handleCheckboxChange('languages', lang)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={formData.customLanguage}
                        onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                        placeholder="Add custom language"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustom('languages', 'customLanguage')}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {formData.languages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.languages.map((lang) => (
                          <span
                            key={lang}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem('languages', lang)}
                              className="ml-2"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Registration Fee:</strong> ₹{formData.isAdvocate ? '5,000' : '1,000'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {formData.isAdvocate 
                    ? 'Advocate membership with full features' 
                    : 'Basic user access to legal services'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Continue to Payment
              </button>

              <button
                type="button"
                onClick={handleSkipPayment}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 mt-2"
              >
                Skip Payment (Test Mode)
              </button>
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
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 mt-4"
            >
              ← Back to form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
