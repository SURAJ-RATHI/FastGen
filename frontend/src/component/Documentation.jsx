import { useState } from 'react';
import { BookOpen, Code, Download, Globe, Lock, Zap, ArrowRight, ChevronDown, ChevronRight, Copy, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState(new Set(['authentication']));
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'api', label: 'API Reference', icon: <Code className="h-4 w-4" /> },
    { id: 'sdks', label: 'SDKs & Libraries', icon: <Download className="h-4 w-4" /> },
    { id: 'examples', label: 'Code Examples', icon: <Zap className="h-4 w-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Globe className="h-4 w-4" /> }
  ];

  const apiEndpoints = [
    {
      id: 'authentication',
      title: 'Authentication',
      description: 'Learn how to authenticate your API requests',
      content: `# Authentication

FastGen uses OAuth 2.0 for API authentication. You'll need to obtain an API key from your dashboard.

## API Key Authentication

Include your API key in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.fastgen.ai/v2/content/generate
\`\`\`

## Rate Limits

- Free tier: 100 requests/hour
- Pro tier: 1,000 requests/hour
- Enterprise: Custom limits`
    },
    {
      id: 'content-generation',
      title: 'Content Generation',
      description: 'Generate AI content using our powerful models',
      content: `# Content Generation

Generate high-quality content using FastGen's AI models.

## Generate Text

\`\`\`bash
POST /v2/content/generate
\`\`\`

### Request Body

\`\`\`json
{
  "model": "fastgen-pro",
  "prompt": "Write a blog post about AI trends",
  "max_tokens": 1000,
  "temperature": 0.7
}
\`\`\`

### Response

\`\`\`json
{
  "id": "gen_123456",
  "content": "Generated content here...",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 150,
    "total_tokens": 165
  }
}
\`\`\``
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Use and customize pre-built content templates',
      content: `# Templates

FastGen provides pre-built templates for common content types.

## List Templates

\`\`\`bash
GET /v2/templates
\`\`\`

## Use Template

\`\`\`bash
POST /v2/templates/{template_id}/generate
\`\`\`

### Available Templates

- Blog Posts
- Social Media Content
- Product Descriptions
- Email Campaigns
- Technical Documentation`
    }
  ];

  const sdks = [
    {
      name: 'JavaScript/Node.js',
      version: 'v2.1.0',
      description: 'Official JavaScript SDK for Node.js and browsers',
      install: 'npm install @fastgen/sdk',
      downloadUrl: '#',
      popular: true
    },
    {
      name: 'Python',
      version: 'v2.0.5',
      description: 'Python SDK with async support and type hints',
      install: 'pip install fastgen-sdk',
      downloadUrl: '#',
      popular: true
    },
    {
      name: 'React',
      version: 'v1.8.2',
      description: 'React hooks and components for FastGen',
      install: 'npm install @fastgen/react',
      downloadUrl: '#',
      popular: false
    },
    {
      name: 'PHP',
      version: 'v1.9.1',
      description: 'PHP SDK with Laravel integration support',
      install: 'composer require fastgen/sdk',
      downloadUrl: '#',
      popular: false
    }
  ];

  const codeExamples = [
    {
      title: 'Generate Blog Post',
      language: 'javascript',
      code: `import { FastGen } from '@fastgen/sdk';

const fastgen = new FastGen('your-api-key');

const blogPost = await fastgen.content.generate({
  model: 'fastgen-pro',
  prompt: 'Write a blog post about AI trends in 2024',
  maxTokens: 1000,
  temperature: 0.7
});

console.log(blogPost.content);`
    },
    {
      title: 'Use Template',
      language: 'python',
      code: `from fastgen import FastGen

fastgen = FastGen('your-api-key')

response = fastgen.templates.generate(
    template_id='blog-post',
    variables={
        'topic': 'AI Trends',
        'tone': 'Professional',
        'length': 'Medium'
    }
)

print(response.content)`
    },
    {
      title: 'Webhook Handler',
      language: 'javascript',
      code: `app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'content.completed') {
    console.log('Content generation completed:', data.id);
    // Process the generated content
  }
  
  res.status(200).send('OK');
});`
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

  const copyToClipboard = (code, title) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(title);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FastGen Documentation</h2>
              <p className="text-gray-600 mb-6">
                FastGen provides powerful AI content generation capabilities through a simple and intuitive API. 
                This documentation will help you get started quickly and make the most of our platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Code className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">RESTful API</h3>
                  <p className="text-sm text-gray-600">Simple HTTP endpoints for all FastGen features</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Download className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">SDKs & Libraries</h3>
                  <p className="text-sm text-gray-600">Official SDKs for popular programming languages</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Globe className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Webhooks</h3>
                  <p className="text-sm text-gray-600">Real-time notifications for content generation events</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <span className="text-gray-700">Get your API key from the dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <span className="text-gray-700">Install the SDK for your language</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <span className="text-gray-700">Make your first API call</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">API Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Content generation with multiple AI models</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Template-based content creation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Batch processing capabilities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Real-time streaming responses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleSection(endpoint.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{endpoint.title}</h3>
                    <p className="text-sm text-gray-600">{endpoint.description}</p>
                  </div>
                  {expandedSections.has(endpoint.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections.has(endpoint.id) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 prose prose-sm max-w-none">
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.content}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'sdks':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sdks.map((sdk, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{sdk.name}</h3>
                      <p className="text-sm text-gray-500">v{sdk.version}</p>
                    </div>
                    {sdk.popular && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{sdk.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <code className="text-sm text-gray-800">{sdk.install}</code>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Docs</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{example.title}</h3>
                  <p className="text-sm text-gray-600">Language: {example.language}</p>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(example.code, example.title)}
                      className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copiedCode === example.title ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <pre className="bg-gray-50 text-gray-900 border border-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'webhooks':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Overview</h3>
              <p className="text-gray-600 mb-4">
                Webhooks allow you to receive real-time notifications when events occur in FastGen. 
                This is useful for building integrations and automating workflows.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Events</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">content.completed</span>
                    <p className="text-sm text-gray-600">Content generation has finished</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">content.failed</span>
                    <p className="text-sm text-gray-600">Content generation has failed</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">usage.limit_reached</span>
                    <p className="text-sm text-gray-600">API usage limit has been reached</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Setup</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">1. Configure Webhook URL</h4>
                  <p className="text-sm text-gray-600">Set your webhook endpoint URL in the FastGen dashboard</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">2. Verify Webhook</h4>
                  <p className="text-sm text-gray-600">FastGen will send a verification request to confirm your endpoint</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">3. Handle Events</h4>
                  <p className="text-sm text-gray-600">Process incoming webhook payloads in your application</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>v2.1.0</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="h-4 w-4 text-green-500" />
                <span>Last updated: Jan 15, 2024</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Documentation;
