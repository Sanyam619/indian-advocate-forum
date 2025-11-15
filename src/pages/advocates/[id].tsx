import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  ScaleIcon,
  BuildingOfficeIcon,
  LanguageIcon,
  CheckBadgeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AdvocateProfile {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string;
  barRegistrationNo?: string;
  yearsOfExperience: string;
  city: string;
  specialization?: string[];
  isVerified: boolean;
  createdAt: string;
  bio?: string;
  education?: string[];
  languages?: string[];
  officeAddress?: string;
}

interface AdvocateProfilePageProps {
  advocate: AdvocateProfile | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const response = await fetch(`${baseUrl}/api/advocates/${id}`);
    const data = await response.json();

    if (!data.success) {
      return {
        props: {
          advocate: null,
          error: data.message || 'Advocate not found',
        },
      };
    }

    return {
      props: {
        advocate: {
          ...data.advocate,
          createdAt: data.advocate.createdAt || new Date().toISOString(),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching advocate:', error);
    return {
      props: {
        advocate: null,
        error: 'Failed to load advocate profile',
      },
    };
  }
};

const AdvocateProfilePage: React.FC<AdvocateProfilePageProps> = ({ advocate, error }) => {
  const router = useRouter();

  if (error || !advocate) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The advocate profile you are looking for does not exist.'}</p>
              <button
                onClick={() => router.push('/search-advocates')}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Back to Search
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleEmail = () => {
    const subject = encodeURIComponent('Legal Consultation Inquiry from Indian Advocate Forum');
    const body = encodeURIComponent(`Dear ${advocate.fullName},

I found your profile on the Indian Advocate Forum and would like to inquire about legal consultation.

My Details:
- Location: ${advocate.city}
- Legal Matter: [Please describe your legal matter here]

Please let me know your availability and consultation process.

Thank you,
[Your Name]`);
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(advocate.email)}&su=${subject}&body=${body}`;
    window.open(gmailLink, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
  };

  return (
    <>
      <Head>
        <title>{advocate.fullName} - Advocate Profile | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content={`View the professional profile of ${advocate.fullName}, ${advocate.specialization} specialist with ${advocate.yearsOfExperience} years of experience in ${advocate.city}.`}
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
          {/* Header with Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center text-gray-600 hover:text-purple-700 transition-all duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Search
            </button>
          </div>

          {/* Profile Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 sm:px-8 lg:px-10 py-8">
                {/* Profile Content */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      {advocate.profilePhoto ? (
                        <img
                          src={advocate.profilePhoto}
                          alt={advocate.fullName}
                          className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-purple-100 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white text-5xl sm:text-6xl font-bold border-4 border-purple-100 shadow-lg">
                          {advocate.fullName.charAt(0)}
                        </div>
                      )}
                      {advocate.isVerified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                          <CheckBadgeIcon className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Name and Title */}
                    <div className="pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                          Adv. {advocate.fullName}
                        </h1>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 mb-3">
                        <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <ScaleIcon className="h-4 w-4 mr-1.5 text-purple-600" />
                          <span className="font-medium">{advocate.yearsOfExperience} Years</span>
                        </span>
                        <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                          <MapPinIcon className="h-4 w-4 mr-1.5 text-purple-600" />
                          <span className="font-medium">{advocate.city}</span>
                        </span>
                      </div>
                      {advocate.barRegistrationNo && (
                        <p className="text-sm text-gray-500 font-mono bg-gray-50 inline-block px-3 py-1 rounded">
                          Bar Reg: {advocate.barRegistrationNo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specialization Tags */}
                {advocate.specialization && advocate.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {advocate.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-semibold rounded-lg border border-purple-200 hover:border-purple-300 transition-colors duration-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <EnvelopeIcon className="h-5 w-5 mr-2" />
                      Contact Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          Email Address
                        </label>
                        <button
                          onClick={handleEmail}
                          className="group w-full text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 px-4 py-3 rounded-lg transition-all duration-200 break-all border border-blue-200 hover:border-blue-300"
                        >
                          <span className="font-medium">{advocate.email}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages Card */}
                {advocate.languages && advocate.languages.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <LanguageIcon className="h-5 w-5 mr-2" />
                        Languages
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {advocate.languages.map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium rounded-lg border border-gray-200"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Since Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-100">
                  <div className="flex items-center gap-3 text-purple-700">
                    <CalendarIcon className="h-6 w-6" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Member Since</p>
                      <p className="text-lg font-bold">{formatDate(advocate.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                {advocate.bio && (
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className="mr-2">📋</span>
                        About
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                        {advocate.bio}
                      </p>
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {advocate.education && advocate.education.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <AcademicCapIcon className="h-6 w-6 mr-2" />
                        Education & Qualifications
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                      <ul className="space-y-4">
                        {advocate.education.map((edu, index) => (
                          <li key={index} className="flex items-start group">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                              <span className="text-purple-700 font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="text-gray-700 text-lg pt-0.5">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Office Address Section */}
                {advocate.officeAddress && (
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <BuildingOfficeIcon className="h-6 w-6 mr-2" />
                        Office Address
                      </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-purple-600">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                          {advocate.officeAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdvocateProfilePage;
