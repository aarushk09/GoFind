/**
 * Generates a random 6-character room code
 * Uses uppercase letters and numbers, excluding confusing characters (0, O, I, 1)
 */
export function generateRoomCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return result
}

/**
 * Validates a room code format
 */
export function isValidRoomCode(code: string): boolean {
  const pattern = /^[A-Z2-9]{6}$/
  return pattern.test(code)
}

/**
 * Formats room code for display (adds spacing)
 */
export function formatRoomCode(code: string): string {
  return code.replace(/(.{3})(.{3})/, '$1 $2')
}
