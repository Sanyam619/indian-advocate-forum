import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { UserIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AddJudgePage: React.FC = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [targetCategory, setTargetCategory] = useState('currentJudges');
  
  // Check if we're in edit mode
  const isEditMode = !!router.query.id;
  const judgeId = router.query.id as string;

  // Fetch judge data if in edit mode
  useEffect(() => {
    if (isEditMode && judgeId) {
      const fetchJudge = async () => {
        setFetchingData(true);
        try {
          const response = await fetch(`/api/judges/${judgeId}`);
          const result = await response.json();
          
          if (result.success && result.judge) {
            setJsonInput(JSON.stringify(result.judge, null, 2));
            // Try to determine category from judge data (optional)
            // You might need to add logic here based on how categories are stored
          } else {
            toast.error('Failed to load judge data');
          }
        } catch (error) {
          console.error('Error fetching judge:', error);
          toast.error('Error loading judge data');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchJudge();
    }
  }, [isEditMode, judgeId]);

  // Sample JSON for reference
  const sampleJson = {
    "id": "justice-sample-judge",
    "name": "Justice Sample Judge",
    "fullName": "Sample Judge Full Name", 
    "position": "Judge, Supreme Court of India",
    "image": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/judge-photo.jpg",
    "dateOfBirth": "1965-01-15",
    "appointmentDate": "2020-03-10",
    "retirementDate": "2030-01-14",
    "education": [
      "LL.B. from National Law School of India University (1987)",
      "LL.M. from Harvard Law School (1989)"
    ],
    "careerHighlights": [
      "Judge of High Court (2010-2020)",
      "Judge of Supreme Court (2020-present)"
    ],
    "biography": "A distinguished jurist known for expertise in constitutional law...",
    "notableJudgments": [
      "Landmark Privacy Case 2021",
      "Constitutional Bench Decision 2022"
    ],
    "specializations": ["Constitutional Law", "Civil Rights", "Administrative Law"]
  };

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
    router.push('/auth');
    return null;
  }

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Check required fields
      const requiredFields = ['id', 'name', 'fullName', 'position', 'image'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate Cloudinary URL
      if (!parsed.image.includes('cloudinary.com') && !parsed.image.includes('res.cloudinary.com')) {
        throw new Error('Image must be a valid Cloudinary URL');
      }

      return { isValid: true, data: parsed };
    } catch (error) {
      return { isValid: false, error: (error as Error).message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jsonInput.trim()) {
      toast.error('Please enter judge data in JSON format');
      return;
    }

    const validation = validateJson(jsonInput);
    if (!validation.isValid) {
      toast.error(`Invalid JSON: ${validation.error}`);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEditMode ? '/api/admin/edit-judge' : '/api/judges/add';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const body = isEditMode 
        ? { judgeId, ...validation.data }
        : { judgeData: validation.data, targetCategory };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEditMode ? 'Judge updated successfully!' : 'Judge added successfully!');
        if (!isEditMode) {
          setJsonInput('');
        }
        // Redirect to admin panel or judges page
        setTimeout(() => {
          router.push('/admin-panel');
        }, 1500);
      } else {
        toast.error(result.message || `Failed to ${isEditMode ? 'update' : 'add'} judge`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} judge:`, error);
      toast.error(`Error ${isEditMode ? 'updating' : 'adding'} judge`);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = () => {
    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <>
      <Head>
        <title>Add Judge - Admin Panel</title>
        <meta name="description" content="Add new judge to the Indian Advocate Forum" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <UserIcon className="h-8 w-8 mr-3 text-purple-600" />
                {isEditMode ? 'Edit Judge' : 'Add New Judge'}
              </h1>
              <p className="text-gray-600 mb-2">
                Official admin interface for adding judges to the Indian Advocate Forum
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium">
                  🔒 <strong>Secure Method:</strong> This is the only authorized way to add judges. 
                  Manual JSON file editing is disabled for security and data integrity.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                📋 How to Add a Judge:
              </h3>
              <ol className="text-blue-800 text-sm space-y-2">
                <li>1. Upload judge photo to your Cloudinary dashboard</li>
                <li>2. Copy the Cloudinary image URL</li>
                <li>3. Fill in the JSON template below with judge details</li>
                <li>4. Select the appropriate category (Current/Former Judge/Chief Justice)</li>
                <li>5. Submit - the judge will appear immediately on the website</li>
              </ol>
              <div className="mt-3 p-2 bg-blue-100 rounded">
                <p className="text-blue-900 text-xs font-medium">
                  ✨ <strong>Auto-Backup:</strong> System automatically creates backups before each change
                </p>
              </div>
            </div>

            {/* Required Fields Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-900 mb-2">Required Fields:</h4>
              <div className="text-yellow-800 text-sm grid grid-cols-2 gap-2">
                <span>• <code>id</code> (unique identifier)</span>
                <span>• <code>name</code> (display name)</span>
                <span>• <code>fullName</code> (complete name)</span>
                <span>• <code>position</code> (official position)</span>
                <span>• <code>image</code> (Cloudinary URL)</span>
              </div>
              <p className="text-yellow-700 text-xs mt-2">
                Optional fields will be set to defaults if not provided
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              
              {/* Category Selection */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Judge Category *
                </label>
                <select
                  id="category"
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="currentJudges">Current Supreme Court Judge</option>
                  <option value="currentChiefJustice">Current Chief Justice of India</option>
                  <option value="formerJudges">Former Supreme Court Judge</option>
                  <option value="formerChiefJustices">Former Chief Justice of India</option>
                </select>
              </div>

              {/* JSON Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700">
                    Judge Data (JSON Format) *
                  </label>
                  <button
                    type="button"
                    onClick={handleSampleLoad}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Load Sample JSON
                  </button>
                </div>
                <textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`Paste your JSON here, e.g.:\n${JSON.stringify(sampleJson, null, 2)}`}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/judges/current')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || fetchingData}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    loading || fetchingData
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } transition-colors duration-200`}
                >
                  {fetchingData ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </span>
                  ) : loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    isEditMode ? 'Update Judge' : 'Add Judge'
                  )}
                </button>
              </div>
            </form>

            {/* Sample JSON Reference */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Sample JSON Structure:</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(sampleJson, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddJudgePage;