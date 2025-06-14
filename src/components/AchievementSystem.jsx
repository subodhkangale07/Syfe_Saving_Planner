import React, { useState, useEffect } from 'react';

const AchievementSystem = ({ goals, onAchievementUnlocked }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showNotification, setShowNotification] = useState(null);

  const achievements = [
    {
      id: 'first_goal',
      title: 'Goal Setter',
      description: 'Created your first savings goal',
      icon: '🎯',
      condition: (goals) => goals.length >= 1,
      rarity: 'common',
      persistent: false 
    },
    {
      id: 'big_saver',
      title: 'Big Saver',
      description: 'Saved over ₹1,00,000 total',
      icon: '💰',
      condition: (goals) => {
        const totalSaved = goals.reduce((sum, goal) => sum + (goal.saved || 0), 0);
        return totalSaved >= 100000;
      },
      rarity: 'rare',
      persistent: false 
    },
    {
      id: 'goal_crusher',
      title: 'Goal Crusher',
      description: 'Completed your first goal',
      icon: '🏆',
      condition: (goals) => goals.some(goal => (goal.saved || 0) >= goal.target),
      rarity: 'epic',
      persistent: true // Once you complete a goal, you keep this forever
    },
    {
      id: 'multi_goaler',
      title: 'Multi-Goaler',
      description: 'Managing 3 or more goals',
      icon: '🎪',
      condition: (goals) => goals.length >= 3,
      rarity: 'uncommon',
      persistent: false // Can be lost if goals are deleted
    },
    {
      id: 'consistent_saver',
      title: 'Consistent Saver',
      description: 'Made 10 contributions',
      icon: '⚡',
      condition: (goals) => {
        const totalContributions = goals.reduce((sum, goal) => 
          sum + (goal.contributions?.length || 0), 0);
        return totalContributions >= 10;
      },
      rarity: 'uncommon',
      persistent: true // Once you make 10 contributions, you keep this
    },
    {
      id: 'international_saver',
      title: 'International Saver',
      description: 'Have goals in both INR and USD',
      icon: '🌍',
      condition: (goals) => {
        const hasINR = goals.some(goal => goal.currency === 'INR');
        const hasUSD = goals.some(goal => goal.currency === 'USD');
        return hasINR && hasUSD;
      },
      rarity: 'rare',
      persistent: false // Can be lost if goals are deleted
    },
    {
      id: 'marathon_saver',
      title: 'Marathon Saver',
      description: 'Saved for 30 consecutive days',
      icon: '🏃‍♂️',
      condition: (goals) => {
        let consecutiveDays = 0;
        
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const hasContribution = goals.some(goal => 
            goal.contributions?.some(c => 
              new Date(c.date).toDateString() === checkDate.toDateString()
            )
          );
          if (hasContribution) consecutiveDays++;
          else break;
        }
        
        return consecutiveDays >= 30;
      },
      rarity: 'legendary',
      persistent: true 
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Completed 3 goals',
      icon: '💎',
      condition: (goals) => {
        const completedGoals = goals.filter(goal => (goal.saved || 0) >= goal.target);
        return completedGoals.length >= 3;
      },
      rarity: 'legendary',
      persistent: true
    }
  ];

  useEffect(() => {
    const checkAchievements = () => {
      const newUnlocked = [];
      const shouldRemove = [];
      
      achievements.forEach(achievement => {
        const isCurrentlyUnlocked = unlockedAchievements.includes(achievement.id);
        const meetsCondition = achievement.condition(goals);
        
        if (!isCurrentlyUnlocked && meetsCondition) {
          newUnlocked.push(achievement.id);
          
          setShowNotification(achievement);
          setTimeout(() => setShowNotification(null), 4000);
          
          if (onAchievementUnlocked) {
            onAchievementUnlocked(achievement);
          }
        }
        
        if (isCurrentlyUnlocked && !meetsCondition && !achievement.persistent) {
          shouldRemove.push(achievement.id);
        }
      });
      
      if (newUnlocked.length > 0 || shouldRemove.length > 0) {
        setUnlockedAchievements(prev => {
          const updated = [...prev, ...newUnlocked].filter(id => !shouldRemove.includes(id));
          return updated;
        });
      }
    };

    checkAchievements();
  }, [goals, unlockedAchievements, onAchievementUnlocked]);

  useEffect(() => {
    const savedAchievements = localStorage.getItem('unlockedAchievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        if (Array.isArray(parsed)) {
          setUnlockedAchievements(parsed);
        }
      } catch (error) {
        console.error('Error loading achievements from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const completionRate = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          🏅 Achievements
        </h3>
        <div className="text-sm text-gray-500">
          {unlockedCount}/{totalCount} unlocked
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Achievement Progress</span>
          <span>{completionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`
                relative border-2 rounded-lg p-4 transition-all duration-300
                ${isUnlocked 
                  ? `${getRarityBorder(achievement.rarity)} bg-white shadow-md transform hover:scale-105` 
                  : 'border-gray-200 bg-gray-50 opacity-60'
                }
              `}
            >
              {isUnlocked && (
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />
              )}
              
              {isUnlocked && achievement.persistent && (
                <div className="absolute top-2 left-2 text-xs">
                  📌
                </div>
              )}
              
              <div className="text-3xl mb-2 text-center">
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              
              <h4 className={`font-bold text-sm mb-1 text-center ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {achievement.title}
              </h4>
              <p className={`text-xs text-center ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
              
              {isUnlocked && (
                <div className="mt-2 text-center">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {unlockedCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {achievements.filter(a => unlockedAchievements.includes(a.id) && a.rarity === 'legendary').length}
              </div>
              <div className="text-xs text-gray-500">Legendary</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {achievements.filter(a => unlockedAchievements.includes(a.id) && a.rarity === 'epic').length}
              </div>
              <div className="text-xs text-gray-500">Epic</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {achievements.filter(a => unlockedAchievements.includes(a.id) && a.rarity === 'rare').length}
              </div>
              <div className="text-xs text-gray-500">Rare</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {achievements.filter(a => unlockedAchievements.includes(a.id) && (a.rarity === 'uncommon' || a.rarity === 'common')).length}
              </div>
              <div className="text-xs text-gray-500">Common+</div>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{showNotification.icon}</span>
            <div>
              <h4 className="font-bold">Achievement Unlocked!</h4>
              <p className="text-sm">{showNotification.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;