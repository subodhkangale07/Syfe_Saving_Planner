import React, { useState } from 'react';

const GoalTemplates = ({ onSelectTemplate, isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'emergency_fund',
      name: 'Emergency Fund',
      description: '6 months of expenses for financial security',
      target: 600000,
      currency: 'INR',
      icon: '🛡️',
      category: 'security',
      color: 'from-blue-500 to-blue-600',
      tips: 'Start with ₹10,000/month. Keep it in a liquid fund for easy access.'
    },
    {
      id: 'japan_trip',
      name: 'Trip to Japan',
      description: 'Dream vacation to the Land of the Rising Sun',
      target: 3000,
      currency: 'USD',
      icon: '🗾',
      category: 'travel',
      color: 'from-pink-500 to-red-500',
      tips: 'Best time to visit: Spring (March-May) or Fall (September-November).'
    },
    {
      id: 'home_down_payment',
      name: 'Home Down Payment',
      description: '20% down payment for your dream home',
      target: 2000000,
      currency: 'INR',
      icon: '🏠',
      category: 'property',
      color: 'from-green-500 to-green-600',
      tips: 'Consider PPF and ELSS for tax benefits while saving.'
    },
    {
      id: 'car_purchase',
      name: 'New Car',
      description: 'Upgrade to your dream vehicle',
      target: 800000,
      currency: 'INR',
      icon: '🚗',
      category: 'lifestyle',
      color: 'from-purple-500 to-purple-600',
      tips: 'Factor in insurance, registration, and maintenance costs.'
    },
    {
      id: 'wedding_fund',
      name: 'Wedding Fund',
      description: 'Perfect celebration for your special day',
      target: 1500000,
      currency: 'INR',
      icon: '💒',
      category: 'lifestyle',
      color: 'from-pink-500 to-purple-500',
      tips: 'Start 2-3 years early. Consider fixed deposits for guaranteed returns.'
    },
    {
      id: 'education_fund',
      name: 'Education Fund',
      description: 'Invest in knowledge and skills',
      target: 25000,
      currency: 'USD',
      icon: '🎓',
      category: 'education',
      color: 'from-indigo-500 to-blue-500',
      tips: 'Research scholarships and education loans as well.'
    },
    {
      id: 'business_startup',
      name: 'Business Startup',
      description: 'Launch your entrepreneurial dreams',
      target: 1000000,
      currency: 'INR',
      icon: '🚀',
      category: 'business',
      color: 'from-orange-500 to-red-500',
      tips: 'Create a detailed business plan first. Consider angel investors too.'
    },
    {
      id: 'gadget_fund',
      name: 'Latest iPhone',
      description: 'Stay updated with the latest technology',
      target: 1200,
      currency: 'USD',
      icon: '📱',
      category: 'technology',
      color: 'from-gray-500 to-gray-600',
      tips: 'Wait for festival sales or consider exchange offers.'
    },
    {
      id: 'europe_trip',
      name: 'Europe Backpacking',
      description: 'Explore the historic cities of Europe',
      target: 4500,
      currency: 'USD',
      icon: '🗼',
      category: 'travel',
      color: 'from-blue-500 to-indigo-500',
      tips: 'Book flights 3-4 months early. Consider Eurail passes.'
    },
    {
      id: 'retirement_fund',
      name: 'Retirement Corpus',
      description: 'Secure your golden years',
      target: 10000000,
      currency: 'INR',
      icon: '🏖️',
      category: 'retirement',
      color: 'from-yellow-500 to-orange-500',
      tips: 'Start early with SIP in mutual funds. Power of compounding!'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'property', name: 'Property', icon: '🏠' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'retirement', name: 'Retirement', icon: '🏖️' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleSelectTemplate = (template) => {
    onSelectTemplate({
      name: template.name,
      target: template.target,
      currency: template.currency,
      category: template.category,
      icon: template.icon
    });
    onClose();
  };

  const formatCurrency = (amount, currency) => {
    return currency === 'USD' 
      ? `$${amount.toLocaleString()}` 
      : `₹${amount.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              ⚡ Quick Start Templates
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">Choose a template to get started quickly</p>
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-xl`}>
                    {template.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(template.target, template.currency)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {template.category}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">💡 Pro Tip:</div>
                  <div className="text-xs text-gray-600">{template.tips}</div>
                </div>

                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Don't see what you're looking for? 
              <button 
                onClick={onClose}
                className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
              >
                Create custom goal
              </button>
            </div>
            <div className="text-xs text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTemplates;