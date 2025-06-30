import { supabase } from '@/lib/supabase'
import { HuntChallenge, PlayerProgress } from '@/types/room'

export interface ChallengeTemplate {
  id: string
  name: string
  description: string
  type: HuntChallenge['challenge_type']
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  estimated_time: number
  points: number
  theme: 'urban' | 'nature' | 'indoor' | 'mixed'
  template_data: any
}

export interface ChallengeSubmission {
  challenge_id: string
  player_id: string
  submission_type: 'text' | 'photo' | 'location' | 'qr_code'
  submission_data: {
    text_answer?: string
    image_url?: string
    coordinates?: { lat: number; lng: number }
    qr_code_data?: string
    timestamp: string
    device_info?: any
  }
}

export interface AIValidationResult {
  is_correct: boolean
  confidence: number
  explanation: string
  partial_credit?: number
  suggestions?: string[]
}

/**
 * Pre-built challenge templates for different themes and difficulties
 */
export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'urban_photo_landmark',
    name: 'Landmark Hunter',
    description: 'Find and photograph a famous local landmark',
    type: 'photo',
    difficulty: 'easy',
    estimated_time: 10,
    points: 10,
    theme: 'urban',
    template_data: {
      hint: 'Look for something tall and historic',
      validation_keywords: ['building', 'statue', 'monument', 'landmark'],
      required_elements: ['architecture', 'public space']
    }
  },
  {
    id: 'nature_location_tree',
    name: 'Ancient Guardian',
    description: 'Find the oldest tree in the area',
    type: 'location',
    difficulty: 'medium',
    estimated_time: 15,
    points: 15,
    theme: 'nature',
    template_data: {
      hint: 'Seek the wisdom of age in bark and branch',
      radius: 50,
      validation_criteria: ['tree_age', 'size', 'species']
    }
  },
  {
    id: 'indoor_qr_hidden',
    name: 'Digital Detective',
    description: 'Scan the hidden QR code',
    type: 'qr_code',
    difficulty: 'hard',
    estimated_time: 20,
    points: 25,
    theme: 'indoor',
    template_data: {
      hint: 'Not all codes are where you expect them',
      qr_code_content: 'SECRET_CODE_INDOOR_HUNT',
      hidden_locations: ['behind_poster', 'under_table', 'inside_book']
    }
  },
  {
    id: 'mixed_ai_riddle',
    name: 'AI Oracle',
    description: 'Solve this AI-generated riddle',
    type: 'ai_prompt',
    difficulty: 'expert',
    estimated_time: 25,
    points: 30,
    theme: 'mixed',
    template_data: {
      ai_prompt: 'Generate a location-based riddle about finding something that connects past and present',
      validation_type: 'semantic_similarity',
      acceptable_answers: ['bridge', 'library', 'museum', 'clock tower']
    }
  }
]

/**
 * Creates challenges for a room based on theme and difficulty
 */
