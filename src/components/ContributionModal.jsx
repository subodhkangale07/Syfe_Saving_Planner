import React, { useState, useEffect } from 'react';

const ContributionModal = ({ goal, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const amountInput = document.getElementById('contributionAmount');
    if (amountInput) {
      amountInput.focus();
    }
  }, []);

  const formatCurrency = (amount, currency) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    } else {
      return `$${amount.toLocaleString('en-US')}`;
    }
  };

  const formatDateForComparison = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getGoalCreationDate = () => {
    if (!goal.createdAt) {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() - 30);
      return fallbackDate.toISOString().split('T')[0];
    }
    
    const creationDate = new Date(goal.createdAt);
    return creationDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Contribution amount is required';
    } else if (isNaN(amount)) {
      newErrors.amount = 'Please enter a valid number';
    } else if (amount <= 0) {
      newErrors.amount = 'Contribution amount must be greater than 0';
    } else if (amount > 1000000) {
      newErrors.amount = 'Contribution amount is too large';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = formData.date;
      const today = getTodayDate();
      const goalCreationDate = getGoalCreationDate();
      
      console.log('Date validation:', {
        selectedDate,
        today,
        goalCreationDate,
        goalCreatedAt: goal.createdAt
      });
      
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      } else if (selectedDate < goalCreationDate) {
        newErrors.date = `Date cannot be before goal creation (${goalCreationDate})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const contribution = {
        amount: parseFloat(formData.amount),
        date: formData.date,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      console.log('Submitting contribution:', contribution);
      onSubmit(contribution);
    } catch (error) {
      console.error('Error adding contribution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const progress = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
  const remaining = Math.max(goal.target - goal.saved, 0);

  const maxDate = getTodayDate();
  const minDate = getGoalCreationDate();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Contribution</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 mr-2">🎯</span>
            <h3 className="font-semibold text-blue-800">{goal.name}</h3>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex justify-between">
              <span>Target:</span>
              <span className="font-medium">{formatCurrency(goal.target, goal.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Saved:</span>
              <span className="font-medium">{formatCurrency(goal.saved, goal.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="font-medium">{formatCurrency(remaining, goal.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Progress:</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-4">
          <strong>Debug:</strong> Goal created: {goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : 'No date'} | 
          Min date: {minDate} | Max date: {maxDate}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount ({goal.currency})
            </label>
            <div className="relative">
              <input
                id="contributionAmount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0"
                min="0.01"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">
                  {goal.currency === 'INR' ? '₹' : '$'}
                </span>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="contributionDate" className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Date
            </label>
            <input
              id="contributionDate"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={maxDate}
              min={minDate}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Select a date between {new Date(minDate).toLocaleDateString()} and {new Date(maxDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Add</label>
            <div className="grid grid-cols-3 gap-2">
              {goal.currency === 'INR' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '1000' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '5000' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    ₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '10000' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    ₹10,000
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '50' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    $50
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '100' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    $100
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amount: '250' }));
                      if (errors.amount) {
                        setErrors(prev => ({ ...prev, amount: '' }));
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    $250
                  </button>
                </>
              )}
            </div>
          </div>

          {formData.amount && !errors.amount && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✨</span>
                <div className="text-sm text-green-700">
                  <strong>After this contribution:</strong>
                  <br />
                  Total saved: {formatCurrency(goal.saved + parseFloat(formData.amount), goal.currency)}
                  <br />
                  Progress: {(((goal.saved + parseFloat(formData.amount)) / goal.target) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Contribution'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;