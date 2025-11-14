import AdvocateProfileForm from '../components/auth/AdvocateProfileForm';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Layout from '../components/Layout';
import { PhotoIcon, CameraIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const commonLanguages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi'];
const commonPracticeAreas = [
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

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const prisma = (await import('../lib/prisma')).default;
    
    const session = await getSession(req, res);
    if (!session?.user) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };
    }

    // Check if user has already completed profile setup
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
    });

    // Always redirect to news page (we use modal for profile setup now)
    // If profile is not complete, modal will show on news page
    return {
      redirect: {
        destination: '/news',
        permanent: false,
      },
    };
  },
});

export default function ProfileSetup() {
  const router = useRouter();
  const { user: auth0User, isLoading } = useUser();
  
  // State variables
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdvocateForm, setShowAdvocateForm] = useState(false);
  const [isAdvocate, setIsAdvocate] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barRegistrationNo, setBarRegistrationNo] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [city, setCity] = useState('');
  const [specialization, setSpecialization] = useState('');
  
  // Extended advocate fields
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState<string[]>(['']);
  const [languages, setLanguages] = useState<string[]>([]);
  const [officeAddress, setOfficeAddress] = useState('');
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [userData, setUserData] = useState<any>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Helper functions for extended fields
  const handleAddEducation = () => {
    setEducation([...education, '']);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, value: string) => {
    const updated = [...education];
    updated[index] = value;
    setEducation(updated);
  };

  const toggleLanguage = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter(l => l !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const togglePracticeArea = (area: string) => {
    if (practiceAreas.includes(area)) {
      setPracticeAreas(practiceAreas.filter(a => a !== area));
    } else {
      setPracticeAreas([...practiceAreas, area]);
    }
  };

  useEffect(() => {
    // Load user data and check profile setup
    const loadUserData = async () => {
      if (isLoading) return;
      
      try {
        const response = await fetch('/api/auth/check-profile');
        const data = await response.json();
        
        if (data.isProfileSetup) {
          router.push('/news');
        } else {
          // Check if user has already selected advocate status
          const user = data.user;
          if (user && user.role !== 'USER') {
            // User has selected advocate status, show photo upload
            setIsAdvocate(user.role === 'ADVOCATE');
            setBarRegistrationNo(user.barRegistrationNo || '');
            setYearsOfExperience(user.yearsOfExperience || '');
            setShowAdvocateForm(false);
            setUserData({
              fullName: user.fullName,
              email: user.email,
              isAdvocate: user.role === 'ADVOCATE',
              experience: user.yearsOfExperience,
              barRegistration: user.barRegistrationNo
            });
          } else {
            // New user - show advocate selection form first
            setShowAdvocateForm(true);
            setUserData({
              fullName: auth0User?.name || user?.fullName || 'User',
              email: auth0User?.email || user?.email || 'user@example.com',
              isAdvocate: false,
              experience: null,
              barRegistration: null
            });
          }
        }
      } catch (error) {
        console.error('Error checking profile setup:', error);
        // For new users, show advocate form first
        setShowAdvocateForm(true);
        setUserData({
          fullName: auth0User?.name || 'User',
          email: auth0User?.email || 'user@example.com',
          isAdvocate: false,
          experience: null,
          barRegistration: null
        });
      }
    };

    loadUserData();
  }, [router, auth0User, isLoading]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (base64Image: string): Promise<string> => {
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: base64Image }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleAdvocateFormSubmit = async () => {
    if (isAdvocate === null) {
      alert('Please select whether you are an advocate or not');
      return;
    }

    if (isAdvocate && (!barRegistrationNo || !yearsOfExperience || !city || !specialization)) {
      alert('Please fill in all required advocate details');
      return;
    }

    if (isAdvocate && languages.length === 0) {
      alert('Please select at least one language');
      return;
    }

    if (isAdvocate && practiceAreas.length === 0) {
      alert('Please select at least one practice area');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Save advocate status to database
      const response = await fetch('/api/auth/profile-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdvocate,
          firstName,
          lastName,
          barRegistrationNo: isAdvocate ? barRegistrationNo : null,
          yearsOfExperience: isAdvocate ? yearsOfExperience : null,
          city: isAdvocate ? city : null,
          specialization: isAdvocate ? specialization : null,
          bio: isAdvocate ? bio : null,
          education: isAdvocate ? education.filter(e => e.trim() !== '') : [],
          languages: isAdvocate ? languages : [],
          officeAddress: isAdvocate ? officeAddress : null,
          practiceAreas: isAdvocate ? practiceAreas : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile information');
      }

      console.log('✅ Advocate status saved');
      
      // Update userData and move to photo upload step
      setUserData({
        ...userData,
        isAdvocate,
        experience: yearsOfExperience,
        barRegistration: barRegistrationNo
      });
      setShowAdvocateForm(false);

    } catch (error) {
      console.error('❌ Error saving advocate status:', error);
      alert('Error saving profile information. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePhotoPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      alert('✅ Photo upload payment successful! You can now add your photo.');
      fileInputRef.current?.click();
    }, 1000);
  };

  const completeProfileSetup = async () => {
    setIsProcessingPayment(true);
    
    try {
      let photoUrl = null;
      
      // If user has selected a photo, upload it to Cloudinary first
      if (profilePhoto) {
        console.log('📸 Uploading photo to Cloudinary...');
        photoUrl = await uploadToCloudinary(profilePhoto);
        console.log('✅ Photo uploaded successfully:', photoUrl);
        
        // Save the photo URL to the database
        const response = await fetch('/api/auth/upload-profile-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photoUrl: photoUrl }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save photo to profile');
        }
        
        console.log('✅ Photo saved to database');
      }
      
      // Mark profile setup as complete (isProfileSetup: true, isVerified: true)
      const profileResponse = await fetch('/api/auth/profile-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdvocate: userData.isAdvocate,
          barRegistrationNo: userData.barRegistration,
          yearsOfExperience: userData.experience,
          completeSetup: true  // Flag to indicate final step
        }),
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to complete profile setup');
      }
      
      console.log('✅ Profile setup completed successfully');
      router.push('/news');
      
    } catch (error) {
      console.error('❌ Error completing profile setup:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading || !userData) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    </Layout>
  );

  // Show Advocate Selection Form first for new users
  if (showAdvocateForm) {
    return (
      <Layout>
        <Head>
          <title>Profile Setup - Indian Advocate Forum</title>
          <meta name="description" content="Complete your profile setup" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="mt-2 text-gray-600">Welcome to Indian Advocate Forum!</p>
              <p className="mt-1 text-sm text-gray-500">
                Logged in as <span className="font-medium">{userData.fullName}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 max-h-[80vh] overflow-y-auto">
              <div className="mb-6">
                <label className="text-lg font-semibold text-gray-900 block mb-4">
                  Are you an advocate?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAdvocate(true)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      isAdvocate === true
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Yes, I'm an Advocate
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdvocate(false)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      isAdvocate === false
                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No, I'm a User
                  </button>
                </div>
              </div>

              {/* Conditional Fields for Advocates */}
              {isAdvocate && (
                <div className="space-y-6 mb-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Bar Registration and Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="barRegistration" className="block text-sm font-medium text-gray-700 mb-2">
                        Bar Registration Number *
                      </label>
                      <input
                        type="text"
                        id="barRegistration"
                        value={barRegistrationNo}
                        onChange={(e) => setBarRegistrationNo(e.target.value)}
                        placeholder="e.g., MH/1234/2015"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        id="experience"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="5+">5+ years</option>
                        <option value="8+">8+ years</option>
                        <option value="15+">15+ years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                  </div>

                  {/* City and Specialization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Mumbai, Delhi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g., Criminal Law"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell clients about your experience and expertise..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    {education.map((edu, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={edu}
                          onChange={(e) => handleEducationChange(index, e.target.value)}
                          placeholder="e.g., LLB - Mumbai University (2015)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(index)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="mt-2 flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Education
                    </button>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {commonLanguages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            languages.includes(language)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Practice Areas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Practice Areas *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonPracticeAreas.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => togglePracticeArea(area)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            practiceAreas.includes(area)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Office Address */}
                  <div>
                    <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Office Address
                    </label>
                    <textarea
                      id="officeAddress"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      rows={3}
                      placeholder="Enter your office address..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {isAdvocate === false && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Great!</span> You'll have access to browse news, search for advocates, and access legal resources.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAdvocateFormSubmit}
                disabled={isAdvocate === null || isProcessingPayment || (isAdvocate && (!barRegistrationNo || !yearsOfExperience))}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Continue to Photo Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show Photo Upload section after advocate selection

  return (
    <Layout>
      <Head>
        <title>Profile Setup - Indian Advocate Forum</title>
        <meta name="description" content="Complete your profile setup" />
      </Head>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">Welcome to Indian Advocate Forum!</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-6">
            {/* User Info */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Account Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{userData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium">
                    {userData.isAdvocate
                      ? `Advocate (${userData.experience} years)`
                      : 'General User'}
                  </span>
                </div>
                {userData.isAdvocate && userData.barRegistration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bar Registration:</span>
                    <span className="font-medium">{userData.barRegistration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>

              {profilePhoto ? (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-purple-primary"
                    />
                    <button
                      onClick={() => setProfilePhoto(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Great! Your profile photo looks good.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="h-32 w-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>

                  {userData.isAdvocate ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        As an advocate, adding a profile photo requires a small fee of ₹100
                      </p>
                      <div className="bg-yellow-100 border border-yellow-400 rounded-lg px-3 py-2 mb-3">
                        <p className="text-yellow-800 text-xs font-medium">
                          DEMO: Click to simulate payment
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full py-2 px-4 border border-purple-primary text-purple-primary rounded-md hover:bg-purple-50 text-sm font-medium"
                        >
                          Add Photo (₹100)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Add your profile photo to help others recognize you
                      </p>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center w-full py-2 px-4 bg-purple-primary text-white rounded-md hover:bg-purple-dark text-sm font-medium"
                        >
                          <PhotoIcon className="h-4 w-4 mr-2" />
                          Choose from Gallery
                        </button>
                        <button
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex items-center justify-center w-full py-2 px-4 border border-purple-primary text-purple-primary rounded-md hover:bg-purple-50 text-sm font-medium"
                        >
                          <CameraIcon className="h-4 w-4 mr-2" />
                          Take a Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleCameraCapture}
              className="hidden"
            />

            {/* Complete Button */}
            <button
              onClick={completeProfileSetup}
              disabled={isProcessingPayment}
              className="w-full py-3 px-4 bg-purple-primary text-white rounded-md hover:bg-purple-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {profilePhoto ? 'Uploading Photo...' : 'Completing Setup...'}
                </div>
              ) : (
                'Complete Profile & Continue'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Profile Photo</h3>
              <p className="text-sm text-gray-600 mt-2">
                Pay ₹100 to add your profile photo. This is a one-time fee.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-primary focus:border-purple-primary"
                >
                  <option value="upi">UPI Payment</option>
                  <option value="card">Debit/Credit Card</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 py-2 px-4 bg-purple-primary text-white rounded-md hover:bg-purple-dark disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Pay ₹100 (Demo)'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}