import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import PodcastList from '@/components/PodcastList';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Legal Discussion', label: 'Legal Discussion' },
  { value: 'Case Analysis', label: 'Case Analysis' },
  { value: 'Supreme Court Updates', label: 'Supreme Court Updates' },
  { value: 'High Court News', label: 'High Court News' },
  { value: 'Legal Education', label: 'Legal Education' },
  { value: 'Constitutional Law', label: 'Constitutional Law' },
  { value: 'Criminal Law', label: 'Criminal Law' },
  { value: 'Civil Law', label: 'Civil Law' },
  { value: 'Corporate Law', label: 'Corporate Law' },
  { value: 'Legal Tips', label: 'Legal Tips' },
];

const PodcastsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Head>
        <title>Legal Video Podcasts - Indian Advocate Forum</title>
        <meta 
          name="description" 
          content="Watch legal video podcasts covering Supreme Court updates, case analysis, legal education and more from Indian Advocate Forum." 
        />
        <meta name="keywords" content="legal podcasts, law videos, Supreme Court, legal education, Indian law" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Legal Video Podcasts
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest legal discussions, case analyses, and educational content 
                from legal experts and advocates.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search podcasts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="sm:w-64">
                  <div className="relative">
                    <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.slice(1).map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Podcasts List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'All Podcasts' : selectedCategory}
                </h2>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View All
                  </button>
                )}
              </div>
              
              <PodcastList category={selectedCategory} />
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default PodcastsPage;