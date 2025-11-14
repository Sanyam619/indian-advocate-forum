import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Shield, Eye, Users, Database, Globe, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - Indian Advocate Forum</title>
        <meta name="description" content="Privacy Policy for Indian Advocate Forum - How we collect, use, and protect your personal information." />
      </Head>

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Last Updated */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Last Updated:</strong> October 14, 2025
              </p>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Indian Advocate Forum ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website and use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-purple-600" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Full name and contact information</li>
                    <li>• Email address and phone number</li>
                    <li>• Bar registration number (for advocates)</li>
                    <li>• Professional credentials and experience</li>
                    <li>• Profile photographs</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Pages visited and time spent</li>
                    <li>• Search queries and preferences</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Data</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Messages and correspondence</li>
                    <li>• Video call metadata (not content)</li>
                    <li>• Support requests and feedback</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                How We Use Your Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-medium text-purple-900 mb-3">Service Provision</h3>
                  <ul className="text-purple-800 text-sm space-y-2">
                    <li>• Facilitate advocate-client connections</li>
                    <li>• Enable video consultations</li>
                    <li>• Provide legal news and resources</li>
                    <li>• Maintain user profiles</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-medium text-blue-900 mb-3">Platform Improvement</h3>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve search functionality</li>
                    <li>• Enhance user experience</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-medium text-green-900 mb-3">Communication</h3>
                  <ul className="text-green-800 text-sm space-y-2">
                    <li>• Send important updates</li>
                    <li>• Respond to inquiries</li>
                    <li>• Provide customer support</li>
                    <li>• Share legal news (with consent)</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-medium text-orange-900 mb-3">Legal Compliance</h3>
                  <ul className="text-orange-800 text-sm space-y-2">
                    <li>• Verify advocate credentials</li>
                    <li>• Maintain professional standards</li>
                    <li>• Comply with legal requirements</li>
                    <li>• Prevent fraud and abuse</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-purple-600" />
                Information Sharing
              </h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                <h3 className="text-red-900 font-medium mb-2">We DO NOT sell your personal information</h3>
                <p className="text-red-800 text-sm">
                  Your personal data is never sold to third parties for marketing purposes.
                </p>
              </div>

              <p className="text-gray-700 mb-4">We may share your information only in these circumstances:</p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">With Your Consent:</strong>
                    <span className="text-gray-700"> When you explicitly authorize us to share information</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Service Providers:</strong>
                    <span className="text-gray-700"> With trusted partners who help us operate our platform</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Legal Requirements:</strong>
                    <span className="text-gray-700"> When required by law or to protect rights and safety</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Business Transfers:</strong>
                    <span className="text-gray-700"> In case of merger, acquisition, or asset sale</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-600" />
                Data Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Technical Safeguards</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>SSL encryption for data transmission</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure database storage</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Regular security audits</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Access controls and monitoring</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Operational Safeguards</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Employee training on data protection</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Limited access on need-to-know basis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Incident response procedures</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Regular backup and recovery</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Access & Control</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• View your personal information</li>
                      <li>• Update your profile data</li>
                      <li>• Download your data</li>
                      <li>• Delete your account</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Communication Preferences</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Opt out of marketing emails</li>
                      <li>• Control notification settings</li>
                      <li>• Manage data sharing preferences</li>
                      <li>• Request data portability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-purple-600" />
                Contact Us
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-purple-900 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="space-y-2 text-purple-800">
                  <p><strong>Email:</strong> privacy@indianadvocateforum.com</p>
                  <p><strong>Phone:</strong> +91 12345-67890</p>
                  <p><strong>Address:</strong> Legal District, New Delhi, Delhi 110001</p>
                </div>
                
                <p className="text-purple-700 text-sm mt-4">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}