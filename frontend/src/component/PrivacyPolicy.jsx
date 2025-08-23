import { useState } from 'react';
import { Shield, CheckCircle, Lock, Eye, Database, Globe, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const navigate = useNavigate();

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <Shield className="h-5 w-5" />,
      content: `FastGen AI, Inc. ("FastGen," "we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI content generation platform and services.

Our privacy practices are designed to comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) in the European Union and the California Consumer Privacy Act (CCPA) in California.`
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Database className="h-5 w-5" />,
      content: `We collect information you provide directly to us and information we obtain automatically when you use our services.

**Information You Provide:**
- Account information (name, email, company)
- Payment and billing information
- Content you generate using our platform
- Communications with our support team
- Feedback and survey responses

**Information We Collect Automatically:**
- Usage data and analytics
- Device and browser information
- IP address and location data
- Cookies and similar technologies
- API usage patterns and performance metrics`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: <Eye className="h-5 w-5" />,
      content: `We use the information we collect to:

**Provide and Improve Our Services:**
- Process your requests and generate content
- Maintain and improve our AI models
- Develop new features and functionality
- Ensure platform security and performance

**Communication and Support:**
- Respond to your inquiries and support requests
- Send important service updates and notifications
- Provide customer service and technical support
- Send marketing communications (with your consent)

**Legal and Security:**
- Comply with applicable laws and regulations
- Protect against fraud and abuse
- Enforce our terms of service
- Respond to legal requests and investigations`
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      icon: <Globe className="h-5 w-5" />,
      content: `We do not sell, rent, or trade your personal information to third parties. We may share your information in the following circumstances:

**Service Providers:**
- Cloud hosting and infrastructure providers
- Payment processors and billing services
- Analytics and monitoring services
- Customer support and communication tools

**Legal Requirements:**
- When required by law or legal process
- To protect our rights and property
- In emergency situations involving public safety
- To prevent fraud and abuse

**Business Transfers:**
- In connection with a merger or acquisition
- During bankruptcy or similar proceedings
- As part of asset sales or transfers

**With Your Consent:**
- When you explicitly authorize sharing
- For integrations with third-party services
- For research and development purposes`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="h-5 w-5" />,
      content: `We implement comprehensive security measures to protect your information:

**Technical Safeguards:**
- End-to-end encryption for data in transit
- AES-256 encryption for data at rest
- Multi-factor authentication (MFA)
- Regular security audits and penetration testing
- SOC 2 Type II compliance

**Access Controls:**
- Role-based access controls
- Principle of least privilege
- Regular access reviews and audits
- Secure development practices
- Employee security training

**Monitoring and Response:**
- 24/7 security monitoring
- Intrusion detection and prevention
- Incident response procedures
- Regular security assessments
- Vulnerability management program`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <Database className="h-5 w-5" />,
      content: `We retain your information for as long as necessary to provide our services and comply with legal obligations:

**Account Information:**
- Active accounts: Duration of account plus 7 years
- Inactive accounts: 2 years after last activity
- Deleted accounts: 30 days (with option for immediate deletion)

**Generated Content:**
- User content: Until account deletion or 7 years
- Analytics data: 2 years after collection
- Log files: 90 days for security and debugging

**Legal Requirements:**
- Tax records: 7 years
- Financial transactions: 7 years
- Legal disputes: Duration of proceedings plus 7 years

**Data Deletion:**
- You can request immediate deletion of your data
- We will delete data within 30 days of request
- Some data may be retained for legal compliance`
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: <CheckCircle className="h-5 w-5" />,
      content: `Depending on your location, you have certain rights regarding your personal information:

**Access and Portability:**
- Request a copy of your personal information
- Receive data in a portable format
- Know what information we have about you
- Understand how we use your information

**Correction and Updates:**
- Correct inaccurate information
- Update your account details
- Modify your preferences and settings
- Request data rectification

**Deletion and Restriction:**
- Delete your account and data
- Restrict processing of your information
- Object to certain uses of your data
- Withdraw consent for processing

**Contact Us:**
- Email: privacy@fastgen.ai
- Phone: +1 (555) 123-4567
- Address: FastGen AI, Inc., San Francisco, CA`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <Eye className="h-5 w-5" />,
      content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
- Authentication and security
- Session management
- Platform functionality
- Cannot be disabled

**Analytics Cookies:**
- Usage analytics and insights
- Performance monitoring
- Feature improvement
- Can be disabled in settings

**Marketing Cookies:**
- Personalized content and ads
- Campaign effectiveness
- User engagement metrics
- Require explicit consent

**Cookie Management:**
- Control cookies in your browser settings
- Use our cookie preference center
- Opt out of non-essential cookies
- Clear cookies at any time`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: <Globe className="h-5 w-5" />,
      content: `Your information may be transferred to and processed in countries other than your own:

**Data Processing Locations:**
- Primary: United States (AWS, Google Cloud)
- Backup: European Union (GDPR compliant)
- Support: Global (with appropriate safeguards)

**Transfer Safeguards:**
- Standard Contractual Clauses (SCCs)
- Adequacy decisions by relevant authorities
- Binding corporate rules where applicable
- Privacy Shield compliance (where relevant)

**Legal Basis:**
- Performance of contract
- Legitimate business interests
- Your explicit consent
- Legal obligations

**Your Rights:**
- Request information about transfers
- Object to specific transfers
- Request data localization
- Contact supervisory authorities`
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      icon: <Shield className="h-5 w-5" />,
      content: `Our services are not intended for children under 13 years of age:

**Age Restrictions:**
- Minimum age: 13 years old
- Parental consent required for users under 18
- No intentional collection from children
- Immediate deletion if discovered

**Protection Measures:**
- Age verification during registration
- Content filtering and moderation
- Parental controls and restrictions
- Educational resources for safe use

**Parental Rights:**
- Review and delete child's information
- Revoke consent at any time
- Request data portability
- Contact us for assistance

**Compliance:**
- Children's Online Privacy Protection Act (COPPA)
- Family Educational Rights and Privacy Act (FERPA)
- Applicable state and international laws
- Regular compliance audits`
    },
    {
      id: 'updates',
      title: 'Updates to This Policy',
      icon: <CheckCircle className="h-5 w-5" />,
      content: `We may update this Privacy Policy from time to time:

**Notification Process:**
- Email notifications for significant changes
- In-app notifications and banners
- Updated date displayed on policy page
- 30-day advance notice for material changes

**Review and Consent:**
- Review updated policy before continuing
- Accept new terms to continue using services
- Option to decline and close account
- Historical versions available upon request

**Material Changes:**
- Changes to data collection practices
- New data sharing arrangements
- Updates to user rights and choices
- Changes to data retention policies

**Contact Information:**
- Questions about policy updates
- Request for policy changes
- Feedback and suggestions
- Legal inquiries and concerns`
    }
  ];

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Last updated: Jan 15, 2024</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Version: 3.2.1</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Compliance Badges */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">GDPR Compliant</h3>
              <p className="text-sm text-green-600">EU Data Protection</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">CCPA Compliant</h3>
              <p className="text-sm text-blue-600">California Privacy</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800">SOC 2 Type II</h3>
              <p className="text-sm text-purple-600">Security Certified</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800">ISO 27001</h3>
              <p className="text-sm text-orange-600">Information Security</p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4 prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Privacy?</h3>
          <p className="text-gray-600 mb-6">
            We're committed to transparency and protecting your privacy. Contact us if you have any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Shield className="h-5 w-5" />
              <span>Contact Privacy Team</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Database className="h-5 w-5" />
              <span>Request Data Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
