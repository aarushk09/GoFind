export interface Player {
  id: string;
  room_code: string;
  player_name: string;
  player_email?: string;
  score: number;
  status: 'joined' | 'active' | 'completed' | 'disconnected';
  joined_at: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}
