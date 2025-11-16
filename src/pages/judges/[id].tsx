import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { Judge } from '../../types/judges';
import prisma from '../../lib/prisma';
import { CalendarDays, Scale, GraduationCap, Award, BookOpen, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JudgeProfileProps {
  judge: Judge;
}

export default function JudgeProfile({ judge }: JudgeProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateTenure = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  const getBackUrl = () => {
    if (judge.status === 'current') {
      return '/judges/current';
    } else if (judge.type === 'chief-justice') {
      return '/judges/former-chief-justices';
    } else {
      return '/judges/former-judges';
    }
  };

  return (
    <Layout>
      <Head>
        <title>{judge.name} - Profile | Indian Advocate Forum</title>
        <meta name="description" content={`Learn about ${judge.name}, ${judge.position}. ${judge.biography.substring(0, 160)}...`} />
        <meta name="keywords" content={`${judge.name}, Supreme Court, Chief Justice, Judge, Indian judiciary, ${judge.specializations.join(', ')}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href={getBackUrl()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {judge.status === 'current' ? 'Current Judges' : judge.type === 'chief-justice' ? 'Former Chief Justices' : 'Former Judges'}
            </Link>
          </div>

          {/* Main Profile Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            
            {/* Header */}
            <div className={`bg-gradient-to-r p-8 ${
              judge.type === 'chief-justice' 
                ? 'from-amber-50 to-yellow-50 border-b border-amber-200' 
                : 'from-purple-50 to-blue-50 border-b border-purple-200'
            }`}>
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-80 rounded-xl overflow-hidden bg-gray-200 mx-auto lg:mx-0 shadow-lg">
                    <Image
                      src={judge.photoUrl || judge.image || '/images/placeholder-judge.jpg'}
                      alt={judge.name}
                      width={256}
                      height={320}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-judge.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {judge.name}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
                      {judge.designation || judge.position}
                    </h2>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      judge.status === 'current' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {judge.status === 'current' ? 'Currently Serving' : 'Retired'}
                    </div>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CalendarDays className={`w-5 h-5 ${judge.type === 'chief-justice' ? 'text-amber-600' : 'text-purple-600'}`} />
                        <div>
                          <div className="font-semibold text-gray-900">Date of Birth</div>
                          <div className="text-gray-600">{formatDate(judge.dateOfBirth)} (Age: {calculateAge(judge.dateOfBirth)})</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Scale className={`w-5 h-5 ${judge.type === 'chief-justice' ? 'text-amber-600' : 'text-purple-600'}`} />
                        <div>
                          <div className="font-semibold text-gray-900">Appointment Date</div>
                          <div className="text-gray-600">{formatDate(judge.appointmentDate)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className={`w-5 h-5 ${judge.type === 'chief-justice' ? 'text-amber-600' : 'text-purple-600'}`} />
                        <div>
                          <div className="font-semibold text-gray-900">Retirement Date</div>
                          <div className="text-gray-600">{formatDate(judge.retirementDate)}</div>
                        </div>
                      </div>

                      {judge.termOfOffice && (
                        <div className="flex items-center space-x-3">
                          <Award className={`w-5 h-5 ${judge.type === 'chief-justice' ? 'text-amber-600' : 'text-purple-600'}`} />
                          <div>
                            <div className="font-semibold text-gray-900">Tenure as {judge.type === 'chief-justice' ? 'CJI' : 'Judge'}</div>
                            <div className="text-gray-600">
                              {calculateTenure(judge.termOfOffice.start, judge.termOfOffice.end)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {judge.biography || 'Biography information not available.'}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Education & Career */}
            <div className="space-y-8">
              
              {/* Education */}
              {judge.education && judge.education.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  </div>
                  <ul className="space-y-3">
                    {judge.education.map((edu, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Career Highlights */}
              {judge.careerHighlights && judge.careerHighlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Award className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Career Highlights</h3>
                  </div>
                  <ul className="space-y-3">
                    {judge.careerHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Notable Judgments */}
            <div className="space-y-8">
              
              {/* Notable Judgments */}
              {judge.notableJudgments && judge.notableJudgments.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Scale className="w-6 h-6 text-amber-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Notable Judgments</h3>
                  </div>
                  <ul className="space-y-3">
                    {judge.notableJudgments.map((judgment, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">{judgment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const judgeId = params?.id as string;

  try {
    // Fetch the specific judge from MongoDB
    const judge = await prisma.judge.findUnique({
      where: { id: judgeId },
    });

    if (!judge) {
      return {
        notFound: true,
      };
    }

    // Map MongoDB judge to expected Judge type
    const formattedJudge = {
      id: judge.id,
      name: judge.name,
      fullName: judge.fullName,
      position: judge.designation,
      designation: judge.designation,
      type: judge.type,
      status: judge.status,
      dateOfBirth: judge.dateOfBirth || '',
      appointmentDate: judge.appointmentDate || '',
      retirementDate: judge.retirementDate || '',
      image: judge.photoUrl || '',
      photoUrl: judge.photoUrl || '',
      education: judge.education || [],
      careerHighlights: judge.careerHighlights || [],
      biography: judge.biography || '',
      notableJudgments: judge.notableJudgments || [],
      specializations: judge.specializations || [],
    };

    return {
      props: {
        judge: formattedJudge,
      },
    };
  } catch (error) {
    console.error('Error fetching judge:', error);
    return {
      notFound: true,
    };
  }
};