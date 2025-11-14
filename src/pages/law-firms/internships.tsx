import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

const LawFirmInternships: React.FC = () => {
  return (
    <Layout title="Law Firm Internships | Indian Advocate Forum">
      <Head>
        <title>Law Firm Internships | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Internship opportunities at leading law firms in India. Find legal internships, summer programs, and career opportunities for law students and fresh graduates." 
        />
        <meta name="keywords" content="law firm internships, legal internships, summer programs, law student opportunities, legal careers, India" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                🎓 Legal Internships
              </h1>
              <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
                Career opportunities & internship programs at India's top law firms
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Coming Soon Section */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg className="h-12 w-12 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  We're creating a comprehensive platform to connect law students with internship opportunities at India's premier law firms. 
                  This section will feature:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="bg-blue-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Summer Internships</h3>
                  <p className="text-blue-700 text-sm">Summer vacation programs for law students</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="bg-green-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Winter Internships</h3>
                  <p className="text-green-700 text-sm">Winter break internship opportunities</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="bg-purple-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Research Positions</h3>
                  <p className="text-purple-700 text-sm">Legal research and writing opportunities</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="bg-orange-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Fast Track Programs</h3>
                  <p className="text-orange-700 text-sm">Intensive training and mentorship programs</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="bg-red-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Graduate Trainee</h3>
                  <p className="text-red-700 text-sm">Entry-level positions for fresh graduates</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                  <div className="bg-teal-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">Virtual Internships</h3>
                  <p className="text-teal-700 text-sm">Remote work opportunities and online mentorship</p>
                </div>
              </div>

              {/* Application Process */}
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                  <h3 className="text-xl font-bold text-rose-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Application Process
                  </h3>
                  <ul className="space-y-2 text-rose-700">
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">•</span>
                      Online Application Portal
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">•</span>
                      CV and Cover Letter Upload
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">•</span>
                      Academic Transcripts
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">•</span>
                      Writing Sample Submission
                    </li>
                    <li className="flex items-center">
                      <span className="text-rose-500 mr-2">•</span>
                      Interview Process
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Benefits & Compensation
                  </h3>
                  <ul className="space-y-2 text-indigo-700">
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Stipend Information
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Mentorship Programs
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Certificate of Completion
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Networking Opportunities
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Pre-Placement Offers (PPO)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Practice Areas */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Internship Practice Areas</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Corporate Law</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">M&A</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Compliance</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">International Law</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Banking & Finance</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-teal-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Intellectual Property</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-indigo-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Technology Law</h4>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                      <svg className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">Employment Law</h4>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <p className="text-rose-800 font-medium mb-2">
                  🎓 Launch Your Legal Career
                </p>
                <p className="text-rose-600 text-sm">
                  This comprehensive internship portal will connect ambitious law students with prestigious law firms, 
                  providing pathways to successful legal careers through structured internship programs and mentorship opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};



export default LawFirmInternships;