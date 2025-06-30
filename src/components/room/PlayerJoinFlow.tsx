import React, { useState, useEffect } from 'react'
import { Room, Player } from '@/types/room'
import { joinRoom } from '@/services/playerService'
import { getRoomByCode } from '@/services/roomService'
import { AvatarSelector } from '../avatars/AvatarSelector'
import { AvatarDisplay } from '../avatars/AvatarDisplay'
import { AvatarId } from '../avatars/AvatarTypes'

interface PlayerJoinFlowProps {
  roomCode?: string
  onJoinSuccess?: (player: Player, room: Room) => void
  onCancel?: () => void
}

export const PlayerJoinFlow: React.FC<PlayerJoinFlowProps> = ({
  roomCode: initialRoomCode,
  onJoinSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [roomCode, setRoomCode] = useState(initialRoomCode || '')
  const [room, setRoom] = useState<Room | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [playerEmail, setPlayerEmail] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('explorer')
  const [preferences, setPreferences] = useState({
    notifications: true,
    sound_effects: true,
    dark_mode: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load room info when room code changes
  useEffect(() => {
    if (roomCode.length === 6) {
      loadRoomInfo()
    } else {
      setRoom(null)
    }
  }, [roomCode])

  const loadRoomInfo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getRoomByCode(roomCode)
      if (result.error) {
        setError(result.error)
        setRoom(null)
      } else {
        setRoom(result.room || null)
        if (result.room && result.room.status !== 'waiting') {
          setError('This room is not accepting new players')
        }
      }
    } catch (error) {
      setError('Failed to load room information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!room || !playerName.trim()) return

    setIsJoining(true)
    setError(null)

    try {
      const result = await joinRoom(
        roomCode,
        playerName.trim(),
        playerEmail.trim() || undefined,
        selectedAvatar,
        {
          device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          preferences
        }
      )

      if (result.error) {
        setError(result.error)
      } else if (result.player) {
        onJoinSuccess?.(result.player, room)
      }
    } catch (error) {
      setError('Failed to join room')
      console.error('Error joining room:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Room Code</h3>
        <p className="text-gray-600">Enter the 6-character code provided by the host</p>
      </div>

      <div>
        <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
          Room Code
        </label>
        <input
          id="roomCode"
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={6}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading room info...</span>
        </div>
      )}

      {room && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-800">Room Found</span>
          </div>
          <h4 className="font-medium text-gray-900">{room.metadata?.title}</h4>
          <p className="text-sm text-gray-600">{room.metadata?.description}</p>
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span>Max: {room.metadata?.max_players} players</span>
            <span>Duration: {room.metadata?.time_limit}m</span>
            <span className="capitalize">Difficulty: {room.metadata?.difficulty}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Player Information</h3>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name *
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">{playerName.length}/20 characters</p>
        </div>

        <div>
          <label htmlFor="playerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email (optional)
          </label>
          <input
            id="playerEmail"
            type="email"
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">For notifications and updates</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferences
          </label>
          <div className="space-y-2">
            {[
              { key: 'notifications', label: 'Enable notifications', desc: 'Get updates about the hunt' },
              { key: 'sound_effects', label: 'Sound effects', desc: 'Play sounds for actions and alerts' },
              { key: 'dark_mode', label: 'Dark mode', desc: 'Use dark theme (if available)' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start">
                <input
                  id={key}
                  type="checkbox"
                  checked={preferences[key as keyof typeof preferences]}
                  onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <label htmlFor={key} className="text-sm text-gray-900 font-medium">
                    {label}
                  </label>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Avatar</h3>
        <p className="text-gray-600">Pick an avatar that represents you in the hunt</p>
      </div>

      <div className="text-center mb-6">
        <AvatarDisplay
          avatarId={selectedAvatar}
          size={100}
          showName={true}
          userName={playerName || 'Preview'}
          variant="card"
          className="mx-auto"
        />
      </div>

      <AvatarSelector
        selectedAvatarId={selectedAvatar}
        onAvatarSelect={setSelectedAvatar}
        size={60}
        showNames={true}
        showDescriptions={false}
      />
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Join</h3>
        <p className="text-gray-600">Review your information before joining the hunt</p>
      </div>

      {room && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          {/* Room Info */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">Hunt: {room.metadata?.title}</h4>
            <p className="text-sm text-gray-600">{room.metadata?.description}</p>
          </div>

          {/* Player Info */}
          <div className="flex items-center space-x-4">
            <AvatarDisplay
              avatarId={selectedAvatar}
              size={60}
              variant="simple"
            />
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">{playerName}</h5>
              {playerEmail && (
                <p className="text-sm text-gray-600">{playerEmail}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(preferences).map(([key, value]) => 
                  value && (
                    <span key={key} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {key.replace('_', ' ')}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  )

  const canProceed = () => {
    switch (currentStep) {
      case 1: return room && !error && !isLoading
      case 2: return playerName.trim().length > 0
      case 3: return selectedAvatar
      case 4: return true
      default: return false
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Join Hunt</h2>
        <div className="mt-2 flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full ${
                step === currentStep
                  ? 'bg-blue-600'
                  : step < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
        <div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleJoinRoom}
              disabled={isJoining || !canProceed()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isJoining || !canProceed()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isJoining ? 'Joining...' : 'Join Hunt'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerJoinFlow 