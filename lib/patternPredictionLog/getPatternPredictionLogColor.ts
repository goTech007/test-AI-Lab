import type { LogEntry } from '@/types/patternPrediction'

export const getPatternPredictionLogColor = (type: LogEntry['type']): string => {
  switch (type) {
    case 'sequence':
      return 'text-lab-accent'
    case 'prediction':
      return 'text-lab-warning'
    case 'correct':
      return 'text-lab-accent'
    case 'incorrect':
      return 'text-lab-red'
    case 'status':
      return 'text-lab-text/50'
    case 'calibration':
      return 'text-lab-blue'
    case 'threshold':
      return 'text-lab-cyan'
    case 'error':
      return 'text-lab-red'
    case 'performance':
      return 'text-lab-green'
    case 'metric':
      return 'text-lab-purple'
    case 'confidence':
      return 'text-lab-yellow'
    default:
      return 'text-lab-text'
  }
}

