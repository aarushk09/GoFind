import React, { useState, useEffect, useMemo } from 'react';
import { Room, Player } from '@/types/room';

interface SearchFilters {
  theme: string;
  difficulty: string;
  status: string;
  playerCount: string;
  timeLimit: string;
  isPublic: boolean | null;
}

interface SearchResult {
  type: 'room' | 'player';
  item: Room | Player;
  score: number;
  highlights: string[];
}

interface SearchSystemProps {
  rooms?: Room[];
  players?: Player[];
  onRoomSelect?: (room: Room) => void;
  onPlayerSelect?: (player: Player) => void;
  className?: string;
}

export const SearchSystem: React.FC<SearchSystemProps> = ({
  rooms = [],
  players = [],
  onRoomSelect,
  onPlayerSelect,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'rooms' | 'players'>('all');
  const [filters, setFilters] = useState<SearchFilters>({
    theme: '',
    difficulty: '',
    status: '',
    playerCount: '',
    timeLimit: '',
    isPublic: null
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'created' | 'players' | 'name'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const mockRooms: Room[] = [
    {
      id: '1',
      room_code: 'URBAN1',
      host_id: 'host1',
      host_email: 'host1@example.com',
      status: 'waiting',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      metadata: {
        title: 'Downtown Adventure Hunt',
        description: 'Explore the bustling downtown area and discover hidden gems',
        max_players: 25,
        time_limit: 45,
        difficulty: 'medium',
        theme: 'urban',
        is_public: true,
        tags: ['downtown', 'exploration', 'city']
      }
    },
    {
      id: '2',
      room_code: 'NATURE2',
      host_id: 'host2',
      host_email: 'host2@example.com',
      status: 'active',
      created_at: '2024-01-20T11:00:00Z',
      updated_at: '2024-01-20T11:00:00Z',
      metadata: {
        title: 'Forest Trail Mystery',
        description: 'Navigate through scenic forest trails and solve nature puzzles',
        max_players: 15,
        time_limit: 60,
        difficulty: 'hard',
        theme: 'nature',
        is_public: true,
        tags: ['forest', 'nature', 'mystery']
      }
    },
    {
      id: '3',
      room_code: 'INDOOR3',
      host_id: 'host3',
      host_email: 'host3@example.com',
      status: 'waiting',
      created_at: '2024-01-20T12:00:00Z',
      updated_at: '2024-01-20T12:00:00Z',
      metadata: {
        title: 'Museum Treasure Hunt',
        description: 'Discover artifacts and solve historical puzzles in the museum',
        max_players: 20,
        time_limit: 30,
        difficulty: 'easy',
        theme: 'indoor',
        is_public: false,
        tags: ['museum', 'history', 'artifacts']
      }
    }
  ];

  const mockPlayers: Player[] = [
    {
      id: 'player1',
      room_code: 'URBAN1',
      player_name: 'Alex Explorer',
      player_email: 'alex@example.com',
      score: 1250,
      status: 'active',
      joined_at: '2024-01-20T10:30:00Z',
      metadata: {
        device_type: 'mobile',
        preferences: { notifications: true, sound_effects: true, dark_mode: false }
      }
    },
    {
      id: 'player2',
      room_code: 'NATURE2',
      player_name: 'Sarah Adventurer',
      player_email: 'sarah@example.com',
      score: 890,
      status: 'active',
      joined_at: '2024-01-20T11:15:00Z',
      metadata: {
        device_type: 'desktop',
        preferences: { notifications: true, sound_effects: false, dark_mode: true }
      }
    }
  ];

  const allRooms = rooms.length > 0 ? rooms : mockRooms;
  const allPlayers = players.length > 0 ? players : mockPlayers;

  // Search function with scoring
  const searchItems = useMemo(() => {
    if (!searchQuery.trim()) {
      const results: SearchResult[] = [];
      
      if (searchType === 'all' || searchType === 'rooms') {
        results.push(...allRooms.map(room => ({
          type: 'room' as const,
          item: room,
          score: 1,
          highlights: []
        })));
      }
      
      if (searchType === 'all' || searchType === 'players') {
        results.push(...allPlayers.map(player => ({
          type: 'player' as const,
          item: player,
          score: 1,
          highlights: []
        })));
      }
      
      return results;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search rooms
    if (searchType === 'all' || searchType === 'rooms') {
      allRooms.forEach(room => {
        const highlights: string[] = [];
        let score = 0;

        // Title match (highest priority)
        if (room.metadata?.title?.toLowerCase().includes(query)) {
          score += 10;
          highlights.push('title');
        }

        // Description match
        if (room.metadata?.description?.toLowerCase().includes(query)) {
          score += 5;
          highlights.push('description');
        }

        // Tags match
        if (room.metadata?.tags?.some(tag => tag.toLowerCase().includes(query))) {
          score += 3;
          highlights.push('tags');
        }

        // Theme match
        if (room.metadata?.theme?.toLowerCase().includes(query)) {
          score += 2;
          highlights.push('theme');
        }

        // Room code match
        if (room.room_code.toLowerCase().includes(query)) {
          score += 8;
          highlights.push('code');
        }

        if (score > 0) {
          results.push({
            type: 'room',
            item: room,
            score,
            highlights
          });
        }
      });
    }

    // Search players
    if (searchType === 'all' || searchType === 'players') {
      allPlayers.forEach(player => {
        const highlights: string[] = [];
        let score = 0;

        // Name match (highest priority)
        if (player.player_name.toLowerCase().includes(query)) {
          score += 10;
          highlights.push('name');
        }

        // Email match
        if (player.player_email?.toLowerCase().includes(query)) {
          score += 5;
          highlights.push('email');
        }

        // Room code match
        if (player.room_code.toLowerCase().includes(query)) {
          score += 3;
          highlights.push('room');
        }

        if (score > 0) {
          results.push({
            type: 'player',
            item: player,
            score,
            highlights
          });
        }
      });
    }

    return results;
  }, [searchQuery, searchType, allRooms, allPlayers]);

  // Apply filters
  const filteredResults = useMemo(() => {
    return searchItems.filter(result => {
      if (result.type === 'room') {
        const room = result.item as Room;
        
        if (filters.theme && room.metadata?.theme !== filters.theme) return false;
        if (filters.difficulty && room.metadata?.difficulty !== filters.difficulty) return false;
        if (filters.status && room.status !== filters.status) return false;
        if (filters.isPublic !== null && room.metadata?.is_public !== filters.isPublic) return false;
        
        if (filters.playerCount) {
          const maxPlayers = room.metadata?.max_players || 0;
          switch (filters.playerCount) {
            case 'small': if (maxPlayers > 15) return false; break;
            case 'medium': if (maxPlayers <= 15 || maxPlayers > 30) return false; break;
            case 'large': if (maxPlayers <= 30) return false; break;
          }
        }
        
        if (filters.timeLimit) {
          const timeLimit = room.metadata?.time_limit || 0;
          switch (filters.timeLimit) {
            case 'short': if (timeLimit > 30) return false; break;
            case 'medium': if (timeLimit <= 30 || timeLimit > 60) return false; break;
            case 'long': if (timeLimit <= 60) return false; break;
          }
        }
      }
      
      return true;
    });
  }, [searchItems, filters]);

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...filteredResults];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.score - a.score;
          break;
        case 'created':
          const dateA = new Date(a.item.created_at || 0).getTime();
          const dateB = new Date(b.item.created_at || 0).getTime();
          comparison = dateB - dateA;
          break;
        case 'players':
          if (a.type === 'room' && b.type === 'room') {
            const playersA = (a.item as Room).metadata?.max_players || 0;
            const playersB = (b.item as Room).metadata?.max_players || 0;
            comparison = playersB - playersA;
          }
          break;
        case 'name':
          const nameA = a.type === 'room' 
            ? (a.item as Room).metadata?.title || ''
            : (a.item as Player).player_name;
          const nameB = b.type === 'room'
            ? (b.item as Room).metadata?.title || ''
            : (b.item as Player).player_name;
          comparison = nameA.localeCompare(nameB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredResults, sortBy, sortOrder]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      theme: '',
      difficulty: '',
      status: '',
      playerCount: '',
      timeLimit: '',
      isPublic: null
    });
  };

  const getHighlightedText = (text: string, highlights: string[], field: string) => {
    if (!highlights.includes(field) || !searchQuery.trim()) {
      return text;
    }

    const query = searchQuery.toLowerCase();
    const index = text.toLowerCase().indexOf(query);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <mark className="bg-yellow-300 text-gray-900 px-1 rounded">
          {text.substring(index, index + searchQuery.length)}
        </mark>
        {text.substring(index + searchQuery.length)}
      </>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms, players, or content..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="rooms">Rooms</option>
            <option value="players">Players</option>
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Filters
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          {[
            { id: 'all', name: 'All Results', count: sortedResults.length },
            { id: 'rooms', name: 'Rooms', count: sortedResults.filter(r => r.type === 'room').length },
            { id: 'players', name: 'Players', count: sortedResults.filter(r => r.type === 'player').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchType(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <select
                value={filters.theme}
                onChange={(e) => updateFilter('theme', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Themes</option>
                <option value="urban">Urban</option>
                <option value="nature">Nature</option>
                <option value="indoor">Indoor</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Players</label>
              <select
                value={filters.playerCount}
                onChange={(e) => updateFilter('playerCount', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Size</option>
                <option value="small">Small (≤15)</option>
                <option value="medium">Medium (16-30)</option>
                <option value="large">Large (>30)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <select
                value={filters.timeLimit}
                onChange={(e) => updateFilter('timeLimit', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Length</option>
                <option value="short">Short (≤30m)</option>
                <option value="medium">Medium (31-60m)</option>
                <option value="long">Long (>60m)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
              <select
                value={filters.isPublic === null ? '' : filters.isPublic.toString()}
                onChange={(e) => updateFilter('isPublic', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Rooms</option>
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="relevance">Relevance</option>
              <option value="created">Created Date</option>
              <option value="players">Player Count</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {sortedResults.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0L3 9.343m3.343 3.314L9 15.314M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-300">No results found</h3>
            <p className="mt-2 text-sm text-gray-400">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          sortedResults.map((result, index) => (
            <div
              key={`${result.type}-${result.item.id || index}`}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => {
                if (result.type === 'room' && onRoomSelect) {
                  onRoomSelect(result.item as Room);
                } else if (result.type === 'player' && onPlayerSelect) {
                  onPlayerSelect(result.item as Player);
                }
              }}
            >
              {result.type === 'room' ? (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {getHighlightedText((result.item as Room).metadata?.title || 'Untitled Room', result.highlights, 'title')}
                        </h3>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {getHighlightedText((result.item as Room).room_code, result.highlights, 'code')}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {getHighlightedText((result.item as Room).metadata?.description || '', result.highlights, 'description')}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="capitalize">
                          {getHighlightedText((result.item as Room).metadata?.theme || '', result.highlights, 'theme')}
                        </span>
                        <span>{(result.item as Room).metadata?.difficulty}</span>
                        <span>{(result.item as Room).metadata?.max_players} players</span>
                        <span>{(result.item as Room).metadata?.time_limit}m</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (result.item as Room).status === 'waiting' ? 'bg-yellow-600 text-white' :
                      (result.item as Room).status === 'active' ? 'bg-green-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {(result.item as Room).status}
                    </div>
                  </div>
                  {(result.item as Room).metadata?.tags && (
                    <div className="flex flex-wrap gap-2">
                      {(result.item as Room).metadata.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {getHighlightedText(tag, result.highlights, 'tags')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {getHighlightedText((result.item as Player).player_name, result.highlights, 'name')}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>
                        Room: {getHighlightedText((result.item as Player).room_code, result.highlights, 'room')}
                      </span>
                      <span>Score: {(result.item as Player).score}</span>
                      <span className="capitalize">{(result.item as Player).status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{(result.item as Player).score}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchSystem; 