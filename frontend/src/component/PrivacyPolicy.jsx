import { Shield, CheckCircle, Lock, Users, Globe, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">FastGen Privacy Standards</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Your data security and privacy are our top priorities. We follow industry best practices and comply with global regulations to ensure your information is protected.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>GDPR Compliant (EU)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>CCPA Compliant (California)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>End-to-End Encryption</span>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Information We Collect</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Personal Information</h4>
              <p className="text-sm">Name, email address, profile information, and authentication data when you create an account or use our services.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Usage Data</h4>
              <p className="text-sm">Information about how you interact with our platform, including chat history, uploaded files, and learning preferences.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Technical Data</h4>
              <p className="text-sm">Device information, IP addresses, browser type, and other technical details necessary for service delivery.</p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span>How We Use Your Information</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm">Provide and improve our AI-powered learning services</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm">Personalize your learning experience and content recommendations</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm">Communicate with you about service updates and support</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm">Ensure platform security and prevent fraud</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm">Comply with legal obligations and enforce our terms</p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-400" />
            <span>Data Security</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">We implement industry-standard security measures to protect your data:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Regular security audits</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Secure data centers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Access controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <span>Data Sharing & Third Parties</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">We do not sell, trade, or rent your personal information to third parties. We may share data only in these limited circumstances:</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">With your explicit consent</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">To comply with legal requirements</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">With trusted service providers (under strict confidentiality agreements)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>Your Privacy Rights</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">You have the right to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Access your personal data</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Correct inaccurate information</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Request data deletion</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Export your data</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Opt-out of communications</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Lodge privacy complaints</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Contact Our Privacy Team</h3>
          <div className="space-y-3 text-gray-300">
            <p className="text-sm"><span className="font-medium text-white">Email:</span> privacy@fastgen.ai</p>
            <p className="text-sm"><span className="font-medium text-white">Phone:</span> +1 (555) 123-4567</p>
            <p className="text-sm"><span className="font-medium text-white">Address:</span> 273, Bhiwani, Haryana-127021, India</p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Policy Updates</h3>
          <div className="space-y-3 text-gray-300">
            <p className="text-sm">This privacy policy may be updated periodically. We will notify you of any material changes via email or through our platform.</p>
            <div className="text-xs text-gray-400">
              <p>Last updated: January 15, 2024</p>
              <p>Version: 3.2.1</p>
              <p>Data Processing: AWS, Google Cloud (GDPR compliant)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/help" className="text-gray-400 hover:text-blue-400 transition-colors">
              Help Center
            </Link>
            <Link to="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">
              Documentation
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            © 2024 FastGen AI, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
