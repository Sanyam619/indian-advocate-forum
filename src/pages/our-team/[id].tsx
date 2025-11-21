import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ScaleIcon,
  CheckBadgeIcon,
  CalendarIcon,
  LanguageIcon,
  DocumentTextIcon,
  UserGroupIcon,
  VideoCameraIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface TeamMember {
  id: string;
  barRegistrationNo: string;
  title: string;
  name: string;
  emailId: string;
  legalTitle: string;
  phoneNo: string;
  yearOfBirth?: string;
  placeOfPractice: string;
  address: string;
  enrollment: string;
  webinarPrimaryPreference?: string;
  webinarSecondaryPreference?: string;
  articleContribution: boolean;
  references?: string;
  profilePhoto?: string;
  role: string;
}

export default function TeamMemberProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/team-members/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setMember(result.data);
        } else {
          setError(result.message || 'Team member not found');
        }
      } catch (error) {
        console.error('Error fetching team member:', error);
        setError('Failed to load team member profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !member) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || 'Team member not found'}</p>
            <button
              onClick={() => router.push('/our-team')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Our Team
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{member.name} - Indian Advocate Forum Team</title>
        <meta 
          name="description" 
          content={`Profile of ${member.name}, ${member.references || 'Member'} at Indian Advocate Forum`} 
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
          {/* Hero Section */}
          <div className={`${member.role === 'President' 
            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700' 
            : 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600'} text-white py-16`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Photo */}
                <div className="flex-shrink-0 relative">
                  {member.profilePhoto ? (
                    <img
                      src={member.profilePhoto}
                      alt={member.name}
                      className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-6xl font-bold border-4 border-white shadow-2xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {member.title} {member.name}
                  </h1>
                  <p className="text-2xl font-semibold text-purple-100 mb-4">
                    {member.references || 'Member'}
                  </p>
                  <p className="text-xl text-purple-50 mb-4">
                    {member.legalTitle}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                      <ScaleIcon className="h-4 w-4" />
                      {member.barRegistrationNo}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      {member.placeOfPractice}
                    </span>
                    {member.enrollment && (
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Enrollment Number: {member.enrollment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                    Contact
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a 
                        href={`mailto:${member.emailId}`}
                        className="text-purple-600 hover:text-purple-700 break-all"
                      >
                        {member.emailId}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a 
                        href={`tel:${member.phoneNo}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {member.phoneNo}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPinIcon className="h-6 w-6 text-purple-600" />
                    Location
                  </h2>
                  <p className="text-gray-700">{member.placeOfPractice}</p>
                </div>

                {/* Year of Birth */}
                {member.yearOfBirth && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CalendarIcon className="h-6 w-6 text-purple-600" />
                      Year of Birth
                    </h2>
                    <p className="text-gray-700 font-semibold text-lg">{member.yearOfBirth}</p>
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Office Address */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                    Office Address
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{member.address}</p>
                </div>

                {/* Webinar Preferences */}
                {(member.webinarPrimaryPreference || member.webinarSecondaryPreference) && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <VideoCameraIcon className="h-6 w-6 text-purple-600" />
                      Webinar Preferences
                    </h2>
                    <div className="space-y-3">
                      {member.webinarPrimaryPreference && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Primary Preference</p>
                          <p className="text-purple-700 font-semibold">{member.webinarPrimaryPreference}</p>
                        </div>
                      )}
                      {member.webinarSecondaryPreference && (
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Secondary Preference</p>
                          <p className="text-indigo-700 font-semibold">{member.webinarSecondaryPreference}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Article Contributions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                    Article Contributions
                  </h2>
                  <div className="flex items-center gap-2">
                    {member.articleContribution ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-700 font-semibold">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-600 font-semibold">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        No
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/our-team')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                Back to Our Team
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
