// Room types and interfaces
import { AvatarId } from '../components/avatars/AvatarTypes';

export interface Room {
  id: string
  room_code: string
  host_id: string
  host_email: string
  status: 'waiting' | 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  metadata?: {
    title?: string
    description?: string
    max_players?: number
    time_limit?: number
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
    theme?: 'urban' | 'nature' | 'indoor' | 'mixed'
    is_public?: boolean
    tags?: string[]
  }
}

export interface CreateRoomData {
  title?: string
  description?: string
  max_players?: number
  time_limit?: number
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
  theme?: 'urban' | 'nature' | 'indoor' | 'mixed'
  is_public?: boolean
  tags?: string[]
}

export interface RoomStats {
  total_players: number
  active_players: number
  completed_players: number
  avg_completion_time?: number
  avg_score?: number
}

export interface Player {
  id: string
  room_code: string
  player_name: string
  player_email?: string
  avatar_id?: AvatarId
  score: number
  status: 'joined' | 'active' | 'completed' | 'disconnected'
  joined_at: string
  completed_at?: string
  metadata?: {
    device_type?: 'mobile' | 'desktop' | 'tablet'
    location?: {
      lat: number
      lng: number
      accuracy?: number
    }
    preferences?: {
      notifications?: boolean
      sound_effects?: boolean
      dark_mode?: boolean
    }
  }
}

export interface HuntChallenge {
  id: string
  room_code: string
  challenge_order: number
  challenge_type: 'photo' | 'text' | 'location' | 'qr_code' | 'ai_prompt'
  challenge_data: {
    title: string
    description: string
    hint?: string
    target_location?: {
      lat: number
      lng: number
      radius?: number
      name?: string
    }
    required_items?: string[]
    image_url?: string
  }
  ai_prompt?: string
  correct_answer?: string
  points: number
  time_limit_seconds?: number
  created_at: string
}

export interface PlayerProgress {
  id: string
  player_id: string
  challenge_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped'
  submitted_answer?: string
  is_correct?: boolean
  points_earned: number
  started_at?: string
  completed_at?: string
  submission_data?: {
    image_url?: string
    coordinates?: {
      lat: number
      lng: number
    }
    time_taken_seconds?: number
    attempts?: number
  }
}

export interface RoomActivity {
  id: string
  room_code: string
  player_id?: string
  activity_type: 'player_joined' | 'player_left' | 'challenge_completed' | 'room_started' | 'room_ended' | 'hint_used'
  activity_data: any
  timestamp: string
}

export interface RealTimeUpdate {
  type: 'player_joined' | 'player_left' | 'progress_update' | 'room_status_change' | 'leaderboard_update'
  data: any
  timestamp: string
  room_code: string
}

export interface LeaderboardEntry {
  player_id: string
  player_name: string
  avatar_id?: AvatarId
  score: number
  completion_time?: number
  challenges_completed: number
  rank: number
}

export interface RoomSettings {
  allow_hints: boolean
  show_leaderboard: boolean
  auto_start_delay?: number
  late_join_allowed: boolean
  max_attempts_per_challenge?: number
  penalty_for_wrong_answer?: number
  bonus_for_speed?: boolean
}
