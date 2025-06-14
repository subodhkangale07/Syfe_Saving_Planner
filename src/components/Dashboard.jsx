import DataExport from './DataExport';

const Dashboard = ({ 
  totalTarget, 
  totalSaved, 
  overallProgress, 
  exchangeRate, 
  lastUpdated, 
  onRefreshRate, 
  isLoading, 
  error 
}) => {
  const formatCurrency = (amount, currency = 'INR') => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    } else {
      return `$${amount.toLocaleString('en-US')}`;
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">📊</span>
          </div>
          <h2 className="text-xl font-semibold">Financial Overview</h2>
        </div>
        <div>
          <DataExport/>
        </div>
        <button
          onClick={onRefreshRate}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isLoading 
              ? 'bg-white bg-opacity-10 cursor-not-allowed' 
              : 'bg-white bg-opacity-20 hover:bg-opacity-30'
          }`}
        >
          <span className={`mr-2 ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
          Refresh Rates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">🎯</span>
            <span className="text-sm opacity-90">Total Targets</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalTarget)}</div>
          <div className="text-sm opacity-75">All goals combined</div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">💰</span>
            <span className="text-sm opacity-90">Total Saved</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalSaved)}</div>
          <div className="text-sm opacity-75">Across all goals</div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">📈</span>
            <span className="text-sm opacity-90">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
          <div className="text-sm opacity-75">Total goals completion</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white bg-opacity-10 rounded-lg p-4">
        <div className="mb-2 md:mb-0">
          <div className="flex items-center">
            <span className="mr-2">💱</span>
            <span className="font-medium">
              Exchange Rate: 1 USD = {exchangeRate ? `₹${exchangeRate.toFixed(2)}` : 'Loading...'}
            </span>
          </div>
          {error && (
            <div className="text-red-200 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {error} (using fallback rate)
            </div>
          )}
        </div>
        <div className="text-sm opacity-75">
          Last updated: {formatDateTime(lastUpdated)}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm opacity-90">Overall Completion</span>
          <span className="text-sm font-medium">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;