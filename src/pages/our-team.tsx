import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { 
  MapPinIcon, 
  ScaleIcon,
  CheckBadgeIcon,
  ArrowRightIcon
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

export default function OurTeamPage() {
  const [president, setPresident] = useState<TeamMember | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members');
        const result = await response.json();
        
        if (result.success) {
          setPresident(result.data.president);
          setMembers(result.data.members);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading team members...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Our Team - Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Meet the dedicated professionals of Indian Advocate Forum working to connect legal minds across India." 
        />
        <meta name="keywords" content="team, advocates, lawyers, legal professionals, India" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Our Team
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Dedicated professionals working to connect legal minds across India
              </p>
              <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* President Section */}
            {president && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <span className="text-3xl">🏆</span>
                    President
                  </h2>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    {/* President Photo */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {president.profilePhoto ? (
                          <img
                            src={president.profilePhoto}
                            alt={president.name}
                            className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-2xl"
                          />
                        ) : (
                          <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-6xl font-bold border-4 border-white shadow-2xl">
                            {president.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* President Info */}
                    <div className="text-center lg:text-left flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold mb-2">
                        {president.title} {president.name}
                      </h3>
                      <p className="text-xl font-semibold text-purple-100 mb-3">
                        President - Indian Advocate Forum
                      </p>
                      <p className="text-lg text-purple-50 mb-4">
                        {president.legalTitle}
                      </p>
                      
                      <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                          <ScaleIcon className="inline h-4 w-4 mr-1" />
                          {president.barRegistrationNo}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                          <MapPinIcon className="inline h-4 w-4 mr-1" />
                          {president.placeOfPractice}
                        </span>
                      </div>

                      <Link href={`/our-team/${president.id}`}>
                        <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 inline-flex items-center gap-2">
                          View Complete Profile
                          <ArrowRightIcon className="h-5 w-5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Team Members Section */}
            {members.length > 0 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team Members</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6">
                        {/* Member Photo */}
                        <div className="relative mb-4">
                          {member.profilePhoto ? (
                            <img
                              src={member.profilePhoto}
                              alt={member.name}
                              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-100 group-hover:border-purple-300 transition-colors duration-200"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-purple-100 group-hover:border-purple-300 transition-colors duration-200">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {member.title} {member.name}
                          </h3>
                          <p className="text-purple-600 font-semibold mb-3">
                            {member.references || 'Member'}
                          </p>

                          <div className="space-y-2 mb-4">
                            <p className="text-xs text-gray-500 font-mono bg-gray-50 inline-block px-3 py-1 rounded">
                              {member.barRegistrationNo}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                              <MapPinIcon className="h-4 w-4 text-purple-600" />
                              {member.placeOfPractice}
                            </p>
                          </div>

                          <Link href={`/our-team/${member.id}`}>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                              View Profile
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!president && members.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No team members found.</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
