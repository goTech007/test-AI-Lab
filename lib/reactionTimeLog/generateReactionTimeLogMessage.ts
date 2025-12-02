import type { LogEntry } from '@/types/reactionTime'

interface MessageTemplate {
  type: LogEntry['type']
  templates: string[]
}

interface GenerateReactionTimeLogMessageOptions {
  experimentId?: string
  metrics?: LogEntry['metrics']
  includeMetrics?: boolean
}

export const generateReactionTimeLogMessage = (
  messages: MessageTemplate[],
  options: GenerateReactionTimeLogMessageOptions = {}
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
  } else if (rand < 0.40) {
    messageType = messages.find(m => m.type === 'stimulus') || messages[1]
  } else if (rand < 0.70) {
    messageType = messages.find(m => m.type === 'reaction') || messages[2]
  } else {
    messageType = messages.find(m => m.type === 'latency') || messages[3]
  }

  const template = messageType.templates[
    Math.floor(Math.random() * messageType.templates.length)
  ]

  const reactionTime = messageType.type === 'latency' || messageType.type === 'reaction'
    ? Math.round(200 + Math.random() * 800)
    : undefined

  // Add metrics to message if available
  let message = reactionTime ? `${template}: ${reactionTime}ms` : template
  if (includeMetrics && metrics) {
    const metricParts: string[] = []
    if (metrics.stability !== undefined) {
      metricParts.push(`stability: ${(metrics.stability * 100).toFixed(1)}%`)
    }
    if (metrics.reactivity !== undefined) {
      metricParts.push(`reactivity: ${(metrics.reactivity * 100).toFixed(1)}%`)
    }
    if (metricParts.length > 0) {
      message = `${message} [${metricParts.join(', ')}]`
    }
  }

  return {
    id: 0, // Will be set by hook
    timestamp,
    message,
    type: messageType.type,
    reactionTime,
    experimentId,
    metrics: includeMetrics ? metrics : undefined,
  }
}

