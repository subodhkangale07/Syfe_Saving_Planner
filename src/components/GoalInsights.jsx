const GoalInsights = ({ goals, exchangeRate }) => {
  const calculateInsights = () => {
    if (!goals || goals.length === 0) {
      return {
        avgContribution: 0,
        daysActive: 0,
        projectedCompletion: null,
        suggestedMonthly: 0,
        streak: 0,
        totalContributions: 0,
        totalSaved: 0,
        totalTarget: 0,
        overallProgress: 0
      };
    }

    const allContributions = goals.flatMap(goal => 
      goal.contributions?.map(contrib => ({
        ...contrib,
        goalId: goal.id,
        goalCurrency: goal.currency
      })) || []
    );

    if (allContributions.length === 0) {
      return {
        avgContribution: 0,
        daysActive: 0,
        projectedCompletion: null,
        suggestedMonthly: 0,
        streak: 0,
        totalContributions: 0,
        totalSaved: 0,
        totalTarget: 0,
        overallProgress: 0
      };
    }

    const sortedContributions = [...allContributions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const totalSaved = goals.reduce((sum, goal) => {
      const savedInINR = goal.currency === 'USD' ? (goal.saved || 0) * exchangeRate : (goal.saved || 0);
      return sum + savedInINR;
    }, 0);

    const totalTarget = goals.reduce((sum, goal) => {
      const targetInINR = goal.currency === 'USD' ? goal.target * exchangeRate : goal.target;
      return sum + targetInINR;
    }, 0);

    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    const totalContributionsValue = allContributions.reduce((sum, c) => {
      const amountInINR = c.goalCurrency === 'USD' ? c.amount * exchangeRate : c.amount;
      return sum + amountInINR;
    }, 0);
    const avgContribution = totalContributionsValue / allContributions.length;

    const firstContribution = new Date(sortedContributions[0].date);
    const lastContribution = new Date(sortedContributions[sortedContributions.length - 1].date);
    const daysActive = Math.max(1, Math.ceil((lastContribution - firstContribution) / (1000 * 60 * 60 * 24)));

    const dailyRate = totalContributionsValue / daysActive;
    const remaining = totalTarget - totalSaved;
    const daysToComplete = remaining > 0 ? Math.ceil(remaining / dailyRate) : 0;
    const projectedCompletion = daysToComplete > 0 ? 
      new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000) : null;

    const suggestedMonthly = remaining > 0 ? Math.ceil(remaining / 12) : 0;

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today - i * 24 * 60 * 60 * 1000);
      const hasContribution = allContributions.some(c => 
        new Date(c.date).toDateString() === checkDate.toDateString()
      );
      if (hasContribution) streak++;
      else break;
    }

    return {
      avgContribution,
      daysActive,
      projectedCompletion,
      suggestedMonthly,
      streak,
      totalContributions: allContributions.length,
      totalSaved,
      totalTarget,
      overallProgress
    };
  };

  const insights = calculateInsights();

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          📊 Overall Insights
        </h3>
        <div className="text-sm text-gray-500">
          {insights.totalContributions} total contributions across {goals.length} goals
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium">Avg Contribution</div>
          <div className="text-2xl font-bold text-blue-800">
            {formatCurrency(insights.avgContribution)}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm font-medium">Days Active</div>
          <div className="text-2xl font-bold text-green-800">
            {insights.daysActive}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium flex items-center">
            🔥 Streak
          </div>
          <div className="text-2xl font-bold text-orange-800">
            {insights.streak} days
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-purple-600 text-sm font-medium">Overall Progress</div>
          <div className="text-2xl font-bold text-purple-800">
            {insights.overallProgress.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-3">Smart Projections</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.projectedCompletion && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">📅 Projected Completion:</span>
              <span className="font-medium text-gray-800">
                {formatDate(insights.projectedCompletion)}
              </span>
            </div>
          )}
          
          {insights.suggestedMonthly > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">💡 Suggested Monthly:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(insights.suggestedMonthly)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{formatCurrency(insights.totalSaved)} of {formatCurrency(insights.totalTarget)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(insights.overallProgress, 100)}%` }}
          />
          {insights.overallProgress >= 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">🎉 ALL GOALS COMPLETED!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalInsights;