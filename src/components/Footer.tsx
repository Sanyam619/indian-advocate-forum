import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { 
  Scale,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronUp,
  Globe,
  Shield,
  Users,
  BookOpen,
  FileText,
  Gavel,
  Video
} from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'minimal' | 'admin';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const router = useRouter();
  const { user } = useUser();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'minimal') {
    return (
      <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="w-5 h-5 text-purple-400" />
              <span className="text-sm">Indian Advocate Forum</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <span>© 2025 All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'admin') {
    return (
      <footer className="bg-slate-800 text-gray-300 py-4 mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Admin Panel v1.0</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>System Online</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin-help" className="hover:text-purple-400 transition-colors">
                Help & Documentation
              </Link>
              <span>© 2025 Indian Advocate Forum</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default Footer
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Platform Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Indian Advocate Forum</h3>
                  <p className="text-sm text-purple-400">Justice Through Connection</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Professional platform connecting advocates and legal professionals across India. 
                Find qualified lawyers, access legal resources, and stay updated with judicial developments.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">500+</div>
                <div className="text-xs text-gray-400">Verified Advocates</div>
              </div>
              <div className="text-center bg-slate-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-xs text-gray-400">Support Available</div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-purple-400" />
              Quick Links
            </h4>
            <nav className="space-y-3">
              <Link href="/" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                <ChevronUp className="w-4 h-4 mr-2 rotate-90" />
                Home
              </Link>
              <Link href="/search-advocates" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Find Advocates
              </Link>
              <Link href="/news" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Legal News
              </Link>
              <Link href="/podcasts" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Podcast Library
              </Link>
              <Link href="/video-conference" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Video Consultation
              </Link>
              {user && (
                <Link href="/profile" className="hover:text-purple-400 transition-colors duration-200 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              )}
            </nav>
          </div>

          {/* Column 3: Legal Services & Courts */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Gavel className="w-5 h-5 mr-2 text-purple-400" />
              Court Categories
            </h4>
            <div className="space-y-4">
              <Link href="/supreme-court" className="block group">
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 hover:bg-red-900/50 transition-all duration-200">
                  <div className="text-red-300 font-medium">Supreme Court</div>
                  <div className="text-xs text-gray-400">Constitutional & Appeal Cases</div>
                </div>
              </Link>
              
              <Link href="/high-court/high-court" className="block group">
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 hover:bg-blue-900/50 transition-all duration-200">
                  <div className="text-blue-300 font-medium">High Courts</div>
                  <div className="text-xs text-gray-400">State-level Jurisdiction</div>
                </div>
              </Link>
              

            </div>
          </div>

          {/* Column 4: Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-purple-400" />
              Contact & Support
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Email Support</div>
                  <a href="mailto:support@indianadvocateforum.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                    support@indianadvocateforum.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Phone Support</div>
                  <a href="tel:+911234567890" className="text-gray-400 hover:text-purple-400 transition-colors">
                    +91 12345-67890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Office Address</div>
                  <div className="text-gray-400">
                    Legal District, New Delhi<br />
                    Delhi 110001, India
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Support Hours</div>
                  <div className="text-gray-400">
                    Mon-Fri: 9:00 AM - 6:00 PM<br />
                    Emergency: 24/7 Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Compliance Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="hover:text-purple-400 transition-colors">
                Legal Disclaimer
              </Link>
              <Link href="/accessibility" className="hover:text-purple-400 transition-colors">
                Accessibility
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© 2025 Indian Advocate Forum. All Rights Reserved.</span>
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-purple-400 transition-colors group"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;