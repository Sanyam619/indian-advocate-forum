import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const experienceOptions = [
  { value: '5+', label: '5+ years' },
  { value: '8+', label: '8+ years' },
  { value: '20+', label: '20+ years' },
];

const commonLanguages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi'];
const commonPracticeAreas = [
  'Criminal Law',
  'Civil Law',
  'Corporate Law',
  'Family Law',
  'Property Law',
  'Labour Law',
  'Tax Law',
  'Constitutional Law',
  'Intellectual Property',
  'Consumer Protection'
];

const AdvocateProfileForm = () => {
  const router = useRouter();
  const [isAdvocate, setIsAdvocate] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barRegistrationNo, setBarRegistrationNo] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [city, setCity] = useState('');
  const [specialization, setSpecialization] = useState('');
  
  // Extended fields
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState<string[]>(['']);
  const [languages, setLanguages] = useState<string[]>([]);
  const [officeAddress, setOfficeAddress] = useState('');
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddEducation = () => {
    setEducation([...education, '']);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, value: string) => {
    const updated = [...education];
    updated[index] = value;
    setEducation(updated);
  };

  const toggleLanguage = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter(l => l !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const togglePracticeArea = (area: string) => {
    if (practiceAreas.includes(area)) {
      setPracticeAreas(practiceAreas.filter(a => a !== area));
    } else {
      setPracticeAreas([...practiceAreas, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation for advocates
    if (isAdvocate) {
      if (!firstName.trim()) {
        setError('Please enter your first name');
        setIsSubmitting(false);
        return;
      }
      if (!city || !specialization) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      if (languages.length === 0) {
        setError('Please select at least one language');
        setIsSubmitting(false);
        return;
      }
      if (practiceAreas.length === 0) {
        setError('Please select at least one practice area');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await axios.post('/api/auth/profile-setup', {
        isAdvocate,
        firstName,
        lastName,
        barRegistrationNo: isAdvocate ? barRegistrationNo : null,
        yearsOfExperience: isAdvocate ? yearsOfExperience : null,
        city: isAdvocate ? city : null,
        specialization: isAdvocate ? specialization : null,
        bio: isAdvocate ? bio : null,
        education: isAdvocate ? education.filter(e => e.trim() !== '') : [],
        languages: isAdvocate ? languages : [],
        officeAddress: isAdvocate ? officeAddress : null,
        practiceAreas: isAdvocate ? practiceAreas : [],
      });

      if (response.data.success) {
        router.push('/news');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us more about yourself
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Advocate Selection */}
          <div>
            <label className="text-lg font-medium text-gray-900 block mb-4">
              Are you an advocate?
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsAdvocate(true)}
                className={`flex-1 py-2 px-4 rounded-md ${
                  isAdvocate === true
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsAdvocate(false)}
                className={`flex-1 py-2 px-4 rounded-md ${
                  isAdvocate === false
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Conditional Fields for Advocates */}
          {isAdvocate && (
            <div className="space-y-6 border-t pt-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Bar Registration and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="barRegistration" className="block text-sm font-medium text-gray-700">
                    Bar Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="barRegistration"
                    value={barRegistrationNo}
                    onChange={(e) => setBarRegistrationNo(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    required
                    placeholder="e.g., MH/1234/2015"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    required
                  >
                    <option value="">Select experience</option>
                    {experienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City and Specialization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    required
                    placeholder="Enter your city (e.g., Delhi, Mumbai)"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                    required
                    placeholder="e.g., Criminal Law, Civil Law"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                  placeholder="Tell clients about your experience, expertise, and approach to legal practice..."
                />
                <p className="mt-1 text-xs text-gray-500">This will be displayed on your profile page</p>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                {education.map((edu, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => handleEducationChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                      placeholder="e.g., LLB - Mumbai University (2015)"
                    />
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="mt-2 flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Education
                </button>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonLanguages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => toggleLanguage(language)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        languages.includes(language)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Practice Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Areas <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonPracticeAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => togglePracticeArea(area)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        practiceAreas.includes(area)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Office Address */}
              <div>
                <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address
                </label>
                <textarea
                  id="officeAddress"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border"
                  placeholder="Enter your office address..."
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAdvocate === null || isSubmitting}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvocateProfileForm;