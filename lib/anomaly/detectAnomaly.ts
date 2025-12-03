import type { RoomId, Anomaly, AnomalyType } from '@/types/anomaly'

interface BehaviorMetrics {
  value: number
  expectedRange: [number, number]
  history: number[]
  timestamp: number
}

interface AnomalyConfig {
  probability: number // 0-1, chance of anomaly occurring
  severityDistribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

export const detectAnomaly = (
  roomId: RoomId,
  metrics: BehaviorMetrics,
  config: AnomalyConfig = {
    probability: 0.15, // 15% chance per check
    severityDistribution: {
      low: 0.5,
      medium: 0.3,
      high: 0.15,
      critical: 0.05,
    },
  }
): Anomaly | null => {
  // Random chance of anomaly
  if (Math.random() > config.probability) {
    return null
  }

  // Determine anomaly type based on room and metrics
  const anomalyType = determineAnomalyType(roomId, metrics)
  if (!anomalyType) return null

  // Determine severity
  const severity = determineSeverity(metrics, config.severityDistribution)

  // Generate description
  const description = generateAnomalyDescription(roomId, anomalyType, severity)

  return {
    id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    roomId,
    type: anomalyType,
    severity,
    timestamp: Date.now(),
    duration: getAnomalyDuration(severity),
    description,
  }
}

const determineAnomalyType = (
  roomId: RoomId,
  metrics: BehaviorMetrics
): AnomalyType | null => {
  const { value, expectedRange, history } = metrics

  // Check for sudden spike
  if (history.length > 2) {
    const recentAvg = history.slice(-3).reduce((a, b) => a + b, 0) / 3
    const currentDiff = Math.abs(value - recentAvg) / (recentAvg || 1)
    if (currentDiff > 0.5 && value > expectedRange[1]) {
      return 'sudden_spike'
    }
  }

  // Check for unexpected drop
  if (value < expectedRange[0] * 0.7) {
    return 'unexpected_drop'
  }

  // Check for pattern break
  if (history.length > 5) {
    const pattern = history.slice(-5)
    const isPattern = pattern.every((v, i) => 
      i === 0 || Math.abs(v - pattern[i - 1]) < 0.1
    )
    if (!isPattern && Math.abs(value - pattern[pattern.length - 1]) > 0.3) {
      return 'pattern_break'
    }
  }

  // Check for timing anomaly
  if (roomId === 'reaction' || roomId === 'attention') {
    const timingVariance = calculateVariance(history)
    if (timingVariance > 0.4) {
      return 'timing_anomaly'
    }
  }

  // Check for behavioral deviation
  const deviation = Math.abs(value - (expectedRange[0] + expectedRange[1]) / 2)
  const rangeSize = expectedRange[1] - expectedRange[0]
  if (deviation > rangeSize * 0.6) {
    return 'behavioral_deviation'
  }

  // Default to system instability
  if (Math.random() < 0.3) {
    return 'system_instability'
  }

  return null
}

const determineSeverity = (
  metrics: BehaviorMetrics,
  distribution: AnomalyConfig['severityDistribution']
): Anomaly['severity'] => {
  const rand = Math.random()
  const { value, expectedRange } = metrics

  // Calculate deviation from expected
  const expectedMid = (expectedRange[0] + expectedRange[1]) / 2
  const deviation = Math.abs(value - expectedMid) / (expectedRange[1] - expectedRange[0] || 1)

  // Higher deviation = higher severity
  if (deviation > 0.8 && rand < distribution.critical) {
    return 'critical'
  } else if (deviation > 0.6 && rand < distribution.high) {
    return 'high'
  } else if (deviation > 0.4 && rand < distribution.medium) {
    return 'medium'
  } else {
    return 'low'
  }
}

const generateAnomalyDescription = (
  roomId: RoomId,
  type: AnomalyType,
  severity: Anomaly['severity']
): string => {
  const roomNames: Record<RoomId, string> = {
    attention: 'Attention Response',
    reaction: 'Reaction Time',
    pattern: 'Pattern Prediction',
    conflict: 'Behavioral Conflict',
  }

  const typeMessages: Record<AnomalyType, string> = {
    sudden_spike: 'Sudden activity spike detected',
    unexpected_drop: 'Unexpected performance drop',
    pattern_break: 'Pattern recognition failure',
    timing_anomaly: 'Timing irregularity detected',
    behavioral_deviation: 'Behavioral pattern deviation',
    system_instability: 'System instability detected',
  }

  return `[${roomNames[roomId]}] ${typeMessages[type]} (${severity.toUpperCase()})`
}

const getAnomalyDuration = (severity: Anomaly['severity']): number => {
  switch (severity) {
    case 'critical':
      return 8000 // 8 seconds
    case 'high':
      return 5000 // 5 seconds
    case 'medium':
      return 3000 // 3 seconds
    case 'low':
      return 2000 // 2 seconds
  }
}

const calculateVariance = (values: number[]): number => {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  return Math.sqrt(variance) / (mean || 1)
}

