"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">GoFind</span>
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Host login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Join a Hunt</h1>
            <p className="text-gray-400">Enter your room code to get started</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest uppercase bg-gray-950 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="ABC123"
                  autoFocus
                  disabled={isChecking}
                />
              </div>
              
              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                disabled={isChecking || !roomCode.trim()}
              >
                {isChecking ? "Checking..." : "Join Hunt"}
              </button>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don&apos;t have a room code?{" "}
              <Link href="/" className="text-green-500 hover:text-green-400 font-medium">
                Go back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
