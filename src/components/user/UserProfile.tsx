import React, { useState, useEffect } from 'react';
import { AvatarDisplay } from '../avatars/AvatarDisplay';
import { AvatarSelector } from '../avatars/AvatarSelector';
import { AvatarId } from '../avatars/AvatarTypes';

interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  timeSpent: number;
  challengesCompleted: number;
  favoriteTheme: string;
  currentStreak: number;
  bestStreak: number;
  rank: string;
}

interface UserPreferences {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  autoJoin: boolean;
  publicProfile: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: AvatarId;
  joinDate: string;
  lastActive: string;
  stats: UserStats;
  preferences: UserPreferences;
  achievements: string[];
}

interface UserProfileProps {
  userId?: string;
  isEditing?: boolean;
  onSave?: (profile: UserProfile) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId = 'demo-user',
  isEditing = false,
  onSave
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: userId,
    username: 'Adventure Seeker',
    email: 'user@example.com',
    avatar: 'explorer',
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString(),
    stats: {
      gamesPlayed: 47,
      gamesWon: 23,
      totalScore: 15420,
      averageScore: 328,
      timeSpent: 2847, // minutes
      challengesCompleted: 156,
      favoriteTheme: 'urban',
      currentStreak: 5,
      bestStreak: 12,
      rank: 'Explorer'
    },
    preferences: {
      notifications: true,
      soundEffects: true,
      darkMode: true,
      language: 'en',
      difficulty: 'medium',
      autoJoin: false,
      publicProfile: true
    },
    achievements: ['first_win', 'speed_demon', 'explorer', 'social_butterfly', 'perfectionist']
  });

  const [editMode, setEditMode] = useState(isEditing);
  const [editingProfile, setEditingProfile] = useState<UserProfile>(profile);

  const achievements = {
    first_win: { name: 'First Victory', description: 'Won your first game', icon: '🏆', color: 'bg-yellow-500' },
    speed_demon: { name: 'Speed Demon', description: 'Completed a game in under 10 minutes', icon: '⚡', color: 'bg-blue-500' },
    explorer: { name: 'Explorer', description: 'Played games in all themes', icon: '🗺️', color: 'bg-green-500' },
    social_butterfly: { name: 'Social Butterfly', description: 'Played with 50+ different players', icon: '🦋', color: 'bg-purple-500' },
    perfectionist: { name: 'Perfectionist', description: 'Completed a game with 100% accuracy', icon: '💎', color: 'bg-indigo-500' },
    marathon: { name: 'Marathon Runner', description: 'Played for 3+ hours in one session', icon: '🏃', color: 'bg-red-500' },
    team_player: { name: 'Team Player', description: 'Helped teammates complete 25+ challenges', icon: '🤝', color: 'bg-orange-500' }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWinRate = () => {
    return profile.stats.gamesPlayed > 0 
      ? Math.round((profile.stats.gamesWon / profile.stats.gamesPlayed) * 100)
      : 0;
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'novice': return 'bg-gray-500';
      case 'explorer': return 'bg-green-500';
      case 'adventurer': return 'bg-blue-500';
      case 'expert': return 'bg-purple-500';
      case 'master': return 'bg-orange-500';
      case 'legend': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSave = () => {
    setProfile(editingProfile);
    setEditMode(false);
    onSave?.(editingProfile);
  };

  const handleCancel = () => {
    setEditingProfile(profile);
    setEditMode(false);
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setEditingProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <AvatarDisplay
                avatarId={editMode ? editingProfile.avatar : profile.avatar}
                size={96}
                variant="simple"
              />
              {editMode && (
                <div className="absolute -bottom-2 -right-2">
                  <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingProfile.username}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, username: e.target.value }))}
                    className="text-2xl font-bold bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
                  />
                  <input
                    type="email"
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="text-gray-300 bg-gray-700 border border-gray-600 rounded px-3 py-1"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                  <p className="text-gray-300">{profile.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRankColor(profile.stats.rank)}`}>
                      {profile.stats.rank}
                    </span>
                    <span className="text-sm text-gray-400">
                      Joined {formatDate(profile.joinDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selection (Edit Mode) */}
      {editMode && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Choose Avatar</h3>
          <AvatarSelector
            selectedAvatarId={editingProfile.avatar}
            onAvatarSelect={(avatarId) => setEditingProfile(prev => ({ ...prev, avatar: avatarId }))}
            size={60}
            showNames={true}
            className="bg-gray-700 border-gray-600 rounded-lg p-4"
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{profile.stats.gamesPlayed}</div>
          <div className="text-sm text-gray-300">Games Played</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{getWinRate()}%</div>
          <div className="text-sm text-gray-300">Win Rate</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{profile.stats.totalScore.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Total Score</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{formatTime(profile.stats.timeSpent)}</div>
          <div className="text-sm text-gray-300">Time Played</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Average Score</span>
              <span className="text-white font-medium">{profile.stats.averageScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Challenges Completed</span>
              <span className="text-white font-medium">{profile.stats.challengesCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Current Streak</span>
              <span className="text-white font-medium">{profile.stats.currentStreak} games</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Best Streak</span>
              <span className="text-white font-medium">{profile.stats.bestStreak} games</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Favorite Theme</span>
              <span className="text-white font-medium capitalize">{profile.stats.favoriteTheme}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {profile.achievements.map((achievementId) => {
              const achievement = achievements[achievementId as keyof typeof achievements];
              if (!achievement) return null;
              
              return (
                <div
                  key={achievementId}
                  className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                  title={achievement.description}
                >
                  <div className={`w-8 h-8 ${achievement.color} rounded-full flex items-center justify-center text-white text-sm`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {achievement.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Gameplay</h4>
            {[
              { key: 'notifications', label: 'Enable Notifications', desc: 'Get updates about games and challenges' },
              { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for actions and alerts' },
              { key: 'autoJoin', label: 'Auto-join Rooms', desc: 'Automatically join available rooms' },
              { key: 'publicProfile', label: 'Public Profile', desc: 'Allow others to view your profile' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
                <button
                  onClick={() => editMode && updatePreference(key as keyof UserPreferences, !editingProfile.preferences[key as keyof UserPreferences])}
                  disabled={!editMode}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    (editMode ? editingProfile : profile).preferences[key as keyof UserPreferences]
                      ? 'bg-purple-600'
                      : 'bg-gray-600'
                  } ${editMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      (editMode ? editingProfile : profile).preferences[key as keyof UserPreferences]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Interface</h4>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Preferred Difficulty
              </label>
              <select
                value={editMode ? editingProfile.preferences.difficulty : profile.preferences.difficulty}
                onChange={(e) => editMode && updatePreference('difficulty', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Language
              </label>
              <select
                value={editMode ? editingProfile.preferences.language : profile.preferences.language}
                onChange={(e) => editMode && updatePreference('language', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 