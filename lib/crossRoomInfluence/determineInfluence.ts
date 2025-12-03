import type { RoomId, InfluenceState } from '@/types/crossRoomInfluence'

interface RoomActivityData {
  roomId: RoomId
  activityLevel: number
}

export const determineInfluence = (
  sourceRoom: RoomActivityData,
  targetRoom: RoomActivityData
): InfluenceState | null => {
  // Only create influence if source room has high activity
  if (sourceRoom.activityLevel < 0.5) {
    return null
  }

  // Calculate influence intensity based on source activity
  const intensity = Math.min(sourceRoom.activityLevel * 1.2, 1)

  // Determine influence type based on room combinations
  let type: 'positive' | 'negative' | 'neutral' = 'neutral'
  
  if (sourceRoom.roomId === 'reaction' && targetRoom.roomId === 'pattern') {
    // Reaction room speeds up pattern prediction
    type = 'positive'
  } else if (sourceRoom.roomId === 'attention' && targetRoom.roomId === 'conflict') {
    // Attention room stabilizes conflict
    type = 'positive'
  } else if (sourceRoom.roomId === 'conflict' && targetRoom.roomId === 'reaction') {
    // Conflict room disrupts reaction time
    type = 'negative'
  } else if (sourceRoom.roomId === 'pattern' && targetRoom.roomId === 'attention') {
    // Pattern room enhances attention detection
    type = 'positive'
  } else {
    // Default neutral influence
    type = 'neutral'
  }

  return {
    sourceRoom: sourceRoom.roomId,
    targetRoom: targetRoom.roomId,
    intensity,
    type,
    timestamp: Date.now(),
  }
}

