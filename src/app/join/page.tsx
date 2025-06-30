"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { GoFindLogo } from "@/components/ui/GoFindLogo";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-900">
      <div className="mb-8">
        <GoFindLogo size="lg" textColor="text-white" />
      </div>
      
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Join a Scavenger Hunt
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-2">
              Room Code
            </label>
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
              className="w-full px-4 py-3 text-center text-xl tracking-widest uppercase bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="ABC123"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have a room code?{" "}
            <a href="/" className="text-purple-400 hover:text-purple-300 font-medium">
              Go back to home
            </a>
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
