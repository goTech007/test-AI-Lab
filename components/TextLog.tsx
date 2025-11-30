'use client'

import { useState, useEffect, useRef } from 'react'

interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: 'stimulus' | 'detection' | 'miss' | 'status'
}

export default function TextLog() {
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
      { type: 'status' as const, templates: ['System initialized', 'Models synchronized', 'Detection threshold calibrated'] },
      { type: 'stimulus' as const, templates: ['Stimulus emitted', 'Pattern generated', 'Signal wave transmitted', 'Stimulus sequence initiated'] },
      { type: 'detection' as const, templates: ['Model B: response detected', 'Pattern recognized', 'Signal matched', 'Detection confirmed'] },
      { type: 'miss' as const, templates: ['Stimulus not detected', 'Pattern missed', 'Signal below threshold', 'Detection failed'] },
    ]

    const addLog = () => {
      const now = new Date()
      const timestamp = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      // Weighted random selection (more detections than misses)
      const rand = Math.random()
      let messageType: typeof messages[number]
      
      if (rand < 0.1) {
        messageType = messages[0] // status
      } else if (rand < 0.4) {
        messageType = messages[1] // stimulus
      } else if (rand < 0.85) {
        messageType = messages[2] // detection
      } else {
        messageType = messages[3] // miss
      }

      const template = messageType.templates[
        Math.floor(Math.random() * messageType.templates.length)
      ]

      const newLog: LogEntry = {
        id: logIdRef.current++,
        timestamp,
        message: template,
        type: messageType.type,
      }

      setLogs(prev => {
        const updated = [...prev, newLog]
        // Keep only last 50 logs
        return updated.slice(-50)
      })
    }

    // Initial log
    addLog()

    // Add logs every 2-5 seconds
    const interval = setInterval(() => {
      addLog()
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'stimulus':
        return 'text-lab-accent'
      case 'detection':
        return 'text-lab-accent'
      case 'miss':
        return 'text-lab-warning'
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

