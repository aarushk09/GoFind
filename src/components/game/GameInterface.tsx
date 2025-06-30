import React, { useState, useEffect } from 'react'
import { Player, Room, HuntChallenge, PlayerProgress } from '@/types/room'
import { getCurrentChallenge, getRoomChallenges } from '@/services/challengeService'
import { getRoomLeaderboard } from '@/services/playerService'
import ChallengeCard from './ChallengeCard'
import { AvatarDisplay } from '../avatars/AvatarDisplay'
import { AvatarId } from '../avatars/AvatarTypes'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useToastHelpers } from '../ui/Toast'

interface GameInterfaceProps {
  player: Player
  room: Room
  onGameComplete?: () => void
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  player,
  room,
  onGameComplete
}) => {
  const [challenges, setChallenges] = useState<HuntChallenge[]>([])
  const [currentChallenge, setCurrentChallenge] = useState<HuntChallenge | null>(null)
  const [currentProgress, setCurrentProgress] = useState<PlayerProgress | null>(null)
  const [allProgress, setAllProgress] = useState<PlayerProgress[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gameStats, setGameStats] = useState({
    completedChallenges: 0,
    totalPoints: 0,
    rank: 0,
    timeElapsed: 0
  })
  
  const { success, info } = useToastHelpers()

  // Load initial data
  useEffect(() => {
    loadGameData()
  }, [player.id, room.room_code])

  // Update game timer
  useEffect(() => {
    const startTime = new Date(player.joined_at).getTime()
    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [player.joined_at])

  const loadGameData = async () => {
    setIsLoading(true)
    try {
      // Load challenges
      const challengesResult = await getRoomChallenges(room.room_code)
      if (challengesResult.challenges) {
        setChallenges(challengesResult.challenges)
      }

      // Load current challenge and progress
      const currentResult = await getCurrentChallenge(player.id, room.room_code)
      if (currentResult.challenge) {
        setCurrentChallenge(currentResult.challenge)
        setCurrentProgress(currentResult.progress || null)
      }

      // Load leaderboard
      const leaderboardResult = await getRoomLeaderboard(room.room_code)
      if (leaderboardResult.leaderboard) {
        setLeaderboard(leaderboardResult.leaderboard)
        
        // Update player rank
        const playerRank = leaderboardResult.leaderboard.findIndex(
          entry => entry.player_id === player.id
        ) + 1
        setGameStats(prev => ({ ...prev, rank: playerRank }))
      }

      // Update stats
      setGameStats(prev => ({
        ...prev,
        totalPoints: player.score,
        completedChallenges: allProgress.filter(p => p.status === 'completed').length
      }))

    } catch (error) {
      console.error('Error loading game data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmissionComplete = async (progress: PlayerProgress) => {
    setCurrentProgress(progress)
    
    if (progress.is_correct) {
      success('Challenge completed!', `+${progress.points_earned} points`)
      
      // Update player stats
      setGameStats(prev => ({
        ...prev,
        completedChallenges: prev.completedChallenges + 1,
        totalPoints: prev.totalPoints + progress.points_earned
      }))

      // Load next challenge after a delay
      setTimeout(async () => {
        const nextResult = await getCurrentChallenge(player.id, room.room_code)
        if (nextResult.challenge) {
          setCurrentChallenge(nextResult.challenge)
          setCurrentProgress(nextResult.progress || null)
          info('Next challenge ready!', nextResult.challenge.challenge_data.title)
                 } else {
           // Game completed
           success('Congratulations!', 'You\'ve completed all challenges!')
           onGameComplete?.()
         }
      }, 2000)
    }

    // Refresh leaderboard
    setTimeout(loadGameData, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (challenges.length === 0) return 0
    return Math.round((gameStats.completedChallenges / challenges.length) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading game..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <AvatarDisplay
                avatarId={((player.metadata as any)?.avatar_id as AvatarId) || 'explorer'}
                size={40}
                variant="simple"
              />
              <div>
                <h1 className="font-semibold text-gray-900">{player.player_name}</h1>
                <p className="text-sm text-gray-600">{room.metadata?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{gameStats.totalPoints}</div>
                <div className="text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">#{gameStats.rank || '-'}</div>
                <div className="text-gray-500">Rank</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">{formatTime(gameStats.timeElapsed)}</div>
                <div className="text-gray-500">Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
            <span className="text-sm text-gray-600">
              {gameStats.completedChallenges} of {challenges.length} completed
            </span>
          </div>
          
          <div className="relative">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-sm font-medium text-blue-700">{getProgressPercentage()}%</div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div 
                style={{ width: `${getProgressPercentage()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* Challenge Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{gameStats.completedChallenges}</div>
              <div className="text-sm text-green-800">Completed</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalPoints}</div>
              <div className="text-sm text-blue-800">Total Points</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">#{gameStats.rank || '-'}</div>
              <div className="text-sm text-purple-800">Current Rank</div>
            </div>
          </div>
        </div>

        {/* Current Challenge */}
        {currentChallenge ? (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Challenge</h2>
                         <ChallengeCard
               challenge={currentChallenge}
               progress={currentProgress || undefined}
               playerId={player.id}
               onSubmissionComplete={handleSubmissionComplete}
               isActive={true}
             />
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-6">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-green-700 mb-4">
              You've completed all challenges in this hunt!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">{gameStats.totalPoints}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">#{gameStats.rank}</div>
                <div className="text-sm text-gray-600">Final Rank</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-purple-600">{formatTime(gameStats.timeElapsed)}</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </div>
        )}

        {/* Mini Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div 
                key={entry.player_id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.player_id === player.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-blue-400 text-blue-900'
                  }`}>
                    {index + 1}
                  </div>
                  <AvatarDisplay
                    avatarId={entry.avatar_id || 'explorer'}
                    size={32}
                    variant="simple"
                  />
                  <span className={`font-medium ${
                    entry.player_id === player.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {entry.player_name}
                    {entry.player_id === player.id && ' (You)'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{entry.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
          
          {leaderboard.length > 5 && gameStats.rank > 5 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                ... and {leaderboard.length - 5} more players
              </div>
              {gameStats.rank > 5 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-400 text-blue-900 flex items-center justify-center text-sm font-bold">
                      {gameStats.rank}
                    </div>
                    <span className="font-medium text-blue-900">{player.player_name} (You)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{gameStats.totalPoints}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameInterface 