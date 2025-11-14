import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircleIcon, CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface SignupData {
  email: string;
  fullName: string;
  phone: string;
  isAdvocate: boolean;
  experience?: string;
  price: number;
  barRegistration?: string;
}

export default function Payment() {
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('signupData');
    if (data) {
      setSignupData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing with shorter delay for prototype
    setTimeout(() => {
      setIsProcessing(false);
      // Show success message
      alert('🎉 Payment Successful! Welcome to Indian Advocate Forum');
      
      // Store user data after successful payment
      const userData = {
        ...signupData,
        paymentCompleted: true,
        registrationDate: new Date().toISOString(),
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.removeItem('signupData');
      
      // Redirect to profile setup
      router.push('/profile-setup');
    }, 1500);
  };

  if (!signupData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Payment - Indian Advocate Forum</title>
        <meta name="description" content="Complete your registration payment" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-full overflow-hidden mb-4">
              <img 
                src="/logo.jpg" 
                alt="Indian Advocate Forum Logo" 
                className="h-16 w-16 object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Registration</h1>
            <p className="text-gray-600 mt-2">Secure payment to activate your account</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Order Summary */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Account Type:</span>
                  <span className="font-medium">
                    {signupData.isAdvocate 
                      ? `Advocate (${signupData.experience} years)` 
                      : 'General User'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Registration Fee:</span>
                  <span className="font-medium">₹{signupData.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%):</span>
                  <span className="font-medium">₹{Math.round(signupData.price * 0.18)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{Math.round(signupData.price * 1.18)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <div className="space-y-4 mb-6">
                {/* UPI */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={selectedPaymentMethod === 'upi'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-purple-primary focus:ring-purple-primary"
                  />
                  <DevicePhoneMobileIcon className="h-6 w-6 text-purple-primary ml-3 mr-3" />
                  <div>
                    <div className="font-medium">UPI Payment</div>
                    <div className="text-sm text-gray-500">Pay using UPI ID (Google Pay, PhonePe, Paytm)</div>
                  </div>
                </label>

                {/* Debit Card */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debit"
                    checked={selectedPaymentMethod === 'debit'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-purple-primary focus:ring-purple-primary"
                  />
                  <CreditCardIcon className="h-6 w-6 text-blue-500 ml-3 mr-3" />
                  <div>
                    <div className="font-medium">Debit Card</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                  </div>
                </label>

                {/* Credit Card */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={selectedPaymentMethod === 'credit'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-purple-primary focus:ring-purple-primary"
                  />
                  <CreditCardIcon className="h-6 w-6 text-green-500 ml-3 mr-3" />
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                  </div>
                </label>

                {/* Net Banking */}
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={selectedPaymentMethod === 'netbanking'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-purple-primary focus:ring-purple-primary"
                  />
                  <div className="h-6 w-6 bg-orange-500 rounded ml-3 mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">₹</span>
                  </div>
                  <div>
                    <div className="font-medium">Net Banking</div>
                    <div className="text-sm text-gray-500">All major banks supported</div>
                  </div>
                </label>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                {selectedPaymentMethod === 'upi' && (
                  <div>
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      required
                      placeholder="yourname@paytm"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                      value={paymentDetails.upiId}
                      onChange={handlePaymentDetailsChange}
                    />
                  </div>
                )}

                {(selectedPaymentMethod === 'debit' || selectedPaymentMethod === 'credit') && (
                  <>
                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        required
                        placeholder="Name as on card"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                        value={paymentDetails.cardholderName}
                        onChange={handlePaymentDetailsChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailsChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentDetailsChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          required
                          placeholder="123"
                          maxLength={4}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentDetailsChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedPaymentMethod === 'netbanking' && (
                  <div>
                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                      Select Your Bank
                    </label>
                    <select
                      id="bank"
                      name="bank"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                    >
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="uco">UCO Bank</option>
                    </select>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Secure Payment
                      </h3>
                      <div className="mt-1 text-sm text-green-700">
                        Your payment information is encrypted and secure. We do not store your card details.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-primary hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Payment - ₹${Math.round(signupData.price * 1.18)} (Demo)`
                  )}
                </button>
              </form>

              {/* Back Button */}
              <div className="mt-4 text-center">
                <Link 
                  href="/" 
                  className="text-sm text-purple-primary hover:text-purple-dark"
                >
                  ← Back to Registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}