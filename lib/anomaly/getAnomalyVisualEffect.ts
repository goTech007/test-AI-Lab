import type { Anomaly } from '@/types/anomaly'

export const getAnomalyVisualEffect = (anomaly: Anomaly | null): {
  borderColor: string
  glowColor: string
  flashColor: string
  intensity: number
} => {
  if (!anomaly) {
    return {
      borderColor: 'rgba(42, 42, 42, 1)',
      glowColor: 'transparent',
      flashColor: 'transparent',
      intensity: 0,
    }
  }

  const { severity, type } = anomaly

  // Color based on severity
  let baseColor = 'rgba(255, 170, 0, 1)' // warning (low)
  if (severity === 'critical') {
    baseColor = 'rgba(248, 113, 113, 1)' // red
  } else if (severity === 'high') {
    baseColor = 'rgba(251, 146, 60, 1)' // orange
  } else if (severity === 'medium') {
    baseColor = 'rgba(250, 204, 21, 1)' // yellow
  }

  // Intensity based on severity
  const intensity = severity === 'critical' ? 1 : 
                    severity === 'high' ? 0.8 :
                    severity === 'medium' ? 0.6 : 0.4

  // Flash color (brighter for critical)
  const flashColor = severity === 'critical' 
    ? 'rgba(255, 0, 0, 0.8)'
    : severity === 'high'
    ? 'rgba(255, 100, 0, 0.6)'
    : 'rgba(255, 200, 0, 0.4)'

  return {
    borderColor: baseColor,
    glowColor: baseColor.replace('1)', `${intensity * 0.6})`),
    flashColor,
    intensity,
  }
}

