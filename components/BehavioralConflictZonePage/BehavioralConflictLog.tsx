'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/behavioralConflict'

export default function BehavioralConflictLog() {
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
      { type: 'status' as const, templates: ['Zone initialized', 'Conflict protocol active', 'Models engaged'] },
      { type: 'domination' as const, templates: ['Model A: dominance attempt', 'Model B: dominance attempt', 'Power shift detected'] },
      { type: 'adaptation' as const, templates: ['Model A: adapting behavior', 'Model B: adapting behavior', 'Behavioral adjustment'] },
      { type: 'conflict' as const, templates: ['Conflict escalation', 'Tug-of-war detected', 'Struggle intensifies'] },
      { type: 'balance' as const, templates: ['Equilibrium reached', 'Balance restored', 'Conflict stabilized'] },
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
        messageType = messages[1] // domination
      } else if (rand < 0.6) {
        messageType = messages[2] // adaptation
      } else if (rand < 0.8) {
        messageType = messages[3] // conflict
      } else {
        messageType = messages[4] // balance
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
      case 'domination':
        return 'text-lab-accent'
      case 'adaptation':
        return 'text-lab-warning'
      case 'conflict':
        return 'text-red-500'
      case 'balance':
        return 'text-lab-text/70'
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

