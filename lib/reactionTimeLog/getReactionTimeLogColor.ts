import type { LogEntry } from '@/types/reactionTime'

export const getReactionTimeLogColor = (type: LogEntry['type']): string => {
  switch (type) {
    case 'stimulus':
      return 'text-lab-accent'
    case 'reaction':
      return 'text-lab-warning'
    case 'latency':
      return 'text-lab-accent'
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
    default:
      return 'text-lab-text'
  }
}

