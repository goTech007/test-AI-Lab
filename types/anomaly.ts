export type RoomId = 'attention' | 'reaction' | 'pattern' | 'conflict'

export type AnomalyType = 
  | 'sudden_spike'
  | 'unexpected_drop'
  | 'pattern_break'
  | 'timing_anomaly'
  | 'behavioral_deviation'
  | 'system_instability'

export interface Anomaly {
  id: string
  roomId: RoomId
  type: AnomalyType
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
  duration: number // milliseconds
  description: string
}

