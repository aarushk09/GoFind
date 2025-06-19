"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const code = roomCode.trim().toUpperCase();
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-character room code.");
      setIsLoading(false);
      return;
    }
    // Query Supabase for room existence
    const { data, error: dbError } = await supabase
      .from("rooms")
      .select("room_code")
      .eq("room_code", code)
      .single();
    if (dbError || !data) {
      setError("Room not found. Please check your code.");
      setIsLoading(false);
      return;
    }
    // Redirect to joined confirmation page
    router.push(`/join/${code}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-4">Join a Scavenger Hunt Room</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          name="roomCode"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value)}
          maxLength={6}
          className="input input-bordered w-full text-center text-xl tracking-widest uppercase"
          placeholder="Enter Room Code"
          autoFocus
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join Room"}
        </button>
      </form>
    </div>
  );
}
