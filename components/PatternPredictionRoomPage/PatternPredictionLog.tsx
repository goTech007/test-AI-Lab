'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/patternPrediction'

export default function PatternPredictionLog() {
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
      { type: 'status' as const, templates: ['Room initialized', 'Pattern recognition active', 'Prediction model loaded'] },
      { type: 'sequence' as const, templates: ['Sequence element generated', 'Pattern extended', 'New element added'] },
      { type: 'prediction' as const, templates: ['Model B: prediction made', 'Next element predicted', 'Pattern analysis complete'] },
      { type: 'correct' as const, templates: ['Prediction correct', 'Pattern matched', 'Successful prediction'] },
      { type: 'incorrect' as const, templates: ['Prediction incorrect', 'Pattern mismatch', 'Prediction failed'] },
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
      } else if (rand < 0.3) {
        messageType = messages[1] // sequence
      } else if (rand < 0.5) {
        messageType = messages[2] // prediction
      } else if (rand < 0.85) {
        messageType = messages[3] // correct
      } else {
        messageType = messages[4] // incorrect
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
      case 'sequence':
        return 'text-lab-accent'
      case 'prediction':
        return 'text-lab-warning'
      case 'correct':
        return 'text-lab-accent'
      case 'incorrect':
        return 'text-red-500'
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

