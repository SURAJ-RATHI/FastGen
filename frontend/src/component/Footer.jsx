import { Library, Github, Twitter, Linkedin, Mail, Phone, MapPin, Shield, FileText, HelpCircle, Users, BookOpen, Zap, Globe, Lock, Building2, MessageCircle, Video, Download, Star, Award, Clock, CheckCircle, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Library className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">FastGen</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering creators with AI-driven tools for faster, smarter content generation. 
              Transform your workflow with cutting-edge technology and intelligent automation.
            </p>
                         <div className="flex space-x-4">
               <a 
                 href="https://github.com/FastGen" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors" 
                 aria-label="GitHub"
               >
                 <Github className="h-5 w-5" />
               </a>
               <a 
                 href="https://twitter.com/SurajRathi65983" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors" 
                 aria-label="Twitter"
               >
                 <Twitter className="h-5 w-5" />
               </a>
               <a 
                 href="https://www.linkedin.com/in/suraj127021" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-blue-400 transition-colors" 
                 aria-label="LinkedIn"
               >
                 <Linkedin className="h-5 w-5" />
               </a>
             </div>
          </div>

          {/* Product & Solutions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <span>Product</span>
            </h3>
                         <ul className="space-y-2 text-sm">
               <li><Link to="/docs" className="hover:text-blue-400 transition-colors">AI Content Generator</Link></li>
               <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Smart Templates</Link></li>
               <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Workflow Automation</Link></li>
               <li><Link to="/docs" className="hover:text-blue-400 transition-colors">API Integration</Link></li>
               <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Enterprise Solutions</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Mobile App</Link></li>
             </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <span>Resources</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link to="/docs" className="hover:text-blue-400 transition-colors">API Reference</Link></li>
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Tutorials & Guides</Link></li>
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Video Library</Link></li>
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Developer Blog</Link></li>
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Community Forum</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <span>Company</span>
            </h3>
                         <ul className="space-y-2 text-sm">
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">About Us</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Careers</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Press & Media</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Partners</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Contact Sales</Link></li>
               <li><Link to="/help" className="hover:text-blue-400 transition-colors">Investor Relations</Link></li>
             </ul>
          </div>
        </div>

        {/* Support & Legal Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              <span>Support</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@fastgen.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-blue-400" />
                <Link to="/help" className="hover:text-blue-400 transition-colors">help.fastgen.ai</Link>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-blue-400" />
                <Link to="/help" className="hover:text-blue-400 transition-colors">Community Support</Link>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500">
                Response time: Within 24 hours<br/>
                Available: Monday - Friday, 9 AM - 6 PM PST
              </p>
            </div>
          </div>

          {/* Legal & Privacy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Legal & Privacy</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                             <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">GDPR Compliance</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">CCPA Notice</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Security & Compliance</Link></li>
            </ul>
          </div>

          {/* Business & Enterprise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Lock className="h-5 w-5 text-blue-400" />
              <span>Enterprise</span>
            </h3>
                         <ul className="space-y-2 text-sm">
               <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Enterprise Features</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Security Overview</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Compliance</Link></li>
               <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Service Level Agreement</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Data Processing Agreement</Link></li>
               <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Subprocessors</Link></li>
             </ul>
          </div>
        </div>

        {/* Help Center & Documentation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-800">
          {/* Help Center */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <Link to="/help" className="hover:text-blue-400 transition-colors">Help Center</Link>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">FastGen Help Center</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Comprehensive guides, tutorials, and troubleshooting for all FastGen features
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span>4.9/5</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>50K+ users</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>24/7</span>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Video className="h-3 w-3 text-blue-400" />
                  <span>500+ Video Tutorials</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Download className="h-3 w-3 text-blue-400" />
                  <span>100+ Downloadable Guides</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <MessageCircle className="h-3 w-3 text-blue-400" />
                  <span>Live Chat Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <Link to="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">FastGen API Docs</span>
                  <Award className="h-4 w-4 text-yellow-400" />
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Complete API reference, SDKs, and integration examples for developers
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Download className="h-3 w-3" />
                    <span>SDK Downloads</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Code className="h-3 w-3" />
                    <span>Code Examples</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Interactive Docs</span>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span>REST API v2.1</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Globe className="h-3 w-3 text-blue-400" />
                  <span>Webhook Support</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Lock className="h-3 w-3 text-blue-400" />
                  <span>OAuth 2.0 Authentication</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Terms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-800">
          {/* Privacy Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">FastGen Privacy Standards</span>
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Your data security and privacy are our top priorities. We follow industry best practices and comply with global regulations.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>GDPR Compliant (EU)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>CCPA Compliant (California)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>End-to-End Encryption</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <p>Last updated: January 15, 2024</p>
                <p>Version: 3.2.1</p>
                <p>Data Processing: AWS, Google Cloud (GDPR compliant)</p>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">FastGen Service Terms</span>
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Clear, transparent terms that protect both users and FastGen while ensuring fair service delivery.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>99.9% Uptime SLA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Flexible Cancellation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Fair Usage Policies</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <p>Last updated: January 15, 2024</p>
                <p>Version: 2.4.0</p>
                <p>Governing Law: California, United States</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2024 FastGen AI, Inc. All rights reserved. | 
            <span className="ml-2">Version 2.1.0</span> | 
            <span className="ml-2">Last updated: January 2024</span>
          </div>
                     <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
             <Link to="/help" className="hover:text-blue-400 transition-colors">System Status</Link>
             <Link to="/help" className="hover:text-blue-400 transition-colors">Accessibility</Link>
             <Link to="/help" className="hover:text-blue-400 transition-colors">Sitemap</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
