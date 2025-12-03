import type { RoomId } from '@/types/crossRoomInfluence'

interface ActivityMetrics {
  eventCount: number
  timeWindow: number // milliseconds
  intensity: number // 0-1
}

export const calculateActivityLevel = (
  metrics: ActivityMetrics
): number => {
  const { eventCount, timeWindow, intensity } = metrics
  
  // Calculate activity based on event frequency and intensity
  const eventsPerSecond = eventCount / (timeWindow / 1000)
  const normalizedFrequency = Math.min(eventsPerSecond / 5, 1) // Normalize to 0-1
  
  // Combine frequency and intensity
  const activityLevel = (normalizedFrequency * 0.6 + intensity * 0.4)
  
  return Math.max(0, Math.min(1, activityLevel))
}

export const getRoomActivityThreshold = (roomId: RoomId): number => {
  // Different rooms have different thresholds for triggering influence
  switch (roomId) {
    case 'reaction':
      return 0.6 // Reaction room needs high activity
    case 'attention':
      return 0.5
    case 'pattern':
      return 0.55
    case 'conflict':
      return 0.65 // Conflict room needs very high activity
    default:
      return 0.5
  }
}

