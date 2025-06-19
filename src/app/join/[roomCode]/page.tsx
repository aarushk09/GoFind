"use client";

import { useParams } from "next/navigation";

export default function JoinedRoomPage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-4">You joined room {roomCode}</h1>
      <p className="text-lg">Welcome to the scavenger hunt!<br />
        Wait for the host to start the game.</p>
    </div>
  );
}
