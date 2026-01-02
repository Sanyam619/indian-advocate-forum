import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

// Advocate Card Component with 3D Tilt
const AdvocateCard: React.FC<{ advocate: any; city: string; onCall: (phone: string) => void; onEmail: (email: string, name: string) => void; onView: (id: string) => void }> = ({ advocate, city, onCall, onEmail, onView }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileScreen);
    };
    
    checkMobile();
    
    // Add resize listener to update when screen size changes
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-2xl transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${rotateX !== 0 || rotateY !== 0 ? '-8px' : '0px'})`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
      }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 overflow-hidden">
          {advocate.profilePhoto ? (
            <img
              src={advocate.profilePhoto}
              alt={advocate.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium text-lg">
              {advocate.fullName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            Adv. {advocate.fullName}
          </h3>
          {advocate.specialization && Array.isArray(advocate.specialization) && advocate.specialization.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {advocate.specialization.slice(0, 2).map((spec: string, idx: number) => (
                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {spec}
                </span>
              ))}
              {advocate.specialization.length > 2 && (
                <span className="text-xs text-gray-500">+{advocate.specialization.length - 2}</span>
              )}
            </div>
          ) : advocate.specialization && typeof advocate.specialization === 'string' ? (
            <p className="text-sm text-gray-600">{advocate.specialization}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {advocate.barRegistrationNo && (
          <p className="flex items-center">
            <span className="font-medium mr-2">Bar No:</span>
            <span className="text-gray-500">{advocate.barRegistrationNo}</span>
          </p>
        )}
        <p className="flex items-center">
          <span className="font-medium mr-2">Experience:</span>
          <span className="text-gray-500">{advocate.yearsOfExperience} years</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium mr-2">Location:</span>
          <span className="text-gray-500">{advocate.city}</span>
        </p>
      </div>
      <div className="flex gap-2">
        {advocate.phoneNumber && isMobile && (
          <button
            onClick={() => onCall(advocate.phoneNumber)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <PhoneIcon className="h-4 w-4" />
            Call
          </button>
        )}
        <button
          onClick={() => onEmail(advocate.email, advocate.fullName)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <EnvelopeIcon className="h-4 w-4" />
          Email
        </button>
        <button
          onClick={() => onView(advocate.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
          <EyeIcon className="h-4 w-4" />
          View
        </button>
      </div>
    </div>
  );
};

interface Advocate {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string;
  barRegistrationNo?: string;
  yearsOfExperience: string;
  city: string;
  specialization: string | string[];
  phoneNumber?: string;
}

interface AdvocateSearchProps {
  onSearch?: (city: string, results: Advocate[]) => void;
  onViewProfile?: (advocateId: string) => void;
  onEmailAdvocate?: (email: string, name: string) => boolean;
  isPremium?: boolean;
}

const AdvocateSearch: React.FC<AdvocateSearchProps> = ({ onSearch, onViewProfile, onEmailAdvocate, isPremium = true }) => {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [featuredAdvocates, setFeaturedAdvocates] = useState<Advocate[]>([]);

  // Load featured advocates on mount
  useEffect(() => {
    const loadFeaturedAdvocates = async () => {
      try {
        const response = await fetch('/api/advocates/featured');
        const data = await response.json();

        if (data.success && data.advocates.length > 0) {
          setFeaturedAdvocates(data.advocates);
        }
      } catch (err) {
        console.error('Error loading featured advocates:', err);
      }
    };

    loadFeaturedAdvocates();
  }, []);

  // Load city from URL params and search on mount
  useEffect(() => {
    // Wait for router to be ready to ensure query params are loaded
    if (!router.isReady) return;
    
    const cityParam = router.query.city as string;
    if (cityParam && cityParam.trim()) {
      setCity(cityParam);
      // Perform search automatically
      performSearch(cityParam);
    }
  }, [router.isReady, router.query.city]);

  const performSearch = async (searchCity: string) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setSearchedCity(searchCity.trim());

    try {
      const response = await fetch(`/api/advocates/search?city=${encodeURIComponent(searchCity.trim())}`);
      const data = await response.json();

      if (data.success) {
        setAdvocates(data.advocates);
        onSearch?.(searchCity, data.advocates);
      } else {
        setError(data.message || 'Failed to search advocates');
      }
    } catch (err) {
      setError('Error searching advocates. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    performSearch(city);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEmail = (email: string, advocateName: string) => {
    // Check if onEmailAdvocate handler exists and if premium check passes
    if (onEmailAdvocate && !onEmailAdvocate(email, advocateName)) {
      return; // Don't proceed if premium modal was shown
    }

    const subject = encodeURIComponent('Legal Consultation Inquiry from Indian Advocate Forum');
    const body = encodeURIComponent(`Dear ${advocateName},

I found your profile on the Indian Advocate Forum and would like to inquire about legal consultation.

My Details:
- Location: ${city}
- Legal Matter: [Please describe your legal matter here]

Please let me know your availability and consultation process.

Thank you,
[Your Name]`);
    
    // Use Gmail web interface for cross-platform compatibility
    // This ensures it works consistently on Windows, Mac, and Linux
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
    window.open(gmailLink, '_blank');
  };

  const handleViewProfile = (advocateId: string) => {
    if (onViewProfile) {
      onViewProfile(advocateId);
    } else {
      // Preserve city in URL when navigating to advocate details
      router.push(`/advocates/${advocateId}?from=search&city=${encodeURIComponent(searchedCity || city)}`);
    }
  };

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Ahmedabad'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Legal Advocates in Your City
        </h1>
        <p className="text-lg text-gray-600">
          Connect with qualified legal advocates near you
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your city
            </label>
            <div className="relative">
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-4" />
            </div>
          </div>
          <div className="sm:self-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Find Advocates'}
            </button>
          </div>
        </div>

        {/* Popular Cities */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popular cities:</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((popularCity) => (
              <button
                key={popularCity}
                onClick={() => setCity(popularCity)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {popularCity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searched && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {loading ? 'Searching...' : `Found ${advocates.length} advocate${advocates.length !== 1 ? 's' : ''} in ${searchedCity}`}
          </h2>

          {advocates.length === 0 && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              No advocates found in {searchedCity}. Try searching for a nearby city or check the spelling.
            </div>
          )}

          {advocates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advocates.map((advocate) => (
                <AdvocateCard
                  key={advocate.id}
                  advocate={advocate}
                  city={city}
                  onCall={handleCall}
                  onEmail={handleEmail}
                  onView={handleViewProfile}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Advocates - Always visible, persistent section */}
      {featuredAdvocates.length > 0 && (
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Trusted Senior Legal Experts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAdvocates.map((advocate) => (
              <AdvocateCard
                key={advocate.id}
                advocate={advocate}
                city={advocate.city}
                onCall={handleCall}
                onEmail={handleEmail}
                onView={handleViewProfile}
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              💡 <span className="font-medium">Use the search feature above to explore more advocates in your specific location</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvocateSearch;