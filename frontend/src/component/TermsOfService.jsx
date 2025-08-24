import { FileText, CheckCircle, AlertTriangle, Shield, Users, Globe, ArrowLeft, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
              <FileText className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">FastGen Service Terms</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Clear, transparent terms that protect both users and FastGen while ensuring fair service delivery and maintaining the highest standards of quality.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Flexible Cancellation</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Fair Usage Policies</span>
            </div>
          </div>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            <span>Acceptance of Terms</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">By accessing or using FastGen's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.</p>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">You must be at least 13 years old to use our services</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">You are responsible for maintaining the security of your account</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">You agree to provide accurate and complete information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Service Description</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">FastGen provides AI-powered learning and content generation services including:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>AI Chatbot & Conversations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Content Analysis & Extraction</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Quiz Generation</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>File Upload & Processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Learning Paths & Recommendations</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Note Taking & Organization</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>User Responsibilities</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">As a user of FastGen, you agree to:</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Use the service only for lawful purposes</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Respect intellectual property rights</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Not upload malicious content or files</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Maintain the confidentiality of your account</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Report any security vulnerabilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span>Prohibited Activities</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">The following activities are strictly prohibited:</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Attempting to gain unauthorized access to our systems</p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Using the service to generate harmful or illegal content</p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Violating any applicable laws or regulations</p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Interfering with other users' access to the service</p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Reverse engineering or attempting to copy our technology</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Level Agreement */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-400" />
            <span>Service Level Agreement</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Uptime Guarantee</h4>
                <p className="text-sm">We guarantee 99.9% uptime for our core services. If we fall below this threshold, you may be eligible for service credits.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Response Times</h4>
                <p className="text-sm">Support tickets are typically responded to within 24 hours during business days.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Data Backup</h4>
                <p className="text-sm">Your data is backed up daily with multiple redundant systems to ensure data safety.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Security Updates</h4>
                <p className="text-sm">Critical security updates are deployed within 24 hours of discovery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Billing */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span>Payment & Billing</span>
          </h3>
          <div className="space-y-4 text-gray-300">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">All prices are in USD and subject to applicable taxes</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Subscriptions are billed monthly or annually in advance</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">30-day money-back guarantee for new subscriptions</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Cancellation takes effect at the end of the current billing period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Termination</h3>
          <div className="space-y-4 text-gray-300">
            <p className="text-sm">Either party may terminate this agreement:</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">You may cancel your subscription at any time</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">We may terminate for violation of these terms</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">Upon termination, your access to the service will cease</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-sm">We will retain your data for 30 days after termination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-3 text-gray-300">
            <p className="text-sm">For questions about these terms or to report violations:</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium text-white">Email:</span> legal@fastgen.ai</p>
              <p className="text-sm"><span className="font-medium text-white">Phone:</span> +1 (555) 123-4567</p>
              <p className="text-sm"><span className="font-medium text-white">Address:</span> 273, Bhiwani, Haryana-127021, India</p>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Terms Updates</h3>
          <div className="space-y-3 text-gray-300">
            <p className="text-sm">These terms may be updated periodically. We will notify you of any material changes via email or through our platform.</p>
            <div className="text-xs text-gray-400">
              <p>Last updated: January 15, 2024</p>
              <p>Version: 2.4.0</p>
              <p>Governing Law: California, United States</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
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

export default TermsOfService;
