'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/behavioralConflict'
import { generateBehavioralConflictLogMessage } from '@/lib/behavioralConflictLog/generateBehavioralConflictLogMessage'
import { generateExperimentId } from '@/lib/textLog/generateExperimentId'
import { calculateBehavioralMetrics } from '@/lib/behavioralConflictLog/calculateBehavioralMetrics'

export const useBehavioralConflictLog = (isFocused: boolean = false) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const experimentIdRef = useRef<string>(generateExperimentId())
  const metricsHistoryRef = useRef<{
    powerShifts: number[]
    conflicts: number[]
    balances: number[]
    timestamps: number[]
  }>({
    powerShifts: [],
    conflicts: [],
    balances: [],
    timestamps: [],
  })

  useEffect(() => {
    if (scrollContainerRef.current && isFocused) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [logs, isFocused])

  useEffect(() => {
    const messages = [
      { type: 'status' as const, templates: ['Zone initialized', 'Conflict protocol active', 'Models engaged', 'Behavioral conflict analysis active'] },
      { type: 'calibration' as const, templates: ['Calibrating conflict detection', 'Adjusting dominance thresholds', 'Recalibrating power balance', 'Fine-tuning adaptation mechanisms'] },
      { type: 'threshold' as const, templates: ['Dominance threshold updated: 0.60', 'Power balance boundary adjusted: ±0.15', 'Conflict detection window modified', 'Adaptation filter recalibrated'] },
      { type: 'error' as const, templates: ['Conflict analysis error detected', 'Power balance instability', 'Recovery protocol initiated', 'Error corrected: balance restored'] },
      { type: 'performance' as const, templates: ['Performance metrics updated', 'Conflict resolution rate: 65%', 'Adaptation efficiency: 78%', 'System performance optimal'] },
      { type: 'metric' as const, templates: ['Behavioral metrics calculated', 'Stability analysis complete', 'Variability assessment finished', 'Reactivity index updated'] },
      { type: 'strategy' as const, templates: ['Strategy shift detected', 'Adaptive strategy activated', 'Dominance strategy modified', 'New behavioral strategy implemented'] },
      { type: 'domination' as const, templates: ['Model A: dominance attempt', 'Model B: dominance attempt', 'Power shift detected', 'Dominance pattern identified', 'Power struggle initiated'] },
      { type: 'adaptation' as const, templates: ['Model A: adapting behavior', 'Model B: adapting behavior', 'Behavioral adjustment', 'Adaptive response triggered', 'Behavior modification detected'] },
      { type: 'conflict' as const, templates: ['Conflict escalation', 'Tug-of-war detected', 'Struggle intensifies', 'Conflict peak reached', 'Tension level increased'] },
      { type: 'balance' as const, templates: ['Equilibrium reached', 'Balance restored', 'Conflict stabilized', 'Harmony achieved', 'Stable state maintained'] },
    ]

    const addLog = () => {
      const shouldIncludeMetrics = Math.random() < 0.15 // 15% chance of including metrics
      const metrics = shouldIncludeMetrics 
        ? calculateBehavioralMetrics(metricsHistoryRef.current)
        : undefined

      const newLog = generateBehavioralConflictLogMessage(messages, {
        experimentId: experimentIdRef.current,
        metrics,
        includeMetrics: shouldIncludeMetrics,
      })
      newLog.id = logIdRef.current++

      // Update metrics history
      if (newLog.type === 'domination') {
        metricsHistoryRef.current.powerShifts.push(0.7)
      } else if (newLog.type === 'conflict') {
        metricsHistoryRef.current.conflicts.push(0.5)
      } else if (newLog.type === 'balance') {
        metricsHistoryRef.current.balances.push(0.3)
      }
      metricsHistoryRef.current.timestamps.push(Date.now())

      // Keep history limited to last 100 events
      if (metricsHistoryRef.current.powerShifts.length > 100) {
        metricsHistoryRef.current.powerShifts = metricsHistoryRef.current.powerShifts.slice(-100)
        metricsHistoryRef.current.conflicts = metricsHistoryRef.current.conflicts.slice(-100)
        metricsHistoryRef.current.balances = metricsHistoryRef.current.balances.slice(-100)
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

