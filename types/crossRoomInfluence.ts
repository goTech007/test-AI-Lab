export type RoomId = 'attention' | 'reaction' | 'pattern' | 'conflict'

export interface InfluenceState {
  sourceRoom: RoomId
  targetRoom: RoomId
  intensity: number // 0-1
  type: 'positive' | 'negative' | 'neutral'
  timestamp: number
}

export interface RoomActivity {
  roomId: RoomId
  activityLevel: number // 0-1
  lastActivity: number
}

