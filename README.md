# GoFind - AI Scavenger Hunt Platform

An interactive AI-powered scavenger hunt platform similar to Kahoot, but for real-world exploration and discovery. Create engaging hunt rooms where players compete to solve clues and complete challenges.

## Features

- 🎯 **Create Hunt Rooms**: Set up interactive scavenger hunt rooms with custom challenges
- 🤖 **AI-Powered Clues**: Intelligent hints that adapt to player progress and location
- 🏃‍♂️ **Real-time Competition**: Live leaderboards and instant feedback
- 📊 **Host Dashboard**: Comprehensive analytics and room management
- 🔐 **Secure Authentication**: Email-based authentication for hunt hosts

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/aarushk09/GoFind.git
cd GoFind
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase project credentials

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

You'll need to set up the following environment variables in your `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (planned)

## How It Works

### For Hunt Hosts
1. **Sign Up**: Create a host account to start building hunts
2. **Create Hunts**: Design custom scavenger hunts with AI-powered clues
3. **Launch Rooms**: Create live rooms for players to join
4. **Monitor Progress**: Track player progress in real-time
5. **Analyze Results**: Review performance and engagement metrics

### For Players
1. **Join Room**: Enter a room code to join an active hunt
2. **Solve Clues**: Work through AI-generated challenges and hints
3. **Compete**: Compete with other players on live leaderboards
4. **Explore**: Discover new locations and complete real-world tasks

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
