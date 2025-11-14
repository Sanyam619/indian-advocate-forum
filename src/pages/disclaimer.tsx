import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { AlertTriangle, Scale, FileText, Shield, Users, Phone } from 'lucide-react';

export default function Disclaimer() {
  return (
    <Layout>
      <Head>
        <title>Legal Disclaimer - Indian Advocate Forum</title>
        <meta name="description" content="Legal disclaimer for Indian Advocate Forum - Important information about our services and limitations." />
      </Head>

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-t-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Legal Disclaimer</h1>
            </div>
            <p className="text-orange-100 text-lg">
              Important legal information about the use of Indian Advocate Forum platform.
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Important Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-red-900 font-bold text-lg mb-2">IMPORTANT NOTICE</h2>
                  <p className="text-red-800 leading-relaxed">
                    This platform is a technology service that facilitates connections between legal professionals 
                    and clients. We do not provide legal advice, legal services, or practice law. All legal advice 
                    and services are provided solely by individual advocates through this platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Nature */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-orange-600" />
                Nature of Platform Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-blue-900 font-medium mb-3">What We Provide</h3>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• Technology platform for connections</li>
                    <li>• Directory of verified advocates</li>
                    <li>• Communication tools and features</li>
                    <li>• Legal news and educational content</li>
                    <li>• Video conferencing capabilities</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-red-900 font-medium mb-3">What We Do NOT Provide</h3>
                  <ul className="text-red-800 text-sm space-y-2">
                    <li>• Legal advice or counsel</li>
                    <li>• Attorney-client relationships</li>
                    <li>• Legal representation</li>
                    <li>• Case outcomes or guarantees</li>
                    <li>• Professional legal opinions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* No Attorney-Client Relationship */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-orange-600" />
                No Attorney-Client Relationship
              </h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                <div className="space-y-4 text-yellow-900">
                  <p className="font-medium">
                    Using this platform does not create an attorney-client relationship between you and:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Indian Advocate Forum (the platform)</li>
                    <li>• Platform operators or administrators</li>
                    <li>• Any advocate until formal engagement</li>
                  </ul>
                  <p className="text-sm text-yellow-800">
                    Attorney-client relationships are established only through direct agreement between 
                    clients and individual advocates, independent of this platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Information Accuracy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-orange-600" />
                Information Accuracy and Currency
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Information vs. Legal Advice</h3>
                  <p className="text-gray-700">
                    Our platform may contain general legal information for educational purposes. 
                    This information is not intended as legal advice and should not be relied upon 
                    as such. Always consult with a qualified advocate for specific legal advice.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content Accuracy</h3>
                  <p className="text-gray-700">
                    While we strive to provide accurate and up-to-date information, we make no 
                    warranties about the completeness, reliability, or accuracy of the information. 
                    Laws and regulations change frequently, and information may become outdated.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User-Generated Content</h3>
                  <p className="text-gray-700">
                    Content created by users, including advocate profiles and discussions, 
                    represents the views and opinions of individual users and not the platform. 
                    We do not endorse or verify user-generated content.
                  </p>
                </div>
              </div>
            </section>

            {/* Professional Verification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-orange-600" />
                Professional Verification and Credentials
              </h2>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-purple-900 font-medium mb-2">Verification Process</h3>
                    <p className="text-purple-800 text-sm mb-3">
                      We attempt to verify advocate credentials through Bar Council records and other 
                      available sources. However, we cannot guarantee the accuracy or currency of all information.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Our Verification Includes</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Bar registration number validation</li>
                        <li>• Professional credential checks</li>
                        <li>• Identity verification</li>
                        <li>• Document authentication</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-medium text-orange-900 mb-2">Client Responsibility</h4>
                      <ul className="text-orange-800 text-sm space-y-1">
                        <li>• Verify advocate credentials independently</li>
                        <li>• Check current Bar Council status</li>
                        <li>• Confirm specialization and experience</li>
                        <li>• Make informed decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">!</div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Platform Limitations</h3>
                      <p className="text-gray-700 text-sm">
                        Indian Advocate Forum is not liable for any direct, indirect, incidental, 
                        special, or consequential damages arising from the use of this platform or 
                        interactions with advocates found through this platform.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">We Are Not Responsible For:</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Quality of legal services provided by advocates</li>
                        <li>• Outcomes of legal cases or matters</li>
                        <li>• Professional conduct of individual advocates</li>
                        <li>• Disputes between clients and advocates</li>
                        <li>• Accuracy of user-provided information</li>
                        <li>• Platform downtime or technical issues</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">User Responsibilities:</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Exercise due diligence in selecting advocates</li>
                        <li>• Verify credentials and qualifications</li>
                        <li>• Understand scope and terms of engagement</li>
                        <li>• Maintain confidentiality of sensitive information</li>
                        <li>• Report any platform abuse or violations</li>
                        <li>• Use platform services responsibly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Jurisdiction and Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jurisdiction and Governing Law</h2>
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="space-y-3 text-indigo-900">
                  <p>
                    <strong>Governing Law:</strong> This disclaimer and all platform-related matters 
                    are governed by the laws of India.
                  </p>
                  <p>
                    <strong>Jurisdiction:</strong> Courts in New Delhi, India have exclusive jurisdiction 
                    over any disputes arising from platform use.
                  </p>
                  <p className="text-indigo-800 text-sm">
                    Legal services provided by individual advocates are governed by their respective 
                    professional regulations and jurisdictional rules.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Disclaimer</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-900 mb-3">
                  We reserve the right to modify this disclaimer at any time. Changes will be effective 
                  immediately upon posting on the platform.
                </p>
                <p className="text-yellow-800 text-sm">
                  Users are responsible for reviewing this disclaimer periodically. Continued use of 
                  the platform constitutes acceptance of any changes.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-orange-600" />
                Questions or Concerns
              </h2>
              <div className="bg-orange-50 rounded-lg p-6">
                <p className="text-orange-900 mb-4">
                  If you have questions about this disclaimer or need clarification about our services:
                </p>
                <div className="space-y-2 text-orange-800">
                  <p><strong>Email:</strong> legal@indianadvocateforum.com</p>
                  <p><strong>Phone:</strong> +91 12345-67890</p>
                  <p><strong>Address:</strong> Legal District, New Delhi, Delhi 110001</p>
                </div>
                <p className="text-orange-700 text-sm mt-4">
                  <strong>Last Updated:</strong> October 14, 2025
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}