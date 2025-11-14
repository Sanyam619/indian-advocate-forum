import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

const LawFirmArticles: React.FC = () => {
  return (
    <Layout title="Law Firm Articles | Indian Advocate Forum">
      <Head>
        <title>Law Firm Articles | Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Legal articles, insights, and thought leadership pieces from leading law firms in India. Expert analysis on legal developments and industry trends." 
        />
        <meta name="keywords" content="law firm articles, legal insights, thought leadership, legal analysis, Indian law firms, legal updates" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                📝 Law Firm Articles
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
                Expert insights, thought leadership & legal analysis from India's top law firms
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
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  We're curating a comprehensive collection of legal articles and thought leadership pieces from India's leading law firms. 
                  This section will feature:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="bg-blue-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Legal Updates</h3>
                  <p className="text-blue-700 text-sm">Analysis of recent legal developments and regulatory changes</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="bg-green-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Market Trends</h3>
                  <p className="text-green-700 text-sm">Industry insights and market analysis from legal experts</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="bg-purple-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-2">Case Studies</h3>
                  <p className="text-purple-700 text-sm">Real-world examples and practical legal solutions</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <div className="bg-orange-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-2">Practice Insights</h3>
                  <p className="text-orange-700 text-sm">Deep dives into specific practice areas and specializations</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="bg-red-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Expert Opinions</h3>
                  <p className="text-red-700 text-sm">Commentary and perspectives from senior partners</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                  <div className="bg-teal-600 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-teal-900 mb-2">Sectoral Analysis</h3>
                  <p className="text-teal-700 text-sm">Industry-specific legal developments and compliance guides</p>
                </div>
              </div>

              {/* Content Categories */}
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                    </svg>
                    Featured Content Types
                  </h3>
                  <ul className="space-y-2 text-indigo-700">
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Regulatory & Compliance Updates
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Corporate Law Developments
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      Technology & Data Privacy
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      ESG & Sustainability
                    </li>
                    <li className="flex items-center">
                      <span className="text-indigo-500 mr-2">•</span>
                      International Trade & Investment
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Author Contributions
                  </h3>
                  <ul className="space-y-2 text-emerald-700">
                    <li className="flex items-center">
                      <span className="text-emerald-500 mr-2">•</span>
                      Senior Partners & Associates
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-500 mr-2">•</span>
                      Practice Group Leaders
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-500 mr-2">•</span>
                      Subject Matter Experts
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-500 mr-2">•</span>
                      Guest Contributors
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-500 mr-2">•</span>
                      International Collaborators
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <p className="text-emerald-800 font-medium mb-2">
                  📚 Comprehensive Legal Library
                </p>
                <p className="text-emerald-600 text-sm">
                  This platform will host a curated collection of legal articles, white papers, and thought leadership pieces 
                  from India's most prominent law firms, providing valuable insights for legal professionals and businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};



export default LawFirmArticles;