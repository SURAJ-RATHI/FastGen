import { useState } from 'react';
import { Search, BookOpen, Video, MessageCircle, Download, Star, Users, Clock, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['getting-started']));
  const navigate = useNavigate();

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      articles: [
        { title: 'Welcome to FastGen', description: 'Learn the basics of using FastGen AI', readTime: '3 min', popular: true },
        { title: 'Creating Your First Project', description: 'Step-by-step guide to start your first AI project', readTime: '5 min', popular: true },
        { title: 'Understanding AI Models', description: 'Overview of available AI models and their capabilities', readTime: '4 min', popular: false },
        { title: 'Account Setup & Settings', description: 'Configure your account preferences and settings', readTime: '3 min', popular: false }
      ]
    },
    {
      id: 'ai-content-generation',
      title: 'AI Content Generation',
      icon: <Star className="h-5 w-5" />,
      articles: [
        { title: 'Text Generation Best Practices', description: 'Tips for creating high-quality AI-generated content', readTime: '6 min', popular: true },
        { title: 'Content Templates', description: 'Using and customizing pre-built content templates', readTime: '4 min', popular: true },
        { title: 'Content Editing & Refinement', description: 'How to edit and improve AI-generated content', readTime: '5 min', popular: false },
        { title: 'Content Export Options', description: 'Different ways to export your generated content', readTime: '3 min', popular: false }
      ]
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Automation',
      icon: <Clock className="h-5 w-5" />,
      articles: [
        { title: 'Setting Up Automated Workflows', description: 'Create automated content generation pipelines', readTime: '7 min', popular: true },
        { title: 'Workflow Triggers & Conditions', description: 'Configure when and how workflows run', readTime: '5 min', popular: false },
        { title: 'Monitoring & Analytics', description: 'Track workflow performance and metrics', readTime: '4 min', popular: false }
      ]
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      icon: <Users className="h-5 w-5" />,
      articles: [
        { title: 'API Authentication', description: 'Setting up API keys and authentication', readTime: '4 min', popular: true },
        { title: 'API Endpoints Reference', description: 'Complete list of available API endpoints', readTime: '8 min', popular: true },
        { title: 'SDK Installation & Setup', description: 'Install and configure FastGen SDKs', readTime: '3 min', popular: false },
        { title: 'Webhook Configuration', description: 'Set up webhooks for real-time notifications', readTime: '5 min', popular: false }
      ]
    }
  ];

  const popularArticles = helpCategories
    .flatMap(category => category.articles.filter(article => article.popular))
    .slice(0, 6);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>50K+ users helped</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How can we help you today?
            </h2>
            <p className="text-gray-600 mb-6">
              Search our knowledge base or browse categories to find the answers you need
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help articles, tutorials, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        {searchQuery === '' && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.readTime} read</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedCategories.has(category.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {category.articles.map((article, index) => (
                      <div key={index} className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          {article.popular && <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 ml-2" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.readTime} read</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>Contact Support</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Video className="h-5 w-5" />
              <span>Schedule a Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
