import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { UserGroupIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const AddTeamMemberPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { id } = router.query; // For edit mode
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Form state
  const [formData, setFormData] = useState({
    barRegistrationNo: '',
    title: '',
    name: '',
    emailId: '',
    legalTitle: '',
    phoneNo: '',
    yearOfBirth: '',
    placeOfPractice: '',
    address: '',
    enrollment: '',
    webinarPrimaryPreference: '',
    webinarSecondaryPreference: '',
    articleContribution: false,
    references: '',
    profilePhoto: '',
    role: 'Member'
  });

  const roleOptions = [
    'President',
    'Director General',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Member'
  ];

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Fetch team member data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchTeamMember = async () => {
        setFetchingData(true);
        try {
          const response = await fetch(`/api/team-members/${id}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            setFormData({
              barRegistrationNo: result.data.barRegistrationNo || '',
              title: result.data.title || '',
              name: result.data.name || '',
              emailId: result.data.emailId || '',
              legalTitle: result.data.legalTitle || '',
              phoneNo: result.data.phoneNo || '',
              yearOfBirth: result.data.yearOfBirth || '',
              placeOfPractice: result.data.placeOfPractice || '',
              address: result.data.address || '',
              enrollment: result.data.enrollment || '',
              webinarPrimaryPreference: result.data.webinarPrimaryPreference || '',
              webinarSecondaryPreference: result.data.webinarSecondaryPreference || '',
              articleContribution: result.data.articleContribution || false,
              references: result.data.references || '',
              profilePhoto: result.data.profilePhoto || '',
              role: result.data.role || 'Member'
            });
          } else {
            showMessage('Failed to load team member data', 'error');
          }
        } catch (error) {
          console.error('Error fetching team member:', error);
          showMessage('Error loading team member data', 'error');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchTeamMember();
    }
  }, [isEditMode, id]);

  // Show loading while checking authentication
  if (isLoading || fetchingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if not logged in
  if (!user) {
    router.push('/auth');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.emailId) {
      showMessage('Please fill in required fields: Name and Email', 'error');
      return;
    }

    // Validate Cloudinary URL if provided
    if (formData.profilePhoto && !formData.profilePhoto.includes('cloudinary.com') && !formData.profilePhoto.includes('res.cloudinary.com')) {
      showMessage('Profile photo must be a valid Cloudinary URL', 'error');
      return;
    }

    setLoading(true);
    try {
      const url = isEditMode ? '/api/admin/edit-team-member' : '/api/team-members/add';
      const method = isEditMode ? 'PUT' : 'POST';
      const body = isEditMode 
        ? JSON.stringify({ teamMemberId: id, ...formData })
        : JSON.stringify(formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(`✅ Team member ${isEditMode ? 'updated' : 'added'} successfully!`, 'success');
        // Redirect to admin panel after success
        setTimeout(() => {
          router.push('/admin-panel');
        }, 1500);
      } else {
        showMessage(`❌ ERROR: ${result.error || 'Failed to add team member'}`, 'error');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      showMessage('❌ NETWORK ERROR: Failed to connect to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isEditMode ? 'Edit' : 'Add'} Team Member - Admin Panel</title>
        <meta name="description" content={`${isEditMode ? 'Edit' : 'Add new'} team member to the Indian Advocate Forum`} />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <UserGroupIcon className="h-8 w-8 mr-3 text-red-600" />
                {isEditMode ? 'Edit' : 'Add New'} Team Member
              </h1>
              <p className="text-gray-600">
                {isEditMode ? 'Update' : 'Add'} team members including President, Director General, and other positions
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                {message}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                📋 Instructions:
              </h3>
              <ol className="text-blue-800 text-sm space-y-2">
                <li>1. Fill in the team member's details below</li>
                <li>2. Upload profile photo to Cloudinary and paste the URL</li>
                <li>3. Select the appropriate role (President, Director General, etc.)</li>
                <li>4. The "References" field will be displayed as their position/title on the website</li>
                <li>5. Submit to add the team member immediately</li>
              </ol>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role (Backend Filter) *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Used for backend filtering (e.g., President will be featured)</p>
              </div>

              {/* References (Display Position) */}
              <div>
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-2">
                  References / Position Title
                </label>
                <input
                  type="text"
                  id="references"
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="e.g., President of Indian Advocate Forum"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">This will be displayed as their position on the website</p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Mr., Dr., Adv."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="emailId"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNo"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="barRegistrationNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Bar Registration Number
                  </label>
                  <input
                    type="text"
                    id="barRegistrationNo"
                    name="barRegistrationNo"
                    value={formData.barRegistrationNo}
                    onChange={handleChange}
                    placeholder="e.g., BAR/12345/2020"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="legalTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Title
                  </label>
                  <input
                    type="text"
                    id="legalTitle"
                    name="legalTitle"
                    value={formData.legalTitle}
                    onChange={handleChange}
                    placeholder="e.g., Advocate, Senior Advocate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Birth
                  </label>
                  <input
                    type="text"
                    id="yearOfBirth"
                    name="yearOfBirth"
                    value={formData.yearOfBirth}
                    onChange={handleChange}
                    placeholder="e.g., 1975"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="placeOfPractice" className="block text-sm font-medium text-gray-700 mb-2">
                    Place of Practice
                  </label>
                  <input
                    type="text"
                    id="placeOfPractice"
                    name="placeOfPractice"
                    value={formData.placeOfPractice}
                    onChange={handleChange}
                    placeholder="e.g., Supreme Court of India"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment
                  </label>
                  <input
                    type="text"
                    id="enrollment"
                    name="enrollment"
                    value={formData.enrollment}
                    onChange={handleChange}
                    placeholder="Enrollment details"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="webinarPrimaryPreference" className="block text-sm font-medium text-gray-700 mb-2">
                    Webinar Primary Preference
                  </label>
                  <input
                    type="text"
                    id="webinarPrimaryPreference"
                    name="webinarPrimaryPreference"
                    value={formData.webinarPrimaryPreference}
                    onChange={handleChange}
                    placeholder="Primary webinar preference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="webinarSecondaryPreference" className="block text-sm font-medium text-gray-700 mb-2">
                  Webinar Secondary Preference
                </label>
                <input
                  type="text"
                  id="webinarSecondaryPreference"
                  name="webinarSecondaryPreference"
                  value={formData.webinarSecondaryPreference}
                  onChange={handleChange}
                  placeholder="Secondary webinar preference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Profile Photo */}
              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo (Cloudinary URL)
                </label>
                <input
                  type="url"
                  id="profilePhoto"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload to Cloudinary first, then paste the URL here</p>
              </div>

              {/* Article Contribution */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="articleContribution"
                  name="articleContribution"
                  checked={formData.articleContribution}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="articleContribution" className="ml-2 block text-sm text-gray-700">
                  Article Contribution
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={() => router.push('/admin-panel')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } transition-colors duration-200`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating' : 'Adding'} Team Member...
                    </span>
                  ) : (
                    isEditMode ? 'Update Team Member' : 'Add Team Member'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddTeamMemberPage;
