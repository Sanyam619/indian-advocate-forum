import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react';

export default function TermsOfService() {
  return (
    <Layout>
      <Head>
        <title>Terms of Service - Indian Advocate Forum</title>
        <meta name="description" content="Terms of Service for Indian Advocate Forum - Legal terms and conditions for using our platform." />
      </Head>

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Legal terms and conditions governing your use of Indian Advocate Forum platform.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Last Updated */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Last Updated:</strong> October 14, 2025 | <strong>Effective Date:</strong> October 14, 2025
              </p>
            </div>

            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-blue-600" />
                Acceptance of Terms
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <p className="text-blue-900 leading-relaxed">
                  By accessing and using Indian Advocate Forum ("the Platform", "we", "us", "our"), 
                  you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            {/* Platform Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Gavel className="w-6 h-6 mr-2 text-blue-600" />
                Platform Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Indian Advocate Forum is a professional platform that:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">For Clients</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Connect with verified advocates</li>
                    <li>• Search lawyers by location and specialty</li>
                    <li>• Access legal news and resources</li>
                    <li>• Schedule video consultations</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">For Advocates</h3>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• Create professional profiles</li>
                    <li>• Connect with potential clients</li>
                    <li>• Share expertise through content</li>
                    <li>• Conduct online consultations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                User Accounts & Registration
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Requirements</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• You must be at least 18 years old</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Maintain the security of your account</li>
                    <li>• Promptly update any changes to your information</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advocate Verification</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Valid Bar Council registration required</li>
                    <li>• Verification of professional credentials</li>
                    <li>• Compliance with legal practice standards</li>
                    <li>• Regular review of active status</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Termination</h3>
                  <p className="text-gray-700">
                    We reserve the right to suspend or terminate accounts that violate these terms, 
                    engage in fraudulent activities, or compromise platform integrity.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Acceptable Use Policy
              </h2>
              
              <div className="grid gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-green-900 font-medium mb-3 flex items-center">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm mr-2">✓</span>
                    Permitted Activities
                  </h3>
                  <ul className="text-green-800 space-y-1 text-sm">
                    <li>• Professional networking and collaboration</li>
                    <li>• Sharing legal knowledge and insights</li>
                    <li>• Conducting legitimate business activities</li>
                    <li>• Accessing educational resources</li>
                    <li>• Participating in professional discussions</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-red-900 font-medium mb-3 flex items-center">
                    <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm mr-2">✗</span>
                    Prohibited Activities
                  </h3>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• Impersonating other individuals or entities</li>
                    <li>• Sharing false or misleading information</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Harassing or threatening other users</li>
                    <li>• Attempting to breach platform security</li>
                    <li>• Using the platform for illegal activities</li>
                    <li>• Spamming or unsolicited communications</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Professional Responsibility */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Responsibility</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-900 font-medium mb-2">Important Legal Notice</h3>
                    <p className="text-yellow-800 text-sm leading-relaxed">
                      This platform facilitates connections between advocates and clients but does not provide legal advice. 
                      Any legal advice or services are provided directly by individual advocates, not by the platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">For Advocates</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Maintain professional ethical standards</li>
                    <li>• Comply with Bar Council regulations</li>
                    <li>• Protect client confidentiality</li>
                    <li>• Provide competent representation</li>
                    <li>• Avoid conflicts of interest</li>
                  </ul>
                </div>

                <div className="border-l-4 border-emerald-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">For Clients</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Provide accurate information to advocates</li>
                    <li>• Respect professional boundaries</li>
                    <li>• Understand the scope of services</li>
                    <li>• Make informed decisions about representation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-purple-900 mb-4">
                  Your privacy is important to us. Our data practices are governed by our Privacy Policy, 
                  which is incorporated into these Terms by reference.
                </p>
                <div className="space-y-2 text-purple-800 text-sm">
                  <p>• We collect only necessary information for platform functionality</p>
                  <p>• Your data is protected with industry-standard security measures</p>
                  <p>• You retain control over your personal information</p>
                  <p>• We comply with applicable data protection laws</p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Platform Content</h3>
                  <p className="text-blue-800 text-sm">
                    All platform content, features, and functionality are owned by Indian Advocate Forum 
                    and protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">User Content</h3>
                  <p className="text-green-800 text-sm">
                    Users retain ownership of content they create but grant us a license to use, 
                    modify, and display such content for platform operations and improvement.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-4 text-gray-700 text-sm">
                  <p>
                    <strong>Platform Service:</strong> Indian Advocate Forum provides a platform for connection 
                    and communication. We do not provide legal services or advice.
                  </p>
                  <p>
                    <strong>No Warranties:</strong> The platform is provided "as is" without warranties of any kind, 
                    either express or implied.
                  </p>
                  <p>
                    <strong>Limitation:</strong> Our liability is limited to the maximum extent permitted by law. 
                    We are not liable for indirect, incidental, or consequential damages.
                  </p>
                  <p>
                    <strong>User Responsibility:</strong> Users are responsible for their interactions and 
                    decisions made through the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <div className="bg-indigo-50 rounded-lg p-6">
                <p className="text-indigo-900 mb-2">
                  These Terms of Service are governed by the laws of India.
                </p>
                <p className="text-indigo-800 text-sm">
                  Any disputes arising from these terms will be subject to the exclusive jurisdiction 
                  of the courts in New Delhi, India.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-blue-900 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-blue-800">
                  <p><strong>Email:</strong> legal@indianadvocateforum.com</p>
                  <p><strong>Phone:</strong> +91 12345-67890</p>
                  <p><strong>Address:</strong> Legal District, New Delhi, Delhi 110001</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}