import { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const commonLanguages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi'];
const commonSpecializations = [
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

interface AdvocateSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: (data: {
    isAdvocate: boolean;
    firstName: string;
    lastName: string;
    barRegistrationNo?: string;
    yearsOfExperience?: string;
    city?: string;
    specialization?: string[];
    bio?: string;
    education?: string[];
    languages?: string[];
    officeAddress?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function AdvocateSelectionModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false 
}: AdvocateSelectionModalProps) {
  const [isAdvocate, setIsAdvocate] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [barRegistrationNo, setBarRegistrationNo] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [city, setCity] = useState('');
  const [specialization, setSpecialization] = useState<string[]>([]);
  
  // Extended fields
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState<string[]>(['']);
  const [languages, setLanguages] = useState<string[]>([]);
  const [officeAddress, setOfficeAddress] = useState('');

  if (!isOpen) return null;

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

  const toggleSpecialization = (area: string) => {
    if (specialization.includes(area)) {
      setSpecialization(specialization.filter(a => a !== area));
    } else {
      setSpecialization([...specialization, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdvocate === null) {
      alert('Please select whether you are an advocate or not');
      return;
    }

    if (!firstName) {
      alert('Please fill in your first name');
      return;
    }

    if (isAdvocate && (!barRegistrationNo || !yearsOfExperience || !city)) {
      alert('Please fill in all required advocate details');
      return;
    }

    if (isAdvocate && languages.length === 0) {
      alert('Please select at least one language');
      return;
    }

    if (isAdvocate && specialization.length === 0) {
      alert('Please select at least one specialization');
      return;
    }

    onSubmit({
      isAdvocate,
      firstName,
      lastName,
      barRegistrationNo: isAdvocate ? barRegistrationNo : undefined,
      yearsOfExperience: isAdvocate ? yearsOfExperience : undefined,
      city: isAdvocate ? city : undefined,
      specialization: isAdvocate ? specialization : [],
      bio: isAdvocate ? bio : undefined,
      education: isAdvocate ? education.filter(e => e.trim() !== '') : [],
      languages: isAdvocate ? languages : [],
      officeAddress: isAdvocate ? officeAddress : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8 p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button - only if onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-600">
            Please tell us a bit about yourself to get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Are you an advocate question */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Are you an advocate?
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setIsAdvocate(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  isAdvocate === true
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-purple-400'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsAdvocate(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                  isAdvocate === false
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-purple-400'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* First and Last Name - shown after selecting Yes or No */}
          {isAdvocate !== null && (
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          )}

          {/* Advocate-specific fields */}
          {isAdvocate === true && (
            <div className="space-y-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div>
                <label htmlFor="barRegistration" className="block text-sm font-medium text-gray-700 mb-1">
                  Bar Registration Number *
                </label>
                <input
                  type="text"
                  id="barRegistration"
                  value={barRegistrationNo}
                  onChange={(e) => setBarRegistrationNo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Enter your bar registration number"
                  required
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <select
                  id="experience"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="5+">5+ years</option>
                  <option value="8+">8+ years</option>
                  <option value="15+">15+ years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Enter your city (e.g., Delhi, Mumbai)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization * (Select at least one)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonSpecializations.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleSpecialization(area)}
                      className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                        specialization.includes(area)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  rows={2}
                  placeholder="Tell us about your practice..."
                />
              </div>

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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="e.g., LLB, Delhi University, 2015"
                    />
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="px-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Education
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages * (Select at least one)
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonLanguages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => toggleLanguage(language)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
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

              <div>
                <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Office Address
                </label>
                <textarea
                  id="officeAddress"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  rows={2}
                  placeholder="Your office address..."
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isAdvocate === null || !firstName || isSubmitting || (isAdvocate && (!barRegistrationNo || !yearsOfExperience || !city || specialization.length === 0 || languages.length === 0))}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}