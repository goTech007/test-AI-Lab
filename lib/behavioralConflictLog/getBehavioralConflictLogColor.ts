import type { LogEntry } from '@/types/behavioralConflict'

export const getBehavioralConflictLogColor = (type: LogEntry['type']): string => {
  switch (type) {
    case 'domination':
      return 'text-lab-accent'
    case 'adaptation':
      return 'text-lab-warning'
    case 'conflict':
      return 'text-lab-red'
    case 'balance':
      return 'text-lab-text/70'
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
    case 'strategy':
      return 'text-lab-orange'
    default:
      return 'text-lab-text'
  }
}

