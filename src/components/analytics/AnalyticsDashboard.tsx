import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  overview: {
    totalRooms: number;
    activeRooms: number;
    totalPlayers: number;
    activePlayers: number;
    averageSessionTime: number;
    completionRate: number;
  };
  trends: {
    date: string;
    rooms: number;
    players: number;
    completions: number;
  }[];
  themes: {
    name: string;
    count: number;
    percentage: number;
    avgScore: number;
  }[];
  performance: {
    difficulty: string;
    avgTime: number;
    completionRate: number;
    playerCount: number;
  }[];
  topRooms: {
    id: string;
    title: string;
    plays: number;
    avgScore: number;
    rating: number;
  }[];
  topPlayers: {
    id: string;
    name: string;
    totalScore: number;
    gamesWon: number;
    winRate: number;
  }[];
}

interface AnalyticsDashboardProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '24h' | '7d' | '30d' | '90d') => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = '7d',
  onTimeRangeChange
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'rooms' | 'players' | 'completions'>('rooms');

  // Mock data generation
  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      const trends = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toISOString().split('T')[0],
          rooms: Math.floor(Math.random() * 50) + 20,
          players: Math.floor(Math.random() * 200) + 100,
          completions: Math.floor(Math.random() * 80) + 40
        };
      });

      return {
        overview: {
          totalRooms: 1247,
          activeRooms: 89,
          totalPlayers: 8934,
          activePlayers: 456,
          averageSessionTime: 1847, // seconds
          completionRate: 73.5
        },
        trends,
        themes: [
          { name: 'Urban', count: 423, percentage: 34, avgScore: 1245 },
          { name: 'Nature', count: 312, percentage: 25, avgScore: 1156 },
          { name: 'Indoor', count: 298, percentage: 24, avgScore: 1089 },
          { name: 'Mixed', count: 214, percentage: 17, avgScore: 1334 }
        ],
        performance: [
          { difficulty: 'Easy', avgTime: 1245, completionRate: 89.2, playerCount: 3421 },
          { difficulty: 'Medium', avgTime: 1876, completionRate: 76.8, playerCount: 2847 },
          { difficulty: 'Hard', avgTime: 2534, completionRate: 58.3, playerCount: 1923 },
          { difficulty: 'Expert', avgTime: 3201, completionRate: 41.7, playerCount: 743 }
        ],
        topRooms: [
          { id: '1', title: 'Downtown Adventure', plays: 234, avgScore: 1456, rating: 4.8 },
          { id: '2', title: 'Forest Mystery', plays: 198, avgScore: 1342, rating: 4.7 },
          { id: '3', title: 'Museum Hunt', plays: 176, avgScore: 1289, rating: 4.6 },
          { id: '4', title: 'City Explorer', plays: 165, avgScore: 1398, rating: 4.5 },
          { id: '5', title: 'Park Adventure', plays: 152, avgScore: 1267, rating: 4.4 }
        ],
        topPlayers: [
          { id: '1', name: 'Alex Explorer', totalScore: 23456, gamesWon: 45, winRate: 78.9 },
          { id: '2', name: 'Sarah Hunter', totalScore: 21234, gamesWon: 38, winRate: 73.1 },
          { id: '3', name: 'Mike Adventure', totalScore: 19876, gamesWon: 35, winRate: 70.0 },
          { id: '4', name: 'Emma Quest', totalScore: 18543, gamesWon: 32, winRate: 68.1 },
          { id: '5', name: 'John Seeker', totalScore: 17321, gamesWon: 29, winRate: 65.9 }
        ]
      };
    };

    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex space-x-2">
          {(['24h', '7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Rooms</p>
              <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalRooms)}</p>
              <p className="text-xs text-green-400 mt-1">+12% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Rooms</p>
              <p className="text-2xl font-bold text-white">{data.overview.activeRooms}</p>
              <p className="text-xs text-green-400 mt-1">+8% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Players</p>
              <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalPlayers)}</p>
              <p className="text-xs text-green-400 mt-1">+24% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Players</p>
              <p className="text-2xl font-bold text-white">{data.overview.activePlayers}</p>
              <p className="text-xs text-green-400 mt-1">+18% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Session</p>
              <p className="text-2xl font-bold text-white">{formatTime(data.overview.averageSessionTime)}</p>
              <p className="text-xs text-green-400 mt-1">+5% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{data.overview.completionRate}%</p>
              <p className="text-xs text-green-400 mt-1">+3% vs last period</p>
            </div>
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Activity Trends</h3>
          <div className="flex space-x-2">
            {(['rooms', 'players', 'completions'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.trends.map((trend, index) => {
            const value = trend[selectedMetric];
            const maxValue = Math.max(...data.trends.map(t => t[selectedMetric]));
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-purple-600 rounded-t transition-all duration-300 hover:bg-purple-500"
                  style={{ height: `${height}%` }}
                  title={`${trend.date}: ${value}`}
                />
                <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                  {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Distribution & Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Theme Distribution</h3>
          <div className="space-y-4">
            {data.themes.map((theme) => (
              <div key={theme.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{theme.name}</span>
                  <span className="text-white">{theme.count} rooms ({theme.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${theme.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Avg Score: {theme.avgScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Difficulty</h3>
          <div className="space-y-4">
            {data.performance.map((perf) => (
              <div key={perf.difficulty} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">{perf.difficulty}</h4>
                  <span className="text-sm text-gray-400">{formatNumber(perf.playerCount)} players</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Avg Time:</span>
                    <span className="text-white ml-2">{formatTime(perf.avgTime)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Completion:</span>
                    <span className="text-white ml-2">{perf.completionRate}%</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-green-600 h-1 rounded-full"
                    style={{ width: `${perf.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Rooms</h3>
          <div className="space-y-3">
            {data.topRooms.map((room, index) => (
              <div key={room.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{room.title}</div>
                    <div className="text-sm text-gray-400">{room.plays} plays • Avg: {room.avgScore}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} className="w-4 h-4" fill={i < Math.floor(room.rating) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{room.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Players</h3>
          <div className="space-y-3">
            {data.topPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.gamesWon} wins • {player.winRate}% win rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{formatNumber(player.totalScore)}</div>
                  <div className="text-sm text-gray-400">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 