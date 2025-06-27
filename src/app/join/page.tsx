"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsChecking(true);
    
    const code = roomCode.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-character room code.");
      setIsChecking(false);
      return;
    }

    // Check if room exists before redirecting
    try {
      const { data, error: dbError } = await supabase
        .from("rooms")
        .select("room_code")
        .eq("room_code", code)
        .single();

      if (dbError || !data) {
        setError("Room not found. Please check your code.");
        setIsChecking(false);
        return;
      }

      // Room exists, redirect to join page
      router.push(`/join/${code}`);
    } catch (err) {
      setError("Failed to check room. Please try again.");
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a Scavenger Hunt</h1>
          <p className="text-gray-600">Enter the room code to join the adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="roomCode"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest uppercase font-mono"
              placeholder="ROOM CODE"
              autoFocus
              disabled={isChecking}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            disabled={isChecking || !roomCode.trim()}
          >
            {isChecking ? "Checking..." : "Find Room"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have a room code? Ask your host for the 6-digit code.
          </p>
        </div>
      </div>
    </div>
  );
}
