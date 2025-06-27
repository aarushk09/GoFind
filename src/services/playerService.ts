import { supabase } from '@/lib/supabase';
import { Player } from '@/types/player';

export async function joinRoom(room_code: string, player_name: string): Promise<{ player?: Player; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert({
        room_code,
        player_name,
        status: 'joined',
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) {
      return { error: error.message };
    }
    return { player: data as Player };
  } catch (error) {
    return { error: 'An unexpected error occurred while joining the room.' };
  }
}

export async function getPlayersInRoom(room_code: string): Promise<{ players?: Player[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', room_code)
      .order('joined_at', { ascending: true });
    if (error) {
      return { error: error.message };
    }
    return { players: data as Player[] };
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching players.' };
  }
}
