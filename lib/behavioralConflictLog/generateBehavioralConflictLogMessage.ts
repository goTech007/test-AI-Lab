import type { LogEntry } from '@/types/behavioralConflict'

interface MessageTemplate {
  type: LogEntry['type']
  templates: string[]
}

interface GenerateBehavioralConflictLogMessageOptions {
  experimentId?: string
  metrics?: LogEntry['metrics']
  includeMetrics?: boolean
}

export const generateBehavioralConflictLogMessage = (
  messages: MessageTemplate[],
  options: GenerateBehavioralConflictLogMessageOptions = {}
): LogEntry => {
  const { experimentId, metrics, includeMetrics = false } = options
  const now = new Date()
  const timestamp = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const rand = Math.random()
  let messageType: MessageTemplate
  
  if (rand < 0.05) {
    messageType = messages.find(m => m.type === 'status') || messages[0]
  } else if (rand < 0.08 && messages.some(m => m.type === 'calibration')) {
    messageType = messages.find(m => m.type === 'calibration') || messages[1]
  } else if (rand < 0.10 && messages.some(m => m.type === 'threshold')) {
    messageType = messages.find(m => m.type === 'threshold') || messages[1]
  } else if (rand < 0.12 && messages.some(m => m.type === 'error')) {
    messageType = messages.find(m => m.type === 'error') || messages[1]
  } else if (rand < 0.15 && messages.some(m => m.type === 'performance')) {
    messageType = messages.find(m => m.type === 'performance') || messages[1]
  } else if (rand < 0.18 && includeMetrics && messages.some(m => m.type === 'metric')) {
    messageType = messages.find(m => m.type === 'metric') || messages[1]
  } else if (rand < 0.20 && messages.some(m => m.type === 'strategy')) {
    messageType = messages.find(m => m.type === 'strategy') || messages[1]
  } else if (rand < 0.40) {
    messageType = messages.find(m => m.type === 'domination') || messages[1]
  } else if (rand < 0.60) {
    messageType = messages.find(m => m.type === 'adaptation') || messages[2]
  } else if (rand < 0.80) {
    messageType = messages.find(m => m.type === 'conflict') || messages[3]
  } else {
    messageType = messages.find(m => m.type === 'balance') || messages[4]
  }

  const template = messageType.templates[
    Math.floor(Math.random() * messageType.templates.length)
  ]

  // Add metrics to message if available
  let message = template
  if (includeMetrics && metrics) {
    const metricParts: string[] = []
    if (metrics.dominance !== undefined) {
      metricParts.push(`dominance: ${(metrics.dominance * 100).toFixed(1)}%`)
    }
    if (metrics.stability !== undefined) {
      metricParts.push(`stability: ${(metrics.stability * 100).toFixed(1)}%`)
    }
    if (metricParts.length > 0) {
      message = `${template} [${metricParts.join(', ')}]`
    }
  }

  return {
    id: 0, // Will be set by hook
    timestamp,
    message,
    type: messageType.type,
    experimentId,
    metrics: includeMetrics ? metrics : undefined,
  }
}

