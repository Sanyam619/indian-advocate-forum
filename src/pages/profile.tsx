import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { GetServerSideProps } from 'next';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CameraIcon, PhotoIcon, PencilIcon, XMarkIcon, UserCircleIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { useUserProfile } from '../hooks/useUserProfile';

interface UserProfile {
  email: string;
  fullName: string;
  role: string;
  barRegistrationNo?: string;
  yearsOfExperience?: string;
  profilePhoto?: string;
  isProfileSetup: boolean;
  isVerified: boolean;
  city?: string;
  specialization?: string[];
  bio?: string;
  education?: string[];
  languages?: string[];
  officeAddress?: string;
}

interface ProfileProps {
  initialProfile: UserProfile;
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = await getSession(req, res);
    if (!session?.user) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };
    }

    // Import Prisma dynamically to avoid build-time errors
    const prisma = (await import('../lib/prisma')).default;

    try {
      // Add timeout for database operations
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timeout')), 5000);
      });

      const userPromise = prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
      });

      const user = await Promise.race([userPromise, timeoutPromise]) as any;

      // Allow access even if not verified; show prompts on the client instead

      // If user exists in database, return their data
      if (user) {
        return {
          props: {
            initialProfile: {
              email: user.email || session.user.email || '',
              fullName: user.fullName || session.user.name || '',
              role: user.role || 'advocate',
              barRegistrationNo: user.barRegistrationNo || '',
              yearsOfExperience: user.yearsOfExperience || '',
              profilePhoto: user.profilePhoto || session.user.picture || '',
              isProfileSetup: user.isProfileSetup || false,
              isVerified: Boolean(user.isVerified),
              city: user.city || '',
              specialization: user.specialization || [],
              bio: user.bio || '',
              education: user.education || [],
              languages: user.languages || [],
              officeAddress: user.officeAddress || '',
            },
          },
        };
      }

      // If no user in database, use Auth0 session data
      return {
        props: {
          initialProfile: {
            email: session.user.email || '',
            fullName: session.user.name || '',
            role: 'USER',
            profilePhoto: session.user.picture || '',
            isProfileSetup: false,
            isVerified: true, // Allow access since they're authenticated
            specialization: [],
            education: [],
            languages: [],
          },
        },
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Database unavailable in profile, using Auth0 fallback data');
      }
      
      // Fallback: Allow access with Auth0 data when database is unavailable
      return {
        props: {
          initialProfile: {
            email: session.user.email || '',
            fullName: session.user.name || '',
            role: 'advocate', // Default role
            isProfileSetup: false, // Will need setup when DB is available
            isVerified: true, // Allow access since they're authenticated via Auth0
          },
        },
      };
    }
  },
});

export default function Profile({ initialProfile }: ProfileProps) {
  const { user } = useUser();
  const { profileData: hookProfileData, refreshProfile, updateProfilePhoto } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfile);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [tempProfilePhoto, setTempProfilePhoto] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Split fullName into firstName and lastName for editing
  const [firstName, lastName] = initialProfile.fullName.split(' ');
  const [editForm, setEditForm] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    barRegistrationNo: initialProfile.barRegistrationNo || '',
    bio: initialProfile.bio || '',
    education: initialProfile.education || [],
    officeAddress: initialProfile.officeAddress || '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEducationChange = (index: number, value: string) => {
    const newEducation = [...editForm.education];
    newEducation[index] = value;
    setEditForm({
      ...editForm,
      education: newEducation
    });
  };

  const handleAddEducation = () => {
    setEditForm({
      ...editForm,
      education: [...editForm.education, '']
    });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = editForm.education.filter((_, i) => i !== index);
    setEditForm({
      ...editForm,
      education: newEducation
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Convert file to base64 for immediate preview
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          
          // Show preview immediately
          setTempProfilePhoto(base64Image);
          setImageLoadError(false);
          
          try {
            // Upload to Cloudinary in background
            if (process.env.NODE_ENV === 'development') {
              console.log('📸 Uploading photo to Cloudinary...');
            }
            const uploadResponse = await fetch('/api/upload-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageData: base64Image }),
            });
            
            if (!uploadResponse.ok) {
              throw new Error('Failed to upload image');
            }
            
            const uploadData = await uploadResponse.json();
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Photo uploaded to Cloudinary:', uploadData.url);
            }
            
            // Store the Cloudinary URL (will be saved to DB when user clicks "Save Changes")
            setUploadedPhotoUrl(uploadData.url);
            setIsUploading(false);
          } catch (error) {
            console.error('❌ Error uploading photo:', error);
            alert('Error uploading photo. Please try again.');
            setTempProfilePhoto(null);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setIsUploading(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePhoto('');
    setUploadedPhotoUrl('');
    setImageLoadError(false);
  };

  const handleSaveChanges = async () => {
    try {
      let finalPhotoUrl = profileData.profilePhoto;
      
      // If there's an uploaded photo URL, save it to database first
      if (uploadedPhotoUrl !== null) {
        const photoResponse = await fetch('/api/auth/upload-profile-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photoUrl: uploadedPhotoUrl }),
        });

        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          console.log('✅ Photo saved to database:', photoData.photoUrl);
          finalPhotoUrl = photoData.photoUrl;
          
          // IMMEDIATELY update the navbar photo
          updateProfilePhoto(photoData.photoUrl);
          console.log('✅ Navbar photo updated immediately');
        }
      }
      
      // Combine firstName and lastName with proper capitalization
      const capitalizeFirst = (str: string) => 
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      
      const fullName = editForm.lastName.trim() 
        ? `${capitalizeFirst(editForm.firstName.trim())} ${capitalizeFirst(editForm.lastName.trim())}`
        : capitalizeFirst(editForm.firstName.trim());
      
      // Then save profile text fields
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName,
          barRegistrationNo: editForm.barRegistrationNo,
          bio: editForm.bio,
          education: editForm.education.filter(edu => edu.trim() !== ''),
          officeAddress: editForm.officeAddress,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        updatedProfile.profilePhoto = finalPhotoUrl;
        
        setProfileData(updatedProfile);
        setTempProfilePhoto(null); // Clear temp photo
        setUploadedPhotoUrl(null); // Clear uploaded URL
        setIsEditing(false);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Profile saved successfully');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    const [firstName, lastName] = initialProfile.fullName.split(' ');
    setEditForm({
      firstName: firstName || '',
      lastName: lastName || '',
      barRegistrationNo: initialProfile.barRegistrationNo || '',
      bio: initialProfile.bio || '',
      education: initialProfile.education || [],
      officeAddress: initialProfile.officeAddress || '',
    });
    setTempProfilePhoto(null); // Discard temporary photo
    setUploadedPhotoUrl(null); // Discard uploaded URL
    setImageLoadError(false); // Reset image error state
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>My Profile - Indian Advocate Forum</title>
        <meta name="description" content="Manage your profile information" />
      </Head>

      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                My Profile
              </h1>
              <p className="mt-2 text-gray-600">Manage your personal information and settings</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Profile Photo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Show temp photo if exists, otherwise show saved profile photo */}
              {(tempProfilePhoto !== null ? tempProfilePhoto : profileData.profilePhoto) && 
               (tempProfilePhoto !== null ? tempProfilePhoto.trim() !== '' : (profileData.profilePhoto?.trim() !== '')) && 
               !imageLoadError ? (
                <div className="relative">
                  <img
                    src={tempProfilePhoto !== null ? tempProfilePhoto : profileData.profilePhoto}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-purple-600"
                    onError={() => {
                      console.log('❌ Profile image failed to load');
                      setImageLoadError(true);
                    }}
                    onLoad={() => {
                      console.log('✅ Profile image loaded successfully');
                    }}
                  />
                  {/* Upload progress overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="text-white text-xs mt-2">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 w-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-purple-600">
                  <UserCircleIcon className="h-24 w-24 text-white" />
                </div>
              )}
              
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 bg-purple-600 p-3 rounded-full text-white hover:bg-purple-700 shadow-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload photo"
                  >
                    <CameraIcon className="h-5 w-5" />
                  </button>
                  
                  {((tempProfilePhoto !== null && tempProfilePhoto.trim() !== '') || 
                    (tempProfilePhoto === null && profileData.profilePhoto && profileData.profilePhoto.trim() !== '')) && (
                    <button
                      onClick={handleRemovePhoto}
                      disabled={isUploading}
                      className="absolute bottom-0 left-0 bg-red-600 p-3 rounded-full text-white hover:bg-red-700 shadow-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove photo"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name - Shows combined in view mode, separate in edit mode */}
            {!isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">
                  {editForm.firstName.charAt(0).toUpperCase() + editForm.firstName.slice(1).toLowerCase()}
                  {editForm.lastName && ` ${editForm.lastName.charAt(0).toUpperCase() + editForm.lastName.slice(1).toLowerCase()}`}
                </p>
              </div>
            ) : (
              <>
                {/* First Name - Only in edit mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                {/* Last Name - Only in edit mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg text-gray-900">{profileData.email}</p>
            </div>

            {profileData.role === 'ADVOCATE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bar Registration Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="barRegistrationNo"
                      value={editForm.barRegistrationNo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{profileData.barRegistrationNo || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <p className="mt-1 text-lg text-gray-900">{profileData.yearsOfExperience} years</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <p className="mt-1 text-lg text-gray-900">{profileData.city || 'Not provided'}</p>
                </div>

                {profileData.specialization && profileData.specialization.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 font-medium rounded-lg text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profileData.bio || isEditing) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows={5}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Tell us about yourself and your legal practice..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-700 whitespace-pre-line">{profileData.bio}</p>
                    )}
                  </div>
                )}

                {(profileData.education && profileData.education.length > 0) || isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    {isEditing ? (
                      <div className="space-y-3">
                        {editForm.education.map((edu, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={edu}
                              onChange={(e) => handleEducationChange(index, e.target.value)}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., LLB from National Law University"
                            />
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              type="button"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddEducation}
                          className="flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                          type="button"
                        >
                          <PlusIcon className="h-5 w-5 mr-1" />
                          Add Education
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {profileData.education?.map((edu, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span className="text-gray-700">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}

                {profileData.languages && profileData.languages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm border border-gray-200"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profileData.officeAddress || isEditing) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Office Address</label>
                    {isEditing ? (
                      <textarea
                        name="officeAddress"
                        value={editForm.officeAddress}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter your office address..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-700 whitespace-pre-line">{profileData.officeAddress}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}