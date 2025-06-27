import React, { useState } from 'react'
import { CreateRoomData } from '@/types/room'
import { createRoom } from '@/services/roomService'
import { useAvatar } from '@/hooks/useAvatar'
import { AvatarDisplay } from '../avatars/AvatarDisplay'

interface RoomCreatorProps {
  hostId: string
  hostEmail: string
  onRoomCreated?: (roomCode: string) => void
  onCancel?: () => void
}

export const RoomCreator: React.FC<RoomCreatorProps> = ({
  hostId,
  hostEmail,
  onRoomCreated,
  onCancel
}) => {
  const { selectedAvatar, avatarData } = useAvatar()
  
  const [formData, setFormData] = useState<CreateRoomData>({
    title: '',
    description: '',
    max_players: 25,
    time_limit: 30,
    difficulty: 'medium',
    theme: 'mixed',
    is_public: true,
    tags: []
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')

  const handleInputChange = (field: keyof CreateRoomData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      handleInputChange('tags', [...(formData.tags || []), newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || [])
  }

  const handleCreateRoom = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const result = await createRoom(hostId, hostEmail, formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.room) {
        onRoomCreated?.(result.room.room_code)
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Error creating room:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Hunt Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a catchy title for your scavenger hunt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what players can expect in this hunt..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="max_players" className="block text-sm font-medium text-gray-700 mb-2">
                Max Players
              </label>
              <select
                id="max_players"
                value={formData.max_players}
                onChange={(e) => handleInputChange('max_players', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10 players</option>
                <option value={25}>25 players</option>
                <option value={50}>50 players</option>
                <option value={100}>100 players</option>
              </select>
            </div>

            <div>
              <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <select
                id="time_limit"
                value={formData.time_limit}
                onChange={(e) => handleInputChange('time_limit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hunt Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['easy', 'medium', 'hard', 'expert'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleInputChange('difficulty', difficulty)}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    formData.difficulty === difficulty
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{difficulty}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {difficulty === 'easy' && 'Beginner friendly'}
                    {difficulty === 'medium' && 'Balanced challenge'}
                    {difficulty === 'hard' && 'Expert level'}
                    {difficulty === 'expert' && 'Master challenge'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hunt Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'urban', label: 'Urban', icon: '🏙️', desc: 'City exploration' },
                { id: 'nature', label: 'Nature', icon: '🌲', desc: 'Outdoor adventure' },
                { id: 'indoor', label: 'Indoor', icon: '🏢', desc: 'Building exploration' },
                { id: 'mixed', label: 'Mixed', icon: '🗺️', desc: 'Variety of locations' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleInputChange('theme', theme.id)}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    formData.theme === theme.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-xs text-gray-500">{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="is_public"
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => handleInputChange('is_public', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
              Make this hunt public (visible to all users)
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview & Confirm</h3>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          {/* Host Info */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
            {selectedAvatar && avatarData && (
              <AvatarDisplay
                avatarId={selectedAvatar}
                size={50}
                showName={true}
                userName="You (Host)"
                variant="compact"
              />
            )}
            <div className="flex-1">
              <div className="text-sm text-gray-600">Host: {hostEmail}</div>
            </div>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Hunt Details</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Title:</dt>
                  <dd className="font-medium">{formData.title || 'Untitled Hunt'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Max Players:</dt>
                  <dd className="font-medium">{formData.max_players}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Time Limit:</dt>
                  <dd className="font-medium">{formData.time_limit} minutes</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Difficulty:</dt>
                  <dd className="font-medium capitalize">{formData.difficulty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Theme:</dt>
                  <dd className="font-medium capitalize">{formData.theme}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Visibility:</dt>
                  <dd className="font-medium">{formData.is_public ? 'Public' : 'Private'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Additional Info</h4>
              {formData.description && (
                <div className="mb-3">
                  <dt className="text-sm text-gray-600 mb-1">Description:</dt>
                  <dd className="text-sm">{formData.description}</dd>
                </div>
              )}
              
              {formData.tags && formData.tags.length > 0 && (
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Tags:</dt>
                  <dd className="flex flex-wrap gap-1">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Create New Hunt</h2>
        <div className="mt-2 flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
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
          
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && !formData.title?.trim()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                (currentStep === 1 && !formData.title?.trim())
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreateRoom}
              disabled={isCreating || !formData.title?.trim()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isCreating || !formData.title?.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isCreating ? 'Creating...' : 'Create Hunt'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomCreator 