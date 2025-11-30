'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/reactionTime'

export default function ReactionTimeLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  useEffect(() => {
    const messages = [
      { type: 'status' as const, templates: ['Chamber initialized', 'Models synchronized', 'Reaction threshold set'] },
      { type: 'stimulus' as const, templates: ['Stimulus emitted', 'Signal wave generated', 'Trigger pulse transmitted'] },
      { type: 'reaction' as const, templates: ['Model B: reaction detected', 'Response registered', 'Reaction confirmed'] },
      { type: 'latency' as const, templates: ['Latency measured', 'Reaction time recorded'] },
    ]

    const addLog = () => {
      const now = new Date()
      const timestamp = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      const rand = Math.random()
      let messageType: typeof messages[number]
      
      if (rand < 0.1) {
        messageType = messages[0] // status
      } else if (rand < 0.4) {
        messageType = messages[1] // stimulus
      } else if (rand < 0.7) {
        messageType = messages[2] // reaction
      } else {
        messageType = messages[3] // latency
      }

      const template = messageType.templates[
        Math.floor(Math.random() * messageType.templates.length)
      ]

      const reactionTime = messageType.type === 'latency' || messageType.type === 'reaction'
        ? Math.round(200 + Math.random() * 800)
        : undefined

      const newLog: LogEntry = {
        id: logIdRef.current++,
        timestamp,
        message: reactionTime ? `${template}: ${reactionTime}ms` : template,
        type: messageType.type,
        reactionTime,
      }

      setLogs(prev => {
        const updated = [...prev, newLog]
        return updated.slice(-50)
      })
    }

    addLog()

    const interval = setInterval(() => {
      addLog()
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'stimulus':
        return 'text-lab-accent'
      case 'reaction':
        return 'text-lab-warning'
      case 'latency':
        return 'text-lab-accent'
      case 'status':
        return 'text-lab-text/50'
      default:
        return 'text-lab-text'
    }
  }

  return (
    <div className="lab-border rounded-lg p-4 bg-lab-bg h-[400px] flex flex-col">
      <div className="mb-3 pb-2 border-b border-lab-border">
        <h3 className="text-sm font-mono text-lab-text/70">
          Observation Log
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 text-xs font-mono">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            <span className="text-lab-text/40">[{log.timestamp}]</span>{' '}
            <span className={getLogColor(log.type)}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  )
}