export async function generateRoomChallenges(
  roomCode: string,
  theme: string,
  difficulty: string,
  challengeCount: number = 5
): Promise<{ challenges?: HuntChallenge[]; error?: string }> {
  try {
    // Filter templates based on theme and difficulty
    const suitableTemplates = CHALLENGE_TEMPLATES.filter(template => 
      (template.theme === theme || theme === 'mixed') &&
      (template.difficulty === difficulty || Math.abs(
        ['easy', 'medium', 'hard', 'expert'].indexOf(template.difficulty) -
        ['easy', 'medium', 'hard', 'expert'].indexOf(difficulty as any)
      ) <= 1)
    )

    if (suitableTemplates.length === 0) {
      return { error: 'No suitable challenge templates found' }
    }

    // Select random templates and create challenges
    const selectedTemplates = []
    for (let i = 0; i < challengeCount; i++) {
      const template = suitableTemplates[i % suitableTemplates.length]
      selectedTemplates.push({ ...template, order: i + 1 })
    }

    const challenges: Omit<HuntChallenge, 'id'>[] = selectedTemplates.map((template, index) => ({
      room_code: roomCode,
      challenge_order: index + 1,
      challenge_type: template.type,
      challenge_data: {
        title: template.name,
        description: template.description,
        hint: template.template_data.hint,
        ...template.template_data
      },
      ai_prompt: template.template_data.ai_prompt,
      correct_answer: template.template_data.correct_answer,
      points: template.points,
      time_limit_seconds: template.estimated_time * 60,
      created_at: new Date().toISOString()
    }))

    // Insert challenges into database
    const { data, error } = await supabase
      .from('hunt_challenges')
      .insert(challenges)
      .select()

    if (error) {
      console.error('Error creating challenges:', error)
      return { error: 'Failed to create challenges' }
    }

    return { challenges: data as HuntChallenge[] }
  } catch (error) {
    console.error('Unexpected error generating challenges:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Gets all challenges for a room
 */
export async function getRoomChallenges(
  roomCode: string
): Promise<{ challenges?: HuntChallenge[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('hunt_challenges')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .order('challenge_order', { ascending: true })

    if (error) {
      console.error('Error getting challenges:', error)
      return { error: 'Failed to load challenges' }
    }

    return { challenges: data as HuntChallenge[] }
  } catch (error) {
    console.error('Unexpected error getting challenges:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Submits a challenge answer for validation
 */
export async function submitChallengeAnswer(
  submission: ChallengeSubmission
): Promise<{ progress?: PlayerProgress; error?: string }> {
  try {
    // Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('hunt_challenges')
      .select('*')
      .eq('id', submission.challenge_id)
      .single()

    if (challengeError || !challenge) {
      return { error: 'Challenge not found' }
    }

    // Validate submission based on challenge type
    const validationResult = await validateSubmission(challenge, submission)

    // Create or update progress record
    const progressData = {
      player_id: submission.player_id,
      challenge_id: submission.challenge_id,
      status: validationResult.is_correct ? 'completed' : 'in_progress',
      submitted_answer: getSubmissionText(submission),
      is_correct: validationResult.is_correct,
      points_earned: validationResult.is_correct ? challenge.points : (validationResult.partial_credit || 0),
      completed_at: validationResult.is_correct ? new Date().toISOString() : undefined,
      submission_data: {
        ...submission.submission_data,
        validation_result: validationResult,
        attempts: 1 // This should be incremented if updating existing
      }
    }

    const { data, error } = await supabase
      .from('player_progress')
      .upsert(progressData)
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
      return { error: 'Failed to submit answer' }
    }

    // Update player total score if correct
    if (validationResult.is_correct) {
      await supabase.rpc('increment_player_score', {
        player_id: submission.player_id,
        points: challenge.points
      })
    }

    return { progress: data as PlayerProgress }
  } catch (error) {
    console.error('Unexpected error submitting answer:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Validates a challenge submission based on its type
 */
async function validateSubmission(
  challenge: HuntChallenge,
  submission: ChallengeSubmission
): Promise<AIValidationResult> {
  try {
    switch (challenge.challenge_type) {
      case 'text':
        return validateTextSubmission(challenge, submission.submission_data.text_answer || '')
      
      case 'photo':
        return await validatePhotoSubmission(challenge, submission.submission_data.image_url || '')
      
      case 'location':
        return validateLocationSubmission(challenge, submission.submission_data.coordinates)
      
      case 'qr_code':
        return validateQRCodeSubmission(challenge, submission.submission_data.qr_code_data || '')
      
      case 'ai_prompt':
        return await validateAIPromptSubmission(challenge, submission.submission_data.text_answer || '')
      
      default:
        return {
          is_correct: false,
          confidence: 0,
          explanation: 'Unknown challenge type'
        }
    }
  } catch (error) {
    console.error('Error validating submission:', error)
    return {
      is_correct: false,
      confidence: 0,
      explanation: 'Validation error occurred'
    }
  }
}

/**
 * Validates text-based submissions
 */
function validateTextSubmission(challenge: HuntChallenge, answer: string): AIValidationResult {
  const correctAnswer = challenge.correct_answer?.toLowerCase() || ''
  const userAnswer = answer.toLowerCase().trim()
  
  if (!correctAnswer) {
    // Use keyword matching from challenge data
    const keywords = challenge.challenge_data.validation_keywords || []
    const matches = keywords.filter((keyword: string) => 
      userAnswer.includes(keyword.toLowerCase())
    )
    
    const confidence = matches.length / Math.max(keywords.length, 1)
    return {
      is_correct: confidence >= 0.5,
      confidence,
      explanation: confidence >= 0.5 
        ? `Great! You found ${matches.length} key elements.`
        : `Try to include more specific details. Look for: ${keywords.join(', ')}`
    }
  }
  
  // Exact or fuzzy matching
  const exactMatch = userAnswer === correctAnswer
  const similarityScore = calculateStringSimilarity(userAnswer, correctAnswer)
  
  return {
    is_correct: exactMatch || similarityScore > 0.8,
    confidence: exactMatch ? 1.0 : similarityScore,
    explanation: exactMatch 
      ? 'Perfect answer!' 
      : similarityScore > 0.8 
        ? 'Close enough! Good work.'
        : 'Not quite right. Try again!',
    partial_credit: similarityScore > 0.6 ? Math.round(challenge.points * similarityScore) : 0
  }
}

/**
 * Validates photo submissions (mock AI implementation)
 */
async function validatePhotoSubmission(challenge: HuntChallenge, imageUrl: string): Promise<AIValidationResult> {
  // In a real implementation, this would use computer vision APIs
  // For now, we'll simulate AI validation
  
  if (!imageUrl) {
    return {
      is_correct: false,
      confidence: 0,
      explanation: 'No image provided'
    }
  }

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const keywords = challenge.challenge_data.validation_keywords || []
  const requiredElements = challenge.challenge_data.required_elements || []
  
  // Mock AI confidence based on challenge complexity
  const mockConfidence = 0.7 + Math.random() * 0.3 // 70-100% confidence
  const isCorrect = mockConfidence > 0.75

  return {
    is_correct: isCorrect,
    confidence: mockConfidence,
    explanation: isCorrect
      ? `Excellent photo! I can see the ${keywords.join(' and ')} clearly.`
      : `I can't quite identify all the required elements. Make sure your photo shows: ${requiredElements.join(', ')}`,
    suggestions: isCorrect ? [] : [
      'Try getting closer to the subject',
      'Ensure good lighting',
      'Include more context in the frame'
    ]
  }
}

/**
 * Validates location-based submissions
 */
function validateLocationSubmission(
  challenge: HuntChallenge, 
  coordinates?: { lat: number; lng: number }
): AIValidationResult {
  if (!coordinates) {
    return {
      is_correct: false,
      confidence: 0,
      explanation: 'Location not provided'
    }
  }

  const targetLocation = challenge.challenge_data.target_location
  if (!targetLocation) {
    return {
      is_correct: true,
      confidence: 1.0,
      explanation: 'Location recorded successfully!'
    }
  }

  // Calculate distance between submitted and target location
  const distance = calculateDistance(
    coordinates.lat, coordinates.lng,
    targetLocation.lat, targetLocation.lng
  )

  const radius = targetLocation.radius || 100 // Default 100m radius
  const isCorrect = distance <= radius
  const confidence = Math.max(0, 1 - (distance / (radius * 2)))

  return {
    is_correct: isCorrect,
    confidence,
    explanation: isCorrect
      ? `Perfect! You're ${Math.round(distance)}m from the target.`
      : `You're ${Math.round(distance)}m away. Get within ${radius}m of the target.`
  }
}

/**
 * Validates QR code submissions
 */
function validateQRCodeSubmission(challenge: HuntChallenge, qrData: string): AIValidationResult {
  const expectedData = challenge.challenge_data.qr_code_content || challenge.correct_answer
  
  if (!expectedData) {
    return {
      is_correct: true,
      confidence: 1.0,
      explanation: 'QR code scanned successfully!'
    }
  }

  const isCorrect = qrData === expectedData
  return {
    is_correct: isCorrect,
    confidence: isCorrect ? 1.0 : 0.0,
    explanation: isCorrect
      ? 'Correct QR code found!'
      : 'This is not the QR code you\'re looking for.'
  }
}

/**
 * Validates AI prompt submissions (mock OpenAI integration)
 */
async function validateAIPromptSubmission(challenge: HuntChallenge, answer: string): Promise<AIValidationResult> {
  // In a real implementation, this would use OpenAI's API
  // For now, we'll simulate AI validation
  
  const acceptableAnswers = challenge.challenge_data.acceptable_answers || []
  const userAnswer = answer.toLowerCase().trim()
  
  // Check for direct matches first
  const directMatch = acceptableAnswers.some((acceptable: string) => 
    userAnswer.includes(acceptable.toLowerCase())
  )
  
  if (directMatch) {
    return {
      is_correct: true,
      confidence: 0.95,
      explanation: 'Excellent reasoning! You found a valid solution.'
    }
  }

  // Simulate AI semantic analysis
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const semanticScore = Math.random() * 0.4 + 0.3 // 30-70% for non-direct matches
  const isCorrect = semanticScore > 0.6
  
  return {
    is_correct: isCorrect,
    confidence: semanticScore,
    explanation: isCorrect
      ? 'Creative thinking! That\'s a valid interpretation.'
      : 'Interesting idea, but not quite what we\'re looking for. Think about the clues differently.',
    suggestions: isCorrect ? [] : [
      'Consider the literal meaning of the clues',
      'Think about physical locations that match the description',
      'Look for connections between past and present'
    ]
  }
}

/**
 * Helper function to extract text from submission
 */
function getSubmissionText(submission: ChallengeSubmission): string {
  switch (submission.submission_type) {
    case 'text':
      return submission.submission_data.text_answer || ''
    case 'photo':
      return `Photo: ${submission.submission_data.image_url}`
    case 'location':
      const coords = submission.submission_data.coordinates
      return coords ? `Location: ${coords.lat}, ${coords.lng}` : 'Location submission'
    case 'qr_code':
      return `QR Code: ${submission.submission_data.qr_code_data}`
    default:
      return 'Unknown submission type'
  }
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null))

  for (let i = 0; i <= len1; i++) matrix[0][i] = i
  for (let j = 0; j <= len2; j++) matrix[j][0] = j

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }

  const maxLen = Math.max(len1, len2)
  return maxLen === 0 ? 1 : 1 - matrix[len2][len1] / maxLen
}

/**
 * Calculate distance between two coordinates in meters
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

/**
 * Get player's current challenge
 */
export async function getCurrentChallenge(
  playerId: string,
  roomCode: string
): Promise<{ challenge?: HuntChallenge; progress?: PlayerProgress; error?: string }> {
  try {
    // Get all challenges for the room
    const { challenges, error: challengesError } = await getRoomChallenges(roomCode)
    if (challengesError || !challenges) {
      return { error: challengesError || 'No challenges found' }
    }

    // Get player's progress
    const { data: progressData, error: progressError } = await supabase
      .from('player_progress')
      .select('*')
      .eq('player_id', playerId)
      .in('challenge_id', challenges.map(c => c.id))

    if (progressError) {
      console.error('Error getting player progress:', progressError)
      return { error: 'Failed to load progress' }
    }

    // Find the first incomplete challenge
    const completedChallengeIds = (progressData || [])
      .filter(p => p.status === 'completed')
      .map(p => p.challenge_id)

    const currentChallenge = challenges.find(c => !completedChallengeIds.includes(c.id))
    
    if (!currentChallenge) {
      return { error: 'All challenges completed!' }
    }

    // Get progress for current challenge if any
    const currentProgress = progressData?.find(p => p.challenge_id === currentChallenge.id)

    return {
      challenge: currentChallenge,
      progress: currentProgress as PlayerProgress | undefined
    }
  } catch (error) {
    console.error('Unexpected error getting current challenge:', error)
    return { error: 'An unexpected error occurred' }
  }
} 