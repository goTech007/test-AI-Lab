interface MetricHistory {
  correct: number[]
  incorrect: number[]
  predictions: number[]
  timestamps: number[]
}

export interface BehavioralMetrics {
  stability: number
  variability: number
  deviation: number
  reactivity: number
  accuracy: number
}

export const calculateBehavioralMetrics = (
  history: MetricHistory
): BehavioralMetrics => {
  const { correct, incorrect, predictions, timestamps } = history

  // Accuracy: Overall prediction accuracy
  const total = correct.length + incorrect.length
  const accuracy = total > 0 ? correct.length / total : 0.5

  // Stability: Consistency of accuracy over time
  const recentTotal = correct.slice(-10).length + incorrect.slice(-10).length
  const recentAccuracy = recentTotal > 0 
    ? correct.slice(-10).length / recentTotal 
    : accuracy
  const stability = 1 - Math.abs(accuracy - recentAccuracy)

  // Variability: How much predictions vary
  const predictionValues = predictions.length > 0 ? predictions : [accuracy]
  const mean = predictionValues.reduce((a, b) => a + b, 0) / predictionValues.length
  const variance = predictionValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / predictionValues.length
  const variability = Math.min(Math.sqrt(variance), 1)

  // Deviation: How far from perfect accuracy
  const deviation = Math.abs(1 - accuracy)

  // Reactivity: Event frequency
  const timeWindow = timestamps.length > 1 
    ? timestamps[timestamps.length - 1] - timestamps[0] 
    : 1000
  const eventFrequency = total / (timeWindow / 1000) || 0
  const reactivity = Math.min(eventFrequency / 3, 1)

  return {
    stability: Math.max(0, Math.min(1, stability)),
    variability: Math.max(0, Math.min(1, variability)),
    deviation: Math.max(0, Math.min(1, deviation)),
    reactivity: Math.max(0, Math.min(1, reactivity)),
    accuracy: Math.max(0, Math.min(1, accuracy)),
  }
}

