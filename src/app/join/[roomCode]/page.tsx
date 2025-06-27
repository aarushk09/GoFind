"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { joinRoom, getPlayersInRoom } from '@/services/playerService';
import { Player } from '@/types/player';

export default function JoinedRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string)?.toUpperCase();
  
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomExists, setRoomExists] = useState<boolean | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  // Check if room exists when component mounts
  useEffect(() => {
    const checkRoom = async () => {
      if (!roomCode || roomCode.length !== 6) {
        setError("Invalid room code");
        return;
      }

      try {
        const { data, error: roomError } = await supabase
          .from("rooms")
          .select("room_code, status")
          .eq("room_code", roomCode)
          .single();

        if (roomError || !data) {
          setRoomExists(false);
          setError("Room not found. Please check your room code.");
        } else {
          setRoomExists(true);
          // Load existing players
          const playersResult = await getPlayersInRoom(roomCode);
          if (playersResult.players) {
            setPlayers(playersResult.players);
          }
        }
      } catch (err) {
        setRoomExists(false);
        setError("Failed to check room status.");
      }
    };

    checkRoom();
  }, [roomCode]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomExists) {
      setError("Room does not exist");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const result = await joinRoom(roomCode, playerName.trim());
      
      if (result.error) {
        setError(result.error);
      } else {
        setHasJoined(true);
        // Refresh players list
        const playersResult = await getPlayersInRoom(roomCode);
        if (playersResult.players) {
          setPlayers(playersResult.players);
        }
      }
    } catch (err) {
      setError("Failed to join room. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  if (roomExists === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Room Not Found</h1>
          <p className="text-red-600 mb-4">
            The room code &ldquo;<span className="font-mono font-bold">{roomCode}</span>&rdquo; does not exist.
          </p>
          <button
            onClick={() => router.push('/join')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Another Code
          </button>
        </div>
      </div>
    );
  }

  if (roomExists === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Checking room...</p>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Room</h1>
            <p className="text-xl font-mono font-bold text-blue-600 tracking-widest">{roomCode}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 text-center">
              You&apos;ve successfully joined as <span className="font-semibold text-blue-600">{playerName}</span>!
            </p>
            <p className="text-gray-500 text-center mt-2">
              Wait for the host to start the scavenger hunt.
            </p>
          </div>

          {players.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Players in Room ({players.length})
              </h3>
              <div className="max-h-32 overflow-y-auto">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between py-1 text-sm">
                    <span className="text-gray-700">{player.player_name}</span>
                    <span className="text-xs text-gray-500">
                      {player.player_name === playerName ? 'You' : `#${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Scavenger Hunt</h1>
          <p className="text-xl font-mono font-bold text-blue-600 tracking-widest">{roomCode}</p>
          <p className="text-gray-600 mt-2">Enter your name to join the adventure!</p>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
              maxLength={32}
              autoFocus
              disabled={isJoining}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isJoining || !playerName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isJoining ? "Joining..." : "Join Hunt"}
          </button>
        </form>

        {players.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Already Joined ({players.length})
            </h3>
            <div className="max-h-24 overflow-y-auto">
              {players.map((player) => (
                <div key={player.id} className="text-sm text-gray-600 py-1">
                  {player.player_name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
