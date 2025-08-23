import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Clock, Shield, Users, CreditCard, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const navigate = useNavigate();

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <FileText className="h-5 w-5" />,
      content: `These Terms of Service ("Terms") govern your use of FastGen AI, Inc.'s ("FastGen," "we," "us," or "our") AI content generation platform and services. By accessing or using our services, you agree to be bound by these Terms.

These Terms apply to all users of our platform, including individuals, businesses, and organizations. Please read these Terms carefully before using our services. If you do not agree to these Terms, you should not use our platform.

We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on our website and updating the "Last Updated" date.`
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: <FileText className="h-5 w-5" />,
      content: `**"Service"** means the FastGen AI content generation platform, including our website, mobile applications, APIs, and related services.

**"User," "you," or "your"** means any individual or entity that accesses or uses our Service.

**"Content"** means any text, images, or other materials generated using our AI platform.

**"Subscription"** means a paid plan that provides access to our Service features and capabilities.

**"API"** means our application programming interface that allows you to integrate our services into your applications.

**"Account"** means your user profile and associated data on our platform.`
    },
    {
      id: 'account-registration',
      title: 'Account Registration',
      icon: <Users className="h-5 w-5" />,
      content: `To use our Service, you must create an account and provide accurate, complete, and current information.

**Account Requirements:**
- You must be at least 13 years old to create an account
- Users under 18 must have parental consent
- You must provide a valid email address
- You are responsible for maintaining account security

**Account Security:**
- You are responsible for all activities under your account
- You must keep your login credentials secure
- You must notify us immediately of any unauthorized access
- We may suspend or terminate accounts for security violations

**Account Verification:**
- We may require identity verification for certain features
- Business accounts may require additional verification
- We reserve the right to verify account information
- False or misleading information may result in account termination`
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: <Shield className="h-5 w-5" />,
      content: `You agree to use our Service only for lawful purposes and in accordance with these Terms.

**Permitted Uses:**
- Generating content for legitimate business or personal purposes
- Creating educational materials and documentation
- Developing applications using our API
- Research and development activities
- Content creation for marketing and communications

**Prohibited Uses:**
- Generating illegal, harmful, or offensive content
- Violating intellectual property rights
- Attempting to reverse engineer our platform
- Using our service for spam or harassment
- Violating any applicable laws or regulations

**Content Guidelines:**
- You are responsible for all content you generate
- Content must comply with our community standards
- We may remove or restrict access to inappropriate content
- Repeated violations may result in account termination`
    },
    {
      id: 'subscription-plans',
      title: 'Subscription Plans',
      icon: <CreditCard className="h-5 w-5" />,
      content: `We offer various subscription plans with different features and usage limits.

**Plan Types:**
- Free Plan: Basic features with limited usage
- Pro Plan: Advanced features with higher limits
- Enterprise Plan: Custom features and dedicated support
- API Plans: Developer-focused pricing tiers

**Billing and Payment:**
- Subscriptions are billed in advance on a recurring basis
- Payment is processed securely through our payment partners
- Prices are subject to change with 30 days notice
- Failed payments may result in service suspension

**Usage Limits:**
- Each plan has specific usage quotas and restrictions
- Exceeding limits may result in additional charges
- We may throttle or suspend service for excessive usage
- Enterprise customers may have custom limits and pricing

**Plan Changes:**
- You may upgrade or downgrade your plan at any time
- Plan changes take effect at the next billing cycle
- Downgrading may result in loss of features or data
- Refunds are provided according to our refund policy`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Shield className="h-5 w-5" />,
      content: `Our Service and platform are protected by intellectual property laws.

**Our Rights:**
- FastGen retains all rights to our platform and technology
- Our trademarks, logos, and branding are protected
- The Service design and functionality are proprietary
- We own all improvements and modifications to our platform

**Your Rights:**
- You retain ownership of content you generate
- You may use generated content for your intended purposes
- You grant us a license to improve our AI models
- You may not claim ownership of our platform or technology

**Content Licensing:**
- Generated content is licensed for your use
- You may not resell or redistribute our service
- Commercial use requires appropriate subscription
- Attribution may be required for certain content types

**Third-Party Content:**
- We respect third-party intellectual property rights
- You must ensure you have rights to use source materials
- We may remove content that violates IP rights
- DMCA procedures are available for copyright claims`
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data',
      icon: <Shield className="h-5 w-5" />,
      content: `Your privacy is important to us. Our data practices are governed by our Privacy Policy.

**Data Collection:**
- We collect information necessary to provide our Service
- Usage data helps us improve our platform
- Personal information is handled according to our Privacy Policy
- You control what information you share with us

**Data Security:**
- We implement industry-standard security measures
- Data is encrypted in transit and at rest
- Access to your data is strictly controlled
- We regularly audit our security practices

**Data Usage:**
- Your data is used to provide and improve our Service
- We may use anonymized data for research and development
- We do not sell your personal information
- Data sharing is limited to what's necessary for service delivery

**Your Rights:**
- You can access, correct, or delete your data
- You can export your data in standard formats
- You can request data processing restrictions
- You can withdraw consent for data processing`
    },
    {
      id: 'service-availability',
      title: 'Service Availability',
      icon: <Clock className="h-5 w-5" />,
      content: `We strive to provide reliable service but cannot guarantee 100% uptime.

**Service Level Agreement:**
- Pro and Enterprise plans include uptime guarantees
- Free plans have no uptime guarantees
- Planned maintenance is scheduled during low-usage periods
- Emergency maintenance may occur without notice

**Uptime Targets:**
- Pro Plan: 99.5% uptime (approximately 3.6 hours downtime per month)
- Enterprise Plan: 99.9% uptime (approximately 43 minutes downtime per month)
- Actual uptime may vary based on circumstances
- Credits are provided for failure to meet SLA targets

**Maintenance and Updates:**
- Regular updates improve security and functionality
- We provide advance notice for planned maintenance
- Emergency updates may be deployed immediately
- Service may be temporarily unavailable during updates

**Force Majeure:**
- We are not liable for service interruptions beyond our control
- Natural disasters, government actions, or third-party failures
- We will work to restore service as quickly as possible
- Extended outages may result in service credits`
    },
    {
      id: 'limitations-liability',
      title: 'Limitations of Liability',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `Our liability is limited as described in these Terms.

**Liability Limits:**
- Our total liability is limited to the amount you paid in the 12 months preceding the claim
- We are not liable for indirect, incidental, or consequential damages
- We are not liable for lost profits, data, or business opportunities
- Free plan users have no liability protection

**Exclusions:**
- We are not liable for content generated using our Service
- We are not liable for third-party actions or content
- We are not liable for security incidents beyond our reasonable control
- We are not liable for force majeure events

**Indemnification:**
- You agree to indemnify us against claims arising from your use
- You are responsible for content you generate
- You must defend us against third-party claims
- You must reimburse us for reasonable legal expenses

**Dispute Resolution:**
- Disputes are resolved through binding arbitration
- Class action lawsuits are not permitted
- Small claims court actions are allowed
- Governing law is California, United States`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: `Either party may terminate this agreement under certain circumstances.

**Termination by You:**
- You may cancel your subscription at any time
- Cancellation takes effect at the end of the billing period
- You may delete your account and data
- No refunds are provided for partial periods

**Termination by Us:**
- We may terminate for violation of these Terms
- We may terminate for non-payment or fraud
- We may terminate with 30 days notice for business reasons
- Immediate termination for serious violations

**Effect of Termination:**
- Your access to the Service will end
- Your data will be deleted according to our retention policy
- Outstanding payments remain due
- You must cease all use of our Service

**Data Retention:**
- Account data is deleted within 30 days
- Generated content may be retained longer for legal compliance
- You may request immediate deletion
- Backup data may be retained for security purposes`
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <FileText className="h-5 w-5" />,
      content: `These Terms are governed by the laws of California, United States.

**Jurisdiction:**
- Disputes are resolved in California courts
- You consent to personal jurisdiction in California
- Federal courts have concurrent jurisdiction
- International users agree to California jurisdiction

**Arbitration:**
- Disputes are resolved through binding arbitration
- American Arbitration Association rules apply
- Arbitration is conducted in San Francisco, California
- Arbitrator decisions are final and binding

**Class Action Waiver:**
- You waive the right to participate in class actions
- Claims must be brought individually
- No consolidation of claims is permitted
- This waiver is enforceable under applicable law

**Severability:**
- If any provision is found unenforceable, others remain in effect
- Unenforceable provisions are modified to be enforceable
- The intent of these Terms is preserved
- Invalid provisions do not affect the entire agreement`
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
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Last updated: Jan 15, 2024</span>
              </span>
              <span className="flex items-center space-x-1">
                <FileText className="h-4 w-4 text-green-500" />
                <span>Version: 2.4.0</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Important Notice */}
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 mb-3">
                  By using FastGen's services, you agree to be bound by these Terms of Service. 
                  Please read them carefully and contact us if you have any questions.
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Legally Binding</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Updates Notified</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Dispute Resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About These Terms?</h3>
          <p className="text-gray-600 mb-6">
            We're here to help clarify any questions about our Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Contact Legal Team</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-5 w-5" />
              <span>Request Clarification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
