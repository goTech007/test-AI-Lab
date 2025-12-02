interface MetricHistory {
  detections: number[]
  misses: number[]
  reactionTimes?: number[]
  timestamps: number[]
}

export interface BehavioralMetrics {
  stability: number
  variability: number
  deviation: number
  reactivity: number
}

export const calculateBehavioralMetrics = (
  history: MetricHistory,
  currentValue?: number
): BehavioralMetrics => {
  const { detections, misses, reactionTimes, timestamps } = history

  // Stability: Consistency of detection rate over time
  const detectionRate = detections.length / (detections.length + misses.length) || 0
  const recentDetectionRate = detections.slice(-10).length / 10 || 0
  const stability = 1 - Math.abs(detectionRate - recentDetectionRate)

  // Variability: How much the values fluctuate
  const allValues = reactionTimes && reactionTimes.length > 0 
    ? reactionTimes 
    : detections.map((_, i) => (detections[i] ? 1 : 0))
  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length || 0
  const variance = allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allValues.length || 0
  const variability = Math.min(Math.sqrt(variance) / (mean || 1), 1)

  // Deviation: How far from expected behavior
  const expectedRate = 0.7 // Expected 70% detection rate
  const deviation = Math.abs(detectionRate - expectedRate)

  // Reactivity: How quickly the system responds to changes
  const timeWindow = timestamps.length > 1 
    ? timestamps[timestamps.length - 1] - timestamps[0] 
    : 1000
  const eventFrequency = (detections.length + misses.length) / (timeWindow / 1000) || 0
  const reactivity = Math.min(eventFrequency / 10, 1) // Normalize to 0-1

  return {
    stability: Math.max(0, Math.min(1, stability)),
    variability: Math.max(0, Math.min(1, variability)),
    deviation: Math.max(0, Math.min(1, deviation)),
    reactivity: Math.max(0, Math.min(1, reactivity)),
  }
}

