// Room types and interfaces
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
  }
}

export interface CreateRoomData {
  title?: string
  description?: string
  max_players?: number
  time_limit?: number
}

export interface RoomStats {
  total_players: number
  active_players: number
  completed_players: number
}
