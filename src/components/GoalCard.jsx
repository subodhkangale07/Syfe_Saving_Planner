import React, { useState } from 'react';

const GoalCard = ({ goal, exchangeRate, onAddContribution, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (amount, currency) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    } else {
      return `$${amount.toLocaleString('en-US')}`;
    }
  };

  const getConvertedAmount = (amount, fromCurrency) => {
    if (fromCurrency === 'USD') {
      return amount * exchangeRate;
    } else {
      return amount / exchangeRate;
    }
  };

  const getConvertedCurrency = (currency) => {
    return currency === 'USD' ? 'INR' : 'USD';
  };

  const progress = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
  const remaining = Math.max(goal.target - goal.saved, 0);

  const convertedTarget = getConvertedAmount(goal.target, goal.currency);
  const convertedCurrency = getConvertedCurrency(goal.currency);

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{goal.name}</h3>
          <div className="text-sm text-gray-500">
            {progress.toFixed(0)}% complete
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`p-2 rounded-full transition-colors ${
            showDeleteConfirm 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
          title={showDeleteConfirm ? 'Click again to confirm' : 'Delete goal'}
        >
          {showDeleteConfirm ? '⚠️' : '🗑️'}
        </button>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {formatCurrency(goal.target, goal.currency)}
        </div>
        <div className="text-sm text-gray-500">
          ≈ {formatCurrency(convertedTarget, convertedCurrency)}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {formatCurrency(goal.saved, goal.currency)} saved
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`rounded-full h-2 transition-all duration-500 ${getProgressColor(progress)}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{goal.contributions.length} contributions</span>
          <span>{formatCurrency(remaining, goal.currency)} remaining</span>
        </div>
      </div>

      {goal.contributions.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Recent Contributions</div>
          <div className="space-y-1">
            {goal.contributions.slice(-2).map((contribution, index) => (
              <div key={index} className="flex justify-between text-xs text-gray-600">
                <span>{new Date(contribution.date).toLocaleDateString()}</span>
                <span className="font-medium">
                  +{formatCurrency(contribution.amount, goal.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onAddContribution}
        className="w-full bg-green-50 text-green-600 border border-green-200 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center font-medium"
      >
        <span className="mr-2">+</span>
        Add Contribution
      </button>

      {progress >= 100 && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            🎉 Goal Achieved!
          </span>
        </div>
      )}
    </div>
  );
};

export default GoalCard;