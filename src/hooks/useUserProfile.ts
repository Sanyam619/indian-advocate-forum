import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface UserProfileData {
  profilePhoto?: string;
  fullName?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  isProfileSetup?: boolean;
}

export const useUserProfile = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfileData(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check-profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      } else {
        // Fallback to Auth0 user data
        setProfileData({
          profilePhoto: user.picture || undefined,
          fullName: user.name || undefined,
          email: user.email || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to Auth0 user data
      setProfileData({
        profilePhoto: user.picture || undefined,
        fullName: user.name || undefined,
        email: user.email || undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const refreshProfile = useCallback(() => {
    setLoading(true);
    fetchUserProfile();
  }, [fetchUserProfile]);

  const updateProfilePhoto = useCallback((photoUrl: string) => {
    setProfileData(prev => prev ? { ...prev, profilePhoto: photoUrl } : null);
  }, []);

  return {
    profileData,
    loading,
    refreshProfile,
    updateProfilePhoto,
  };
};