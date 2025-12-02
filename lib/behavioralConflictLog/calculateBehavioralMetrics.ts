interface MetricHistory {
  powerShifts: number[]
  conflicts: number[]
  balances: number[]
  timestamps: number[]
}

export interface BehavioralMetrics {
  stability: number
  variability: number
  deviation: number
  reactivity: number
  dominance: number
}

export const calculateBehavioralMetrics = (
  history: MetricHistory
): BehavioralMetrics => {
  const { powerShifts, conflicts, balances, timestamps } = history

  // Dominance: How often power shifts occur
  const totalEvents = powerShifts.length + conflicts.length + balances.length
  const dominance = totalEvents > 0 ? powerShifts.length / totalEvents : 0.5

  // Stability: Consistency of balance
  const balanceRate = totalEvents > 0 ? balances.length / totalEvents : 0.5
  const recentBalanceRate = balances.slice(-10).length / 10 || 0
  const stability = 1 - Math.abs(balanceRate - recentBalanceRate)

  // Variability: Fluctuation in power shifts
  const allValues = powerShifts.length > 0 ? powerShifts : [0.5]
  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length
  const variance = allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allValues.length
  const variability = Math.min(Math.sqrt(variance), 1)

  // Deviation: How far from balanced state
  const deviation = Math.abs(0.5 - balanceRate)

  // Reactivity: Event frequency
  const timeWindow = timestamps.length > 1 
    ? timestamps[timestamps.length - 1] - timestamps[0] 
    : 1000
  const eventFrequency = totalEvents / (timeWindow / 1000) || 0
  const reactivity = Math.min(eventFrequency / 4, 1)

  return {
    stability: Math.max(0, Math.min(1, stability)),
    variability: Math.max(0, Math.min(1, variability)),
    deviation: Math.max(0, Math.min(1, deviation)),
    reactivity: Math.max(0, Math.min(1, reactivity)),
    dominance: Math.max(0, Math.min(1, dominance)),
  }
}

