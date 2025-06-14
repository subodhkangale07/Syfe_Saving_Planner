import  { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import ContributionModal from './components/ContributionModal';
import LoadingSpinner from './components/LoadingSpinner';
import AddGoalModal from './components/AddGoalModal';
import { fetchExchangeRate } from './utils/api';


const EXCHANGE_API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

function App() {
  const [goals, setGoals] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load goals from localStorage on component mount
  useEffect(() => {
    try {
      console.log('Loading data from localStorage...');
      
      // Load goals
      const savedGoals = localStorage.getItem('savingsGoals');
      console.log('Saved goals raw:', savedGoals);
      
      if (savedGoals && savedGoals !== 'undefined' && savedGoals !== 'null') {
        const parsedGoals = JSON.parse(savedGoals);
        console.log('Parsed goals:', parsedGoals);
        
        if (Array.isArray(parsedGoals)) {
          setGoals(parsedGoals);
          console.log(`Loaded ${parsedGoals.length} goals from localStorage`);
        }
      }
      
      // Load exchange rate data
      const savedRate = localStorage.getItem('exchangeRate');
      const savedTimestamp = localStorage.getItem('lastUpdated');
      
      if (savedRate && savedTimestamp) {
        setExchangeRate(parseFloat(savedRate));
        setLastUpdated(new Date(savedTimestamp));
        console.log('Loaded exchange rate:', savedRate);
      } else {
        fetchExchangeRateData();
      }
      
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setIsDataLoaded(true);
      // If there's an error, still try to fetch exchange rate
      fetchExchangeRateData();
    }
  }, []);

  // Save goals to localStorage whenever goals change (but only after initial load)
  useEffect(() => {
    if (isDataLoaded && goals.length >= 0) {
      try {
        console.log('Saving goals to localStorage:', goals);
        localStorage.setItem('savingsGoals', JSON.stringify(goals));
        console.log('Successfully saved goals to localStorage');
      } catch (error) {
        console.error('Error saving goals to localStorage:', error);
        setError('Failed to save data locally');
      }
    }
  }, [goals, isDataLoaded]);

  const fetchExchangeRateData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rate = await fetchExchangeRate(EXCHANGE_API_KEY);
      setExchangeRate(rate);
      const now = new Date();
      setLastUpdated(now);
      
      // Cache the rate and timestamp
      localStorage.setItem('exchangeRate', rate.toString());
      localStorage.setItem('lastUpdated', now.toISOString());
      console.log('Exchange rate updated:', rate);
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err);
      setError('Failed to fetch exchange rate');
      
      // Use fallback rate if API fails
      if (!exchangeRate) {
        setExchangeRate(83.5); // Fallback rate
        setLastUpdated(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      saved: 0,
      contributions: [],
      createdAt: new Date().toISOString()
    };
    
    console.log('Adding new goal:', newGoal);
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    setIsAddGoalModalOpen(false);
    
    // Show success message
    console.log('Goal added successfully!');
  };

  const addContribution = (goalId, contribution) => {
    console.log('Adding contribution:', contribution, 'to goal:', goalId);
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedContributions = [...goal.contributions, contribution];
        const totalSaved = updatedContributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        
        const updatedGoal = {
          ...goal,
          contributions: updatedContributions,
          saved: totalSaved
        };
        
        console.log('Updated goal:', updatedGoal);
        return updatedGoal;
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    setIsContributionModalOpen(false);
    setSelectedGoal(null);
  };

  const deleteGoal = (goalId) => {
    console.log('Deleting goal:', goalId);
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
  };

  const openContributionModal = (goal) => {
    setSelectedGoal(goal);
    setIsContributionModalOpen(true);
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('=== LocalStorage Debug ===');
    console.log('Goals in state:', goals);
    console.log('Goals in localStorage:', localStorage.getItem('savingsGoals'));
    console.log('Exchange rate in localStorage:', localStorage.getItem('exchangeRate'));
    console.log('Last updated in localStorage:', localStorage.getItem('lastUpdated'));
    console.log('========================');
  };

  // Calculate dashboard totals
  const calculateTotals = () => {
    if (goals.length === 0) {
      return { totalTarget: 0, totalSaved: 0, overallProgress: 0 };
    }

    const totalTarget = goals.reduce((sum, goal) => {
      const targetInINR = goal.currency === 'USD' ? goal.target * (exchangeRate || 83.5) : goal.target;
      return sum + targetInINR;
    }, 0);

    const totalSaved = goals.reduce((sum, goal) => {
      const savedInINR = goal.currency === 'USD' ? goal.saved * (exchangeRate || 83.5) : goal.saved;
      return sum + savedInINR;
    }, 0);

    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return { totalTarget, totalSaved, overallProgress };
  };

  const { totalTarget, totalSaved, overallProgress } = calculateTotals();

  // Don't render until data is loaded
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your savings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Syfe Savings Planner</h1>
          </div>
          <p className="text-gray-600">Track your financial goals and build your future</p>
          
          {/* Debug button (remove in production) */}
          <button
            onClick={debugLocalStorage}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Debug Storage
          </button>
        </div>

        {/* Dashboard */}
        <Dashboard
          totalTarget={totalTarget}
          totalSaved={totalSaved}
          overallProgress={overallProgress}
          exchangeRate={exchangeRate}
          lastUpdated={lastUpdated}
          onRefreshRate={fetchExchangeRateData}
          isLoading={isLoading}
          error={error}
        />

        {/* Goals Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Goals ({goals.length})
          </h2>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">+</span>
            Add Goal
          </button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No goals yet</h3>
            <p className="text-gray-500 mb-6">Create your first savings goal to get started!</p>
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                exchangeRate={exchangeRate || 83.5}
                onAddContribution={() => openContributionModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
              />
            ))}
          </div>
        )}

        {/* Data persistence indicator */}
        {goals.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ✅ Your data is automatically saved locally
            </p>
          </div>
        )}

        {/* Modals */}
        {isAddGoalModalOpen && (
          <AddGoalModal
            onClose={() => setIsAddGoalModalOpen(false)}
            onSubmit={addGoal}
          />
        )}

        {isContributionModalOpen && selectedGoal && (
          <ContributionModal
            goal={selectedGoal}
            onClose={() => {
              setIsContributionModalOpen(false);
              setSelectedGoal(null);
            }}
            onSubmit={(contribution) => addContribution(selectedGoal.id, contribution)}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && <LoadingSpinner />}
        
        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}


        <div>

        </div>
      </div>
    </div>
  );
}

export default App;