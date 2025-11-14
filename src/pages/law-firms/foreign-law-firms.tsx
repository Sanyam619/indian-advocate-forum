import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

const ForeignLawFirms: React.FC = () => {
  return (
    <Layout title="Foreign Law Firms | Indian Advocate Forum">
      <Head>
        <title>Foreign Law Firms | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Information about foreign law firms operating in India, international legal services, and cross-border legal practices." 
        />
        <meta name="keywords" content="foreign law firms, international law, cross-border legal services, global law firms, India" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L9.9 15.9c.69-.1 1.27-.5 1.66-1.08L10 13.5l1.5-1.5c.38-.38.59-.89.59-1.41V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V10c0 .28-.22.5-.5.5s-.5-.22-.5-.5V8.5c0-.28-.22-.5-.5-.5S9.5 8.22 9.5 8.5v1c0 .28-.22.5-.5.5s-.5-.22-.5-.5V8.5c0-.28-.22-.5-.5-.5S7.5 8.22 7.5 8.5V12c0 .28-.22.5-.5.5s-.5-.22-.5-.5V8.5c0-.28-.22-.5-.5-.5S5.5 8.22 5.5 8.5V12z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                🌐 Foreign Law Firms
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Global legal expertise and international law firm presence in India
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
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  We're developing a comprehensive directory of foreign law firms operating in India. 
                  This section will feature:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="bg-blue-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Global Law Firms</h3>
                  <p className="text-blue-700 text-sm">Major international law firms with Indian presence</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="bg-green-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Practice Areas</h3>
                  <p className="text-green-700 text-sm">Specialized international legal services and expertise</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="bg-purple-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Regulatory Updates</h3>
                  <p className="text-purple-700 text-sm">Latest regulations affecting foreign law firms in India</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="bg-orange-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Office Locations</h3>
                  <p className="text-orange-700 text-sm">Indian offices and representative offices</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="bg-red-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Market Insights</h3>
                  <p className="text-red-700 text-sm">Analysis of foreign firm market presence and trends</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                  <div className="bg-teal-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">Partnerships</h3>
                  <p className="text-teal-700 text-sm">Strategic alliances with Indian law firms</p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium mb-1">
                      🔒 Regulatory Framework
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Please note that foreign law firms in India must comply with specific regulatory requirements. 
                      This section will provide updated information on licensing, permitted practice areas, and compliance requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                <p className="text-indigo-800 font-medium mb-2">
                  📧 Stay Updated
                </p>
                <p className="text-indigo-600 text-sm">
                  This comprehensive directory is under development and will include profiles of major global law firms, 
                  their Indian operations, practice specializations, and regulatory compliance information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};



export default ForeignLawFirms;