interface MetricHistory {
  reactionTimes: number[]
  latencies: number[]
  timestamps: number[]
}

export interface BehavioralMetrics {
  stability: number
  variability: number
  deviation: number
  reactivity: number
}

export const calculateBehavioralMetrics = (
  history: MetricHistory
): BehavioralMetrics => {
  const { reactionTimes, latencies, timestamps } = history

  // Stability: Consistency of reaction times
  const allTimes = [...reactionTimes, ...latencies].filter(t => t > 0)
  if (allTimes.length === 0) {
    return { stability: 0.5, variability: 0.5, deviation: 0.5, reactivity: 0.5 }
  }

  const mean = allTimes.reduce((a, b) => a + b, 0) / allTimes.length
  const variance = allTimes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allTimes.length
  const stdDev = Math.sqrt(variance)
  
  // Stability: Lower variance = higher stability
  const stability = 1 - Math.min(stdDev / (mean || 1), 1)

  // Variability: Coefficient of variation
  const variability = Math.min(stdDev / (mean || 1), 1)

  // Deviation: How far from optimal reaction time (300ms)
  const optimalTime = 300
  const deviation = Math.min(Math.abs(mean - optimalTime) / optimalTime, 1)

  // Reactivity: Event frequency
  const timeWindow = timestamps.length > 1 
    ? timestamps[timestamps.length - 1] - timestamps[0] 
    : 1000
  const eventFrequency = allTimes.length / (timeWindow / 1000) || 0
  const reactivity = Math.min(eventFrequency / 5, 1)

  return {
    stability: Math.max(0, Math.min(1, stability)),
    variability: Math.max(0, Math.min(1, variability)),
    deviation: Math.max(0, Math.min(1, deviation)),
    reactivity: Math.max(0, Math.min(1, reactivity)),
  }
}

