import React, { useState, useRef } from 'react'
import { HuntChallenge, PlayerProgress } from '@/types/room'
import { ChallengeSubmission, submitChallengeAnswer } from '@/services/challengeService'
import { useToastHelpers } from '../ui/Toast'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface ChallengeCardProps {
  challenge: HuntChallenge
  progress?: PlayerProgress
  playerId: string
  onSubmissionComplete?: (progress: PlayerProgress) => void
  isActive?: boolean
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  progress,
  playerId,
  onSubmissionComplete,
  isActive = false
}) => {
  const [submission, setSubmission] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error, info } = useToastHelpers()

  const isCompleted = progress?.status === 'completed'
  const isInProgress = progress?.status === 'in_progress'

  const handleSubmit = async () => {
    if (!submission.trim() && !imageFile) {
      error('Please provide an answer', 'Enter text or upload an image')
      return
    }

    setIsSubmitting(true)
    try {
      let submissionData: ChallengeSubmission['submission_data']

      if (challenge.challenge_type === 'photo' && imageFile) {
        // In a real app, you'd upload to cloud storage first
        const imageUrl = URL.createObjectURL(imageFile)
        submissionData = {
          image_url: imageUrl,
          timestamp: new Date().toISOString()
        }
      } else if (challenge.challenge_type === 'location') {
        // Get current location
        const position = await getCurrentPosition()
        submissionData = {
          coordinates: { lat: position.lat, lng: position.lng },
          timestamp: new Date().toISOString()
        }
      } else {
        submissionData = {
          text_answer: submission.trim(),
          timestamp: new Date().toISOString()
        }
      }

      const challengeSubmission: ChallengeSubmission = {
        challenge_id: challenge.id,
        player_id: playerId,
        submission_type: challenge.challenge_type === 'photo' ? 'photo' : 'text',
        submission_data: submissionData
      }

      const result = await submitChallengeAnswer(challengeSubmission)
      
      if (result.error) {
        error('Submission failed', result.error)
      } else if (result.progress) {
        if (result.progress.is_correct) {
          success('Correct!', `You earned ${result.progress.points_earned} points`)
        } else {
          info('Keep trying!', 'That\'s not quite right, but don\'t give up')
        }
        onSubmissionComplete?.(result.progress)
      }
    } catch (err) {
      error('Submission failed', 'Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const getDifficultyColor = () => {
    const difficulty = challenge.challenge_data.difficulty || 'medium'
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'hard': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'expert': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = () => {
    switch (challenge.challenge_type) {
      case 'photo': return '📸'
      case 'text': return '✏️'
      case 'location': return '📍'
      case 'qr_code': return '📱'
      case 'ai_prompt': return '🤖'
      default: return '❓'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 transition-all duration-300 ${
      isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    } ${isCompleted ? 'bg-green-50 border-green-300' : ''}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getTypeIcon()}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {challenge.challenge_data.title}
              </h3>
              {isCompleted && (
                <span className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-3">{challenge.challenge_data.description}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className={`px-2 py-1 rounded-full border ${getDifficultyColor()}`}>
                {challenge.challenge_data.difficulty || 'Medium'}
              </span>
              <span className="text-gray-500">
                🏆 {challenge.points} points
              </span>
              {challenge.time_limit_seconds && (
                <span className="text-gray-500">
                  ⏱️ {Math.round(challenge.time_limit_seconds / 60)}min
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {progress && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium ${
              progress.status === 'completed' ? 'text-green-600' :
              progress.status === 'in_progress' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              Status: {progress.status.replace('_', ' ')}
            </span>
            
            {progress.points_earned > 0 && (
              <span className="text-green-600 font-medium">
                +{progress.points_earned} points
              </span>
            )}
          </div>
          
          {progress.submission_data?.validation_result && (
            <div className="mt-2 text-sm text-gray-600">
              <p>{progress.submission_data.validation_result.explanation}</p>
              {progress.submission_data.validation_result.suggestions && (
                <ul className="mt-1 list-disc list-inside text-xs">
                  {progress.submission_data.validation_result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submission Form */}
      {!isCompleted && isActive && (
        <div className="p-6">
          {challenge.challenge_type === 'photo' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors text-center"
                >
                  {imageFile ? (
                    <div>
                      <span className="text-green-600">📸 {imageFile.name}</span>
                      <p className="text-sm text-gray-500 mt-1">Click to change photo</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-gray-500">📸 Tap to take or upload photo</span>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG, or HEIC</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : challenge.challenge_type === 'location' ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-gray-600 mb-4">
                We'll use your current location when you submit
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Enter your answer here..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Hint Section */}
          {challenge.challenge_data.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showHint ? '🔼' : '💡'} {showHint ? 'Hide' : 'Show'} Hint
              </button>
              
              {showHint && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{challenge.challenge_data.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!submission.trim() && !imageFile)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting || (!submission.trim() && !imageFile)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Completed State */}
      {isCompleted && (
        <div className="p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h4 className="text-lg font-semibold text-green-800 mb-1">
            Challenge Completed!
          </h4>
          <p className="text-green-600">
            You earned {progress?.points_earned} points
          </p>
          
          {progress?.submitted_answer && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-left">
              <p className="text-sm text-green-800">
                <strong>Your answer:</strong> {progress.submitted_answer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Not Active State */}
      {!isActive && !isCompleted && (
        <div className="p-6 text-center text-gray-500">
          <div className="text-3xl mb-2">🔒</div>
          <p>Complete previous challenges to unlock</p>
        </div>
      )}
    </div>
  )
}

export default ChallengeCard 