import React from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PodcastUploadForm from '@/components/PodcastUploadForm';
import { useUserProfile } from '@/hooks/useUserProfile';

const AdminPodcastUploadPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const { profileData } = useUserProfile();
  const router = useRouter();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if not logged in
  if (!user) {
    router.push('/');
    return null;
  }

  // Check if user is admin
  if (profileData && profileData.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Access Denied</h1>
            <p className="text-red-700 mb-4">
              You need administrator privileges to upload podcasts.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Upload Podcast - Admin Panel | Indian Advocate Forum</title>
        <meta name="description" content="Upload new video podcasts to the Indian Advocate Forum" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <PodcastUploadForm />
        </div>
      </Layout>
    </>
  );
};

export default AdminPodcastUploadPage;