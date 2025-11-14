import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

const DiplomaCertificate: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Diploma/Certificate Courses - Indian Advocate Forum</title>
        <meta name="description" content="Diploma and certificate courses in law" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Diploma/Certificate Courses</h1>
            <p className="text-lg text-gray-600">
              Content will be added soon
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-lg">Coming Soon...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiplomaCertificate;
