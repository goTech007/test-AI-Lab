'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/reactionTime'
import { generateReactionTimeLogMessage } from '@/lib/reactionTimeLog/generateReactionTimeLogMessage'
import { generateExperimentId } from '@/lib/textLog/generateExperimentId'
import { calculateBehavioralMetrics } from '@/lib/reactionTimeLog/calculateBehavioralMetrics'

export const useReactionTimeLog = (isFocused: boolean = false) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const experimentIdRef = useRef<string>(generateExperimentId())
  const metricsHistoryRef = useRef<{
    reactionTimes: number[]
    latencies: number[]
    timestamps: number[]
  }>({
    reactionTimes: [],
    latencies: [],
    timestamps: [],
  })

  useEffect(() => {
    if (scrollContainerRef.current && isFocused) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [logs, isFocused])

  useEffect(() => {
    const messages = [
      { type: 'status' as const, templates: ['Chamber initialized', 'Models synchronized', 'Reaction threshold set', 'Response protocol active'] },
      { type: 'calibration' as const, templates: ['Calibrating reaction sensitivity', 'Adjusting response thresholds', 'Recalibrating timing mechanisms', 'Fine-tuning latency detection'] },
      { type: 'threshold' as const, templates: ['Reaction threshold updated: 350ms', 'Latency boundary adjusted: ±50ms', 'Response window modified', 'Timing filter recalibrated'] },
      { type: 'error' as const, templates: ['Timing error detected', 'Response processing instability', 'Recovery protocol initiated', 'Error corrected: timing restored'] },
      { type: 'performance' as const, templates: ['Performance metrics updated', 'Average reaction time: 425ms', 'Response efficiency: 88%', 'System performance optimal'] },
      { type: 'metric' as const, templates: ['Behavioral metrics calculated', 'Stability analysis complete', 'Variability assessment finished', 'Reactivity index updated'] },
      { type: 'stimulus' as const, templates: ['Stimulus emitted', 'Signal wave generated', 'Trigger pulse transmitted', 'New stimulus detected', 'Signal burst generated'] },
      { type: 'reaction' as const, templates: ['Model B: reaction detected', 'Response registered', 'Reaction confirmed', 'Immediate response triggered', 'Response pattern matched'] },
      { type: 'latency' as const, templates: ['Latency measured', 'Reaction time recorded', 'Response time logged', 'Timing analysis complete'] },
    ]

    const addLog = () => {
      const shouldIncludeMetrics = Math.random() < 0.15 // 15% chance of including metrics
      const metrics = shouldIncludeMetrics 
        ? calculateBehavioralMetrics(metricsHistoryRef.current)
        : undefined

      const newLog = generateReactionTimeLogMessage(messages, {
        experimentId: experimentIdRef.current,
        metrics,
        includeMetrics: shouldIncludeMetrics,
      })
      newLog.id = logIdRef.current++

      // Update metrics history
      if (newLog.reactionTime) {
        if (newLog.type === 'reaction') {
          metricsHistoryRef.current.reactionTimes.push(newLog.reactionTime)
        } else if (newLog.type === 'latency') {
          metricsHistoryRef.current.latencies.push(newLog.reactionTime)
        }
        metricsHistoryRef.current.timestamps.push(Date.now())
      }

      // Keep history limited to last 100 events
      if (metricsHistoryRef.current.reactionTimes.length > 100) {
        metricsHistoryRef.current.reactionTimes = metricsHistoryRef.current.reactionTimes.slice(-100)
        metricsHistoryRef.current.latencies = metricsHistoryRef.current.latencies.slice(-100)
        metricsHistoryRef.current.timestamps = metricsHistoryRef.current.timestamps.slice(-100)
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

  return {
    logs,
    logEndRef,
    scrollContainerRef,
  }
}

