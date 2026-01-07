import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import { 
  MapPinIcon, 
  ScaleIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Team Member Card Component with 3D Tilt
const TeamMemberCard: React.FC<{ member: any; onViewProfile: (memberId: string) => void }> = ({ member, onViewProfile }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${rotateX !== 0 || rotateY !== 0 ? '-8px' : '0px'})`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
      }}
    >
      <div className="p-6">
        <div className="relative mb-4">
          {member.profilePhoto ? (
            <img
              src={member.profilePhoto}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-purple-100">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
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
          <button 
            onClick={() => onViewProfile(member.id)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

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

interface OurTeamPageProps {}

export default function OurTeamPage({}: OurTeamPageProps) {
  const [president, setPresident] = useState<TeamMember | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const handleViewProfile = (memberId: string) => {
    window.location.href = `/our-team/${memberId}`;
  };

  // Filter members based on city and name search
  const filteredMembers = members.filter(member => {
    const matchesCity = !cityFilter || (member.placeOfPractice && member.placeOfPractice.toLowerCase().includes(cityFilter.toLowerCase()));
    const matchesSearch = member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Meet Our Team
              </h1>
              <p className="text-lg md:text-xl text-purple-50 max-w-3xl mx-auto font-light">
                Dedicated professionals working to connect legal minds across India
              </p>
              <div className="flex items-center justify-center gap-2 mt-5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-20 h-1 bg-gradient-to-r from-white/50 to-transparent rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="w-20 h-1 bg-gradient-to-l from-white/50 to-transparent rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* President Section */}
            {president && (
              <div className="mb-20">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 rounded-full mb-4">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                      President
                    </h2>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                  </div>
                </div>
                
                <div className="relative group">
                  {/* Decorative background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-1 shadow-2xl">
                    <div className="bg-white rounded-3xl p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row items-center gap-10">
                        {/* President Photo */}
                        <div className="flex-shrink-0">
                          <div className="relative group/photo">
                            {/* Decorative ring */}
                            <div className="absolute -inset-3 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl opacity-75 group-hover/photo:opacity-100 transition-opacity duration-300 blur-sm"></div>
                            {president.profilePhoto ? (
                              <img
                                src={president.profilePhoto}
                                alt={president.name}
                                className="relative w-56 h-56 rounded-2xl object-cover border-4 border-white shadow-xl"
                              />
                            ) : (
                              <div className="relative w-56 h-56 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-7xl font-bold border-4 border-white shadow-xl">
                                {president.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* President Info */}
                        <div className="flex-1 text-center lg:text-left">
                          <div className="mb-6">
                            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                              {president.title} {president.name}
                            </h3>
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                              President - Indian Advocate Forum
                            </p>
                            <p className="text-lg text-gray-600 font-medium">
                              {president.legalTitle}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                            <span className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-purple-700 inline-flex items-center gap-2">
                              <ScaleIcon className="h-5 w-5" />
                              {president.barRegistrationNo}
                            </span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-700 inline-flex items-center gap-2">
                              <MapPinIcon className="h-5 w-5" />
                              {president.placeOfPractice}
                            </span>
                          </div>

                          <button 
                            onClick={() => handleViewProfile(president.id)}
                            className="group/btn bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-3"
                          >
                            View Complete Profile
                            <ArrowRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Team Members Section */}
            {members.length > 0 && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team Members</h2>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent rounded-full"></div>
                  </div>
                </div>

                {/* Search Bars - City and Name */}
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City Search */}
                    <div className="relative">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MapPinIcon className="h-5 w-5 text-purple-600" />
                        Search by City
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type city name..."
                          value={cityFilter}
                          onChange={(e) => setCityFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                        />
                        {cityFilter && (
                          <button
                            onClick={() => setCityFilter('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Name Search */}
                    <div className="relative">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MagnifyingGlassIcon className="h-5 w-5 text-purple-600" />
                        Search by Name
                      </label>
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type member name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Search Results Info */}
                  {(cityFilter || searchQuery) && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {filteredMembers.length > 0 ? (
                          <>
                            Found <span className="font-bold text-purple-600">{filteredMembers.length}</span> member{filteredMembers.length !== 1 ? 's' : ''}
                            {cityFilter && <> in cities matching "<span className="font-semibold">{cityFilter}</span>"</>}
                            {searchQuery && <> with name matching "<span className="font-semibold">{searchQuery}</span>"</>}
                          </>
                        ) : (
                          <span className="text-orange-600">No members found with current search</span>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCityFilter('');
                        }}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>

                {filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMembers.map((member) => (
                      <TeamMemberCard 
                        key={member.id} 
                        member={member} 
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                      <MagnifyingGlassIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">No team members found</p>
                    <p className="text-gray-500 text-sm">
                      Try adjusting your search
                    </p>
                  </div>
                )}
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
