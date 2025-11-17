import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

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
}

const AdvocateSearch: React.FC<AdvocateSearchProps> = ({ onSearch }) => {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/advocates/search?city=${encodeURIComponent(city.trim())}`);
      const data = await response.json();

      if (data.success) {
        setAdvocates(data.advocates);
        onSearch?.(city, data.advocates);
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
    router.push(`/advocates/${advocateId}`);
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
            {loading ? 'Searching...' : `Found ${advocates.length} advocate${advocates.length !== 1 ? 's' : ''} in ${city}`}
          </h2>

          {advocates.length === 0 && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              No advocates found in {city}. Try searching for a nearby city or check the spelling.
            </div>
          )}

          {advocates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advocates.map((advocate) => (
                <div key={advocate.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  {/* Advocate Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
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
                      {/* Specialization Tags */}
                      {advocate.specialization && Array.isArray(advocate.specialization) && advocate.specialization.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {advocate.specialization.slice(0, 3).map((spec, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-50 rounded"
                            >
                              {spec}
                            </span>
                          ))}
                          {advocate.specialization.length > 3 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewProfile(advocate.id);
                              }}
                              className="inline-block px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                            >
                              +{advocate.specialization.length - 3} more
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">{advocate.specialization || 'General Practice'}</p>
                      )}
                    </div>
                  </div>

                  {/* Advocate Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20">Experience:</span>
                      <span className="font-medium">{advocate.yearsOfExperience} years</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-20">Location:</span>
                      <span>{advocate.city}</span>
                    </div>
                    {advocate.barRegistrationNo && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-20">Bar Reg:</span>
                        <span>{advocate.barRegistrationNo}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">{advocate.email}</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewProfile(advocate.id);
                      }}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvocateSearch;