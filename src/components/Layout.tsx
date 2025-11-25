import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useUser } from '@auth0/nextjs-auth0/client';
import AuthModal from './auth/AuthModal';
import PremiumModal from './PremiumModal';
import { useUserProfile } from '../hooks/useUserProfile';
import NewsTicker from './NewsTicker';
import Footer from './Footer';
import EmailVerificationBanner from './auth/EmailVerificationBanner';

// Import icons directly to avoid dynamic loading delays
import { 
  Bars3Icon,
  XMarkIcon,
  NewspaperIcon,
  UserCircleIcon,
  ScaleIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Indian Advocate Forum" }) => {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  
  const { user } = useUser();
  const { profileData } = useUserProfile();

  // Get user profile photo from the custom hook, fallback to Auth0 picture
  const userProfilePhoto = profileData?.profilePhoto || user?.picture;

  // Debug log for profile photo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ Layout - Profile data:', profileData);
      console.log('🖼️ Layout - User profile photo URL:', userProfilePhoto);
    }
  }, [profileData, userProfilePhoto]);

  // Reset image error when profile photo URL changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Layout - Resetting image error for new photo URL:', userProfilePhoto);
    }
    setImageLoadError(false);
  }, [userProfilePhoto]);  // Handle click outside of profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current && 
        profileButtonRef.current && 
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Use Auth0's logout endpoint
    window.location.href = '/api/auth/logout';
  };


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSupremeCourt, setShowSupremeCourt] = useState(false);
  const [showHighCourt, setShowHighCourt] = useState(false);
  const [showJudges, setShowJudges] = useState(false);
  const [showLawFirms, setShowLawFirms] = useState(false);
  const [showServices, setShowServices] = useState(false);

  // Supreme Court VC Links
  const supremeCourtVCLinks = [
    { name: "Court No. 1", url: "https://sci-vc.webex.com/meet/court01" },
    { name: "Court No. 2", url: "https://sci-vc.webex.com/meet/court02" },
    { name: "Court No. 3", url: "https://sci-vc.webex.com/meet/court03" },
    { name: "Court No. 4", url: "https://sci-vc.webex.com/meet/court04" },
    { name: "Court No. 5", url: "https://sci-vc.webex.com/meet/court05" },
    { name: "Court No. 6", url: "https://sci-vc.webex.com/meet/court06" },
    { name: "Court No. 7", url: "https://sci-vc.webex.com/meet/court07" },
    { name: "Court No. 8", url: "https://sci-vc.webex.com/meet/court08" },
    { name: "Court No. 9", url: "https://sci-vc.webex.com/meet/court09" },
    { name: "Court No. 10", url: "https://sci-vc.webex.com/meet/court10" },
    { name: "Court No. 11", url: "https://sci-vc.webex.com/meet/court11" },
    { name: "Court No. 12", url: "https://sci-vc.webex.com/meet/court12" },
    { name: "Court No. 13", url: "https://sci-vc.webex.com/meet/court13" },
    { name: "Court No. 14", url: "https://sci-vc.webex.com/meet/court14" },
    { name: "Court No. 15", url: "https://sci-vc.webex.com/meet/court15" },
    { name: "Court No. 16", url: "https://sci-vc.webex.com/meet/court16" },
    { name: "Court No. 17", url: "https://sci-vc.webex.com/meet/court17" },
    { name: "Reg. Court", url: "https://sci-vc.webex.com/meet/registrarcourt" }
  ];

  const highCourtList = [
    "Allahabad High Court",
    "Andhra Pradesh High Court",
    "Bombay High Court",
    "Calcutta High Court",
    "Chhattisgarh High Court",
    "Delhi High Court",
    "Gauhati High Court",
    "Gujarat High Court",
    "Himachal Pradesh High Court",
    "High Court of Jammu & Kashmir and Ladakh",
    "Jharkhand High Court",
    "Karnataka High Court",
    "Kerala High Court",
    "Madhya Pradesh High Court",
    "Madras High Court",
    "Manipur High Court",
    "Meghalaya High Court",
    "Orissa High Court",
    "Patna High Court",
    "Punjab and Haryana High Court",
    "Rajasthan High Court",
    "Sikkim High Court",
    "Telangana High Court",
    "Tripura High Court",
    "Uttarakhand High Court"
  ];

  // Mapping function to convert court names to correct URLs
  const getCourtUrl = (courtName: string): string => {
    const courtUrlMap: Record<string, string> = {
      "Punjab and Haryana High Court": "punjab-haryana-high-court",
      "High Court of Jammu & Kashmir and Ladakh": "jammu-kashmir-ladakh-high-court",
      "Guwahati High Court": "gauhati-high-court"
    };

    if (courtUrlMap[courtName]) {
      return courtUrlMap[courtName];
    }

    // Default URL generation for other courts
    return courtName.toLowerCase().replace(/\s+/g, '-');
  };

  const supremeCourtOptions = [
    { name: "SC Judgements", href: '/supreme-court/judgements' },
    { name: "Orders and Observations of SC", href: '/supreme-court/orders-observations' }
  ];

  const supremeCourtRef = useRef<HTMLDivElement>(null);
  const highCourtRef = useRef<HTMLDivElement>(null);
  const joinSCRef = useRef<HTMLDivElement>(null);

  // Scroll detection state
  const [showFirstNavbar, setShowFirstNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll behavior with debounce to prevent shaking
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Clear any existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          // Debounce the state update to prevent jitter
          scrollTimeoutRef.current = setTimeout(() => {
            // Show first navbar when scrolling up or at top
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
              setShowFirstNavbar(true);
            } 
            // Hide first navbar when scrolling down and past threshold
            else if (currentScrollY > lastScrollY && currentScrollY > 50) {
              setShowFirstNavbar(false);
            }
            
            setLastScrollY(currentScrollY);
          }, 10); // Small debounce to smooth out rapid changes
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        {/* Top Header Bar - Logo + Key Actions + User Controls */}
        <div 
          className={`bg-white border-b border-gray-100 transition-transform duration-300 ease-in-out ${
            showFirstNavbar ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ 
            position: showFirstNavbar ? 'relative' : 'absolute',
            width: '100%',
            top: 0
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and site name */}
              <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image 
                  src="/logo.jpg" 
                  alt="Indian Advocate Forum Logo" 
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                  priority={true}
                  loading="eager"
                />
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Indian Advocate Forum</h1>
              </Link>
            </div>

            {/* Primary Actions - Find Advocates, Join SC & Podcasts */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/search-advocates"
                className={`${
                  router.pathname === '/search-advocates'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                } flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Find Advocates
              </Link>

              {/* Join SC Dropdown */}
              <div 
                ref={joinSCRef} 
                className="relative group flex items-center"
              >
                <button
                  className="text-gray-700 hover:text-purple-600 flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <VideoCameraIcon className="h-4 w-4 mr-2" />
                  Join SC
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 bg-purple-50 border-b border-purple-100">
                          <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">
                            Supreme Court VC Links
                          </p>
                        </div>
                        {supremeCourtVCLinks.map((court, index) => (
                          <a
                            key={index}
                            href={court.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150"
                          >
                            {court.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/podcasts"
                className={`${
                  router.pathname === '/podcasts'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                } flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Podcasts
              </Link>

              <Link
                href="/our-team"
                className={`${
                  router.pathname === '/our-team' || router.pathname.startsWith('/our-team/')
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                } flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Our Team
              </Link>
            </div>

            {/* User Controls */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Language Toggle */}


              {/* User Profile/Sign In */}
              {user ? (
                <>
                  {/* Subscribe Premium or Premium Badge */}
                  {profileData?.isPremium ? (
                    <Link
                      href="/premium/manage"
                      className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-purple-700 bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 transition-all duration-200 border border-yellow-300"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Premium
                    </Link>
                  ) : (
                    <button
                      onClick={() => setShowPremiumModal(true)}
                      className="hidden lg:inline-flex items-center px-5 py-2 border-2 border-purple-600 text-sm font-semibold rounded-lg text-purple-600 bg-white hover:bg-purple-50 transition-colors duration-200"
                    >
                      Subscribe Premium
                    </button>
                  )}

                  <div className="relative">
                    <button
                      ref={profileButtonRef}
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600"
                    >
                      {userProfilePhoto && userProfilePhoto.trim() !== '' && !imageLoadError ? (
                        <img 
                          key={userProfilePhoto}
                          src={userProfilePhoto} 
                          alt="Profile" 
                          className="h-full w-full object-cover rounded-full"
                          onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                              console.log('✅ Profile image loaded successfully:', userProfilePhoto);
                            }
                          }}
                          onError={() => {
                            if (process.env.NODE_ENV === 'development') {
                              console.log('❌ Profile image failed to load:', userProfilePhoto);
                            }
                            setImageLoadError(true);
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <UserCircleIcon className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div 
                        ref={profileMenuRef}
                        className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        {profileData?.isPremium && (
                          <Link
                            href="/premium/manage"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Manage Subscription
                          </Link>
                        )}
                        <a
                          href="/api/auth/logout"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Sign Out
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="hidden lg:inline-flex items-center px-5 py-2 border-2 border-purple-600 text-sm font-semibold rounded-lg text-purple-600 bg-white hover:bg-purple-50 transition-colors duration-200"
                  >
                    Subscribe Premium
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Content & Court Sections */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-6 h-14">
              {/* Top Stories */}
              <Link
                href="/news"
                className={`${
                  router.pathname === '/news'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300'
                } flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap`}
              >
                <NewspaperIcon className="h-4 w-4 mr-2" />
                Top Stories
              </Link>

              {/* Supreme Court */}
              <div 
                ref={supremeCourtRef} 
                className="relative group flex items-center"
              >
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <ScaleIcon className="h-4 w-4 mr-2" />
                  Supreme Court
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        {supremeCourtOptions.map((option: any) => (
                          <Link
                            key={option.name}
                            href={option.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          >
                            {option.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* High Court */}
              <div 
                ref={highCourtRef} 
                className="relative group flex items-center"
              >
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <ScaleIcon className="h-4 w-4 mr-2" />
                  High Court
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-80 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <div className="max-h-80 overflow-y-auto">
                          {highCourtList.map((court) => (
                            <Link
                              key={court}
                              href={`/high-court/${getCourtUrl(court)}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            >
                              {court}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Conference */}
              <Link
                href="/video-conference"
                className={`${
                  router.pathname === '/video-conference'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300'
                } flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap`}
              >
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Video Conference
              </Link>

              {/* Judges */}
              <div className="relative group flex items-center">
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <UserCircleIcon className="h-4 w-4 mr-2" />
                  Judges
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <Link
                          href="/judges/current"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Chief Justice & Judges
                        </Link>
                        <Link
                          href="/judges/former-chief-justices"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Former Chief Justices
                        </Link>
                        <Link
                          href="/judges/former-judges"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Former Judges
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Law Firms */}
              <div className="relative group flex items-center">
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Law Firms
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <Link
                          href="/law-firms/deal-news"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Deal News
                        </Link>
                        <Link
                          href="/law-firms/foreign-law-firms"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Foreign Law Firms
                        </Link>
                        <Link
                          href="/law-firms/articles"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Law Firm Articles
                        </Link>
                        <Link
                          href="/law-firms/events"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Events
                        </Link>
                        <Link
                          href="/law-firms/internships"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Internships
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Law Schools */}
              <div className="relative group flex items-center">
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Law Schools
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <Link
                          href="/law-schools/call-for-papers"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Call For Papers
                        </Link>
                        <Link
                          href="/law-schools/competitions"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Competitions
                        </Link>
                        <Link
                          href="/law-schools/diploma-certificate"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Diploma/Certificate Courses
                        </Link>
                        <Link
                          href="/law-schools/internships"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Internships
                        </Link>
                        <Link
                          href="/law-schools/articles"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Law School Articles
                        </Link>
                        <Link
                          href="/law-schools/scholarships"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Scholarships Fellowships
                        </Link>
                        <Link
                          href="/law-schools/llm-phd"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          LLM/PHD
                        </Link>
                        <Link
                          href="/law-schools/moot-courts"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Moot Courts
                        </Link>
                        <Link
                          href="/law-schools/placements"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Placements
                        </Link>
                        <Link
                          href="/law-schools/exams"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Law Exams
                        </Link>
                        <Link
                          href="/law-schools/admission"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Law School Admission
                        </Link>
                        <Link
                          href="/law-schools/seminars"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Seminars
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="relative group flex items-center">
                <button
                  className="text-gray-700 hover:text-purple-600 border-b-2 border-transparent hover:border-purple-300 flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Services
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full w-64 z-50">
                  <div className="hidden group-hover:block">
                    <div className="pt-2">
                      <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <a
                          href="https://www.sci.gov.in/cause-list/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Cause List
                        </a>
                        <a
                          href="https://www.sci.gov.in/case-status-case-no/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Case Status
                        </a>
                        <a
                          href="https://www.sci.gov.in/daily-order-case-no/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Daily Orders
                        </a>
                        <a
                          href="https://www.sci.gov.in/judgements-case-no/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Judgements
                        </a>
                        <a
                          href="https://www.sci.gov.in/caveat-case-no/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          Caveat
                        </a>
                        <a
                          href="https://efiling.sci.gov.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        >
                          e-Filing
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div 
              className={`fixed top-32 left-0 w-80 lg:hidden bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-r-lg ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="pt-4 pb-3 space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Primary Actions Section */}
                <div className="px-4 pb-3 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
                  <Link
                    href="/search-advocates"
                    className={`${
                      router.pathname === '/search-advocates'
                        ? 'bg-purple-50 text-purple-600 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } flex items-center px-3 py-3 text-base font-medium border-l-4 rounded-r-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
                    Find Advocates
                  </Link>

                  {/* Join SC Dropdown - Mobile */}
                  <div className="mt-1">
                    <button
                      onClick={() => setShowSupremeCourt(!showSupremeCourt)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-md"
                    >
                      <div className="flex items-center">
                        <VideoCameraIcon className="h-5 w-5 mr-3" />
                        Join SC
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${showSupremeCourt ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSupremeCourt && (
                      <div className="bg-gray-50 py-2 ml-3 rounded-r-md max-h-64 overflow-y-auto">
                        <div className="px-4 py-2 bg-purple-100 border-b border-purple-200">
                          <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">
                            Supreme Court VC Links
                          </p>
                        </div>
                        {supremeCourtVCLinks.map((court, index) => (
                          <a
                            key={index}
                            href={court.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                            onClick={() => {
                              setShowSupremeCourt(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {court.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/podcasts"
                    className={`${
                      router.pathname === '/podcasts'
                        ? 'bg-purple-50 text-purple-600 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } flex items-center px-3 py-3 text-base font-medium border-l-4 rounded-r-md mt-1`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlayIcon className="h-5 w-5 mr-3" />
                    Podcasts
                  </Link>
                </div>

                {/* Main Navigation Section */}
                <div className="px-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Browse Content</h3>
                  
                  {/* Top Stories */}
                  <Link
                    href="/news"
                    className={`${
                      router.pathname === '/news'
                        ? 'bg-purple-50 text-purple-600 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } flex items-center px-3 py-3 text-base font-medium border-l-4 rounded-r-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <NewspaperIcon className="h-5 w-5 mr-3" />
                    Top Stories
                  </Link>

                  {/* Supreme Court */}
                  <div className="mt-1">
                    <button
                      onClick={() => setShowSupremeCourt(!showSupremeCourt)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-md"
                    >
                      <div className="flex items-center">
                        <ScaleIcon className="h-5 w-5 mr-3" />
                        Supreme Court
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${showSupremeCourt ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSupremeCourt && (
                      <div className="bg-gray-50 py-2 ml-3 rounded-r-md">
                        {supremeCourtOptions.map((option: any) => (
                          <Link
                            key={option.name}
                            href={option.href}
                            className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                            onClick={() => {
                              setShowSupremeCourt(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {option.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* High Court */}
                  <div className="mt-1">
                    <button
                      onClick={() => setShowHighCourt(!showHighCourt)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-md"
                    >
                      <div className="flex items-center">
                        <ScaleIcon className="h-5 w-5 mr-3" />
                        High Court
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${showHighCourt ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showHighCourt && (
                      <div className="bg-gray-50 py-2 ml-3 rounded-r-md max-h-60 overflow-y-auto">
                        {highCourtList.map((court) => (
                          <Link
                            key={court}
                            href={`/high-court/${getCourtUrl(court)}`}
                            className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                            onClick={() => {
                              setShowHighCourt(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {court}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Conference */}
                  <Link
                    href="/video-conference"
                    className={`${
                      router.pathname === '/video-conference'
                        ? 'bg-purple-50 text-purple-600 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } flex items-center px-3 py-3 text-base font-medium border-l-4 rounded-r-md mt-1`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <VideoCameraIcon className="h-5 w-5 mr-3" />
                    Video Conference
                  </Link>

                  {/* Our Team */}
                  <Link
                    href="/our-team"
                    className={`${
                      router.pathname === '/our-team' || router.pathname.startsWith('/our-team/')
                        ? 'bg-purple-50 text-purple-600 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } flex items-center px-3 py-3 text-base font-medium border-l-4 rounded-r-md mt-1`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserGroupIcon className="h-5 w-5 mr-3" />
                    Our Team
                  </Link>

                  {/* Judges */}
                  <div className="mt-1">
                    <button
                      onClick={() => setShowJudges(!showJudges)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-md"
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 mr-3" />
                        Judges
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${showJudges ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showJudges && (
                      <div className="bg-gray-50 py-2 ml-3 rounded-r-md">
                        <Link
                          href="/judges/current"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowJudges(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Chief Justice & Judges
                        </Link>
                        <Link
                          href="/judges/former-chief-justices"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowJudges(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Former Chief Justices
                        </Link>
                        <Link
                          href="/judges/former-judges"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowJudges(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Former Judges
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Law Firms */}
                  <div className="mt-1">
                    <button
                      onClick={() => setShowLawFirms(!showLawFirms)}
                      className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-md"
                    >
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Law Firms
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${showLawFirms ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showLawFirms && (
                      <div className="bg-gray-50 py-2 ml-3 rounded-r-md">
                        <Link
                          href="/law-firms/deal-news"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowLawFirms(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Deal News
                        </Link>
                        <Link
                          href="/law-firms/foreign-law-firms"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowLawFirms(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Foreign Law Firms
                        </Link>
                        <Link
                          href="/law-firms/articles"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowLawFirms(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Law Firm Articles
                        </Link>
                        <Link
                          href="/law-firms/events"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowLawFirms(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Events
                        </Link>
                        <Link
                          href="/law-firms/internships"
                          className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          onClick={() => {
                            setShowLawFirms(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Internships
                        </Link>
                      </div>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </>
        )}
      </nav>

      {/* News Ticker */}
      <NewsTicker speed={25} pauseOnHover={true} showLabel={true} />
      </div>
      {/* End of Sticky Header Container */}

      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Breadcrumb Home Link - Show on all pages except landing/home */}
      {router.pathname !== '/landing' && router.pathname !== '/' && (
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
            <Link 
              href="/landing"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 group"
            >
              <svg 
                className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
              {router.pathname !== '/news' && router.pathname !== '/landing' && (
                <>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-800 capitalize">
                    {router.pathname.split('/')[1]?.replace(/-/g, ' ') || 'Page'}
                  </span>
                </>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer variant={
        router.pathname.startsWith('/admin') ? 'admin' :
        router.pathname === '/auth' || router.pathname === '/signup' ? 'minimal' :
        'default'
      } />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumModal 
          isOpen={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)} 
        />
      )}
    </div>
  );
};

export default Layout;