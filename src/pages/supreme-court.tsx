import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { 
  ScaleIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout'

export default function SupremeCourt() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'constitutional', name: 'Constitutional Law' },
    { id: 'criminal', name: 'Criminal Law' },
    { id: 'civil', name: 'Civil Rights' },
    { id: 'corporate', name: 'Corporate Law' },
    { id: 'family', name: 'Family Law' },
    { id: 'environmental', name: 'Environmental Law' }
  ]

  const recentJudgments = [
    {
      id: 1,
      title: 'Privacy Rights in Digital Age - Landmark Judgment',
      bench: 'Chief Justice D.Y. Chandrachud, Justice P.S. Narasimha',
      date: '2024-03-15',
      category: 'Constitutional Law',
      summary: 'Supreme Court establishes comprehensive guidelines for digital privacy rights and data protection...',
      caseNumber: 'W.P.(C) 494/2012',
      status: 'Final Order'
    },
    {
      id: 2,
      title: 'Environmental Protection vs. Development Rights',
      bench: 'Justice B.R. Gavai, Justice Sandeep Mehta',
      date: '2024-03-12',
      category: 'Environmental Law',
      summary: 'Court balances environmental conservation with developmental needs in mining case...',
      caseNumber: 'Civil Appeal No. 2847/2023',
      status: 'Reserved for Judgment'
    },
    {
      id: 3,
      title: 'Women\'s Safety and Workplace Harassment',
      bench: 'Justice Hima Kohli, Justice B.V. Nagarathna',
      date: '2024-03-10',
      category: 'Civil Rights',
      summary: 'Strengthening workplace harassment laws and implementation guidelines...',
      caseNumber: 'Criminal Appeal No. 156/2024',
      status: 'Final Order'
    }
  ]

  const upcomingHearings = [
    {
      id: 1,
      title: 'Electoral Bonds Case - Final Arguments',
      date: '2024-03-20',
      time: '10:30 AM',
      bench: 'Constitution Bench (5 Judges)',
      caseNumber: 'W.P.(C) 880/2017'
    },
    {
      id: 2,
      title: 'Same-Sex Marriage Recognition',
      date: '2024-03-22',
      time: '2:00 PM',
      bench: 'Chief Justice + 4 Judges',
      caseNumber: 'W.P.(C) 1011/2022'
    },
    {
      id: 3,
      title: 'Article 370 - Constitutional Validity',
      date: '2024-03-25',
      time: '10:30 AM',
      bench: 'Constitution Bench (5 Judges)',
      caseNumber: 'W.P.(C) 682/2019'
    }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <Layout>
      <Head>
        <title>Supreme Court - Indian Advocate Forum</title>
        <meta name="description" content="Latest Supreme Court judgments, orders, and legal updates" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Supreme Court of India
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Established:</span> 1950
                </div>
                <div>
                  <span className="font-semibold">Jurisdiction:</span> Entire India
                </div>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">
                The Supreme Court of India, established on January 26, 1950, is the highest judicial authority in the country. 
                As the apex court, it serves as the guardian of the Constitution, ensuring justice, liberty, equality, and fraternity. 
                The Court has the power of judicial review and is the final interpreter of the Constitution.
              </p>
            </div>
          </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search judgments, case numbers, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Judgments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Judgments & Orders</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentJudgments.map((judgment) => (
                  <div key={judgment.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                        {judgment.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        judgment.status === 'Final Order' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {judgment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        <span>{judgment.caseNumber}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span>{new Date(judgment.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Bench:</strong> {judgment.bench}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{judgment.summary}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {judgment.category}
                      </span>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        Read Full Judgment →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <button className="w-full py-2 px-4 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 font-medium">
                  View All Judgments
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Hearings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Hearings</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {upcomingHearings.map((hearing) => (
                  <div key={hearing.id} className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{hearing.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span>{new Date(hearing.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{hearing.time}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div>{hearing.bench}</div>
                        <div>{hearing.caseNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-200">
                <button className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View Full Calendar →
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              </div>
              
              <div className="p-4 space-y-2">
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Case Status Search
                </a>
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Daily Orders
                </a>
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Constitution Bench Matters
                </a>
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Live Streaming
                </a>
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Court Calendar
                </a>
                <a href="#" className="block text-purple-600 hover:text-purple-700 text-sm">
                  • Rules & Procedures
                </a>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Court Statistics</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Cases</span>
                  <span className="font-medium">70,152</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cases This Month</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Judgments Delivered</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Constitution Bench</span>
                  <span className="font-medium">12 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  )
}