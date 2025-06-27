import React, { useState, useEffect } from 'react';

interface AppSettings {
  general: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
    dateFormat: string;
    numberFormat: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    gameInvites: boolean;
    roomUpdates: boolean;
    achievements: boolean;
    marketing: boolean;
  };
  gameplay: {
    defaultDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
    autoJoinRooms: boolean;
    showHints: boolean;
    soundEffects: boolean;
    backgroundMusic: boolean;
    vibration: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
    shareGameStats: boolean;
    dataCollection: boolean;
    analytics: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
    colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    keyboardNavigation: boolean;
  };
  advanced: {
    debugMode: boolean;
    betaFeatures: boolean;
    performanceMode: boolean;
    offlineMode: boolean;
    cacheSize: number;
    maxConnections: number;
  };
}

interface SettingsPanelProps {
  isAdmin?: boolean;
  onSave?: (settings: AppSettings) => void;
  onReset?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isAdmin = false,
  onSave,
  onReset
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    general: {
      language: 'en',
      theme: 'dark',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US'
    },
    notifications: {
      email: true,
      push: true,
      gameInvites: true,
      roomUpdates: true,
      achievements: true,
      marketing: false
    },
    gameplay: {
      defaultDifficulty: 'medium',
      autoJoinRooms: false,
      showHints: true,
      soundEffects: true,
      backgroundMusic: false,
      vibration: true
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowFriendRequests: true,
      shareGameStats: true,
      dataCollection: true,
      analytics: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      colorBlind: 'none',
      keyboardNavigation: false
    },
    advanced: {
      debugMode: false,
      betaFeatures: false,
      performanceMode: false,
      offlineMode: false,
      cacheSize: 100,
      maxConnections: 10
    }
  });

  const [activeTab, setActiveTab] = useState<keyof AppSettings>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (category: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave?.(settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      onReset?.();
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'gameplay', name: 'Gameplay', icon: '🎮' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'accessibility', name: 'Accessibility', icon: '♿' },
    ...(isAdmin ? [{ id: 'advanced', name: 'Advanced', icon: '🔧' }] : [])
  ] as { id: keyof AppSettings; name: string; icon: string }[];

  const renderToggle = (value: boolean, onChange: (value: boolean) => void, disabled = false) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-purple-600' : 'bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderSelect = (value: string, options: { value: string; label: string }[], onChange: (value: string) => void) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const renderSlider = (value: number, min: number, max: number, onChange: (value: number) => void) => (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-400">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-gray-400">{max}</span>
      <span className="text-sm text-white font-medium w-12 text-center">{value}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400">Customize your GoFind experience</p>
        </div>
        
        <div className="flex space-x-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 rounded-md transition-colors ${
              hasChanges && !isSaving
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">General Settings</h3>
                
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    {renderSelect(
                      settings.general.language,
                      [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' },
                        { value: 'zh', label: 'Chinese' },
                        { value: 'ja', label: 'Japanese' }
                      ],
                      (value) => updateSetting('general', 'language', value)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Theme
                    </label>
                    {renderSelect(
                      settings.general.theme,
                      [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'auto', label: 'Auto (System)' }
                      ],
                      (value) => updateSetting('general', 'theme', value as any)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Timezone
                    </label>
                    {renderSelect(
                      settings.general.timezone,
                      [
                        { value: 'America/New_York', label: 'Eastern Time' },
                        { value: 'America/Chicago', label: 'Central Time' },
                        { value: 'America/Denver', label: 'Mountain Time' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time' },
                        { value: 'Europe/London', label: 'GMT' },
                        { value: 'Europe/Paris', label: 'CET' },
                        { value: 'Asia/Tokyo', label: 'JST' }
                      ],
                      (value) => updateSetting('general', 'timezone', value)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date Format
                    </label>
                    {renderSelect(
                      settings.general.dateFormat,
                      [
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                        { value: 'DD MMM YYYY', label: 'DD MMM YYYY' }
                      ],
                      (value) => updateSetting('general', 'dateFormat', value)
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'gameInvites', label: 'Game Invites', desc: 'Notifications when invited to games' },
                    { key: 'roomUpdates', label: 'Room Updates', desc: 'Updates about room status changes' },
                    { key: 'achievements', label: 'Achievements', desc: 'Notifications for unlocked achievements' },
                    { key: 'marketing', label: 'Marketing', desc: 'Promotional emails and updates' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{label}</div>
                        <div className="text-sm text-gray-400">{desc}</div>
                      </div>
                      {renderToggle(
                        settings.notifications[key as keyof typeof settings.notifications] as boolean,
                        (value) => updateSetting('notifications', key, value)
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gameplay' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Gameplay Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Default Difficulty
                    </label>
                    {renderSelect(
                      settings.gameplay.defaultDifficulty,
                      [
                        { value: 'easy', label: 'Easy' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'hard', label: 'Hard' },
                        { value: 'expert', label: 'Expert' }
                      ],
                      (value) => updateSetting('gameplay', 'defaultDifficulty', value as any)
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'autoJoinRooms', label: 'Auto-join Rooms', desc: 'Automatically join available rooms' },
                      { key: 'showHints', label: 'Show Hints', desc: 'Display helpful hints during gameplay' },
                      { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sound effects for actions' },
                      { key: 'backgroundMusic', label: 'Background Music', desc: 'Play ambient music during games' },
                      { key: 'vibration', label: 'Vibration', desc: 'Haptic feedback on mobile devices' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{label}</div>
                          <div className="text-sm text-gray-400">{desc}</div>
                        </div>
                        {renderToggle(
                          settings.gameplay[key as keyof typeof settings.gameplay] as boolean,
                          (value) => updateSetting('gameplay', key, value)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Visibility
                    </label>
                    {renderSelect(
                      settings.privacy.profileVisibility,
                      [
                        { value: 'public', label: 'Public' },
                        { value: 'friends', label: 'Friends Only' },
                        { value: 'private', label: 'Private' }
                      ],
                      (value) => updateSetting('privacy', 'profileVisibility', value as any)
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Let others see when you\'re online' },
                      { key: 'allowFriendRequests', label: 'Allow Friend Requests', desc: 'Accept friend requests from other players' },
                      { key: 'shareGameStats', label: 'Share Game Statistics', desc: 'Allow others to view your game stats' },
                      { key: 'dataCollection', label: 'Data Collection', desc: 'Allow collection of usage data for improvements' },
                      { key: 'analytics', label: 'Analytics', desc: 'Share anonymous analytics data' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{label}</div>
                          <div className="text-sm text-gray-400">{desc}</div>
                        </div>
                        {renderToggle(
                          settings.privacy[key as keyof typeof settings.privacy] as boolean,
                          (value) => updateSetting('privacy', key, value)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Accessibility Options</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    {renderSelect(
                      settings.accessibility.fontSize,
                      [
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' },
                        { value: 'extra-large', label: 'Extra Large' }
                      ],
                      (value) => updateSetting('accessibility', 'fontSize', value as any)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color Blind Support
                    </label>
                    {renderSelect(
                      settings.accessibility.colorBlind,
                      [
                        { value: 'none', label: 'None' },
                        { value: 'protanopia', label: 'Protanopia (Red-blind)' },
                        { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
                        { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
                      ],
                      (value) => updateSetting('accessibility', 'colorBlind', value as any)
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'highContrast', label: 'High Contrast', desc: 'Increase contrast for better visibility' },
                      { key: 'reduceMotion', label: 'Reduce Motion', desc: 'Minimize animations and transitions' },
                      { key: 'screenReader', label: 'Screen Reader Support', desc: 'Optimize for screen readers' },
                      { key: 'keyboardNavigation', label: 'Keyboard Navigation', desc: 'Enhanced keyboard navigation support' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{label}</div>
                          <div className="text-sm text-gray-400">{desc}</div>
                        </div>
                        {renderToggle(
                          settings.accessibility[key as keyof typeof settings.accessibility] as boolean,
                          (value) => updateSetting('accessibility', key, value)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && isAdmin && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
                <div className="bg-yellow-600 border border-yellow-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-100 font-medium">Warning: These settings can affect app performance</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cache Size (MB)
                    </label>
                    {renderSlider(
                      settings.advanced.cacheSize,
                      50,
                      500,
                      (value) => updateSetting('advanced', 'cacheSize', value)
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Connections
                    </label>
                    {renderSlider(
                      settings.advanced.maxConnections,
                      5,
                      50,
                      (value) => updateSetting('advanced', 'maxConnections', value)
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'debugMode', label: 'Debug Mode', desc: 'Enable debugging features and console logs' },
                      { key: 'betaFeatures', label: 'Beta Features', desc: 'Access experimental features' },
                      { key: 'performanceMode', label: 'Performance Mode', desc: 'Optimize for performance over visual quality' },
                      { key: 'offlineMode', label: 'Offline Mode', desc: 'Enable offline functionality where possible' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{label}</div>
                          <div className="text-sm text-gray-400">{desc}</div>
                        </div>
                        {renderToggle(
                          settings.advanced[key as keyof typeof settings.advanced] as boolean,
                          (value) => updateSetting('advanced', key, value)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 