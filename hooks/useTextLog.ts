'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/attentionResponse'
import { generateLogMessage } from '@/lib/textLog/generateLogMessage'
import { generateExperimentId } from '@/lib/textLog/generateExperimentId'
import { calculateBehavioralMetrics } from '@/lib/textLog/calculateBehavioralMetrics'

export const useTextLog = (isFocused: boolean = false) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const experimentIdRef = useRef<string>(generateExperimentId())
  const metricsHistoryRef = useRef<{
    detections: number[]
    misses: number[]
    timestamps: number[]
  }>({
    detections: [],
    misses: [],
    timestamps: [],
  })

  useEffect(() => {
    if (scrollContainerRef.current && isFocused) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [logs, isFocused])

  useEffect(() => {
    const messages = [
      { type: 'status' as const, templates: ['System initialized', 'Models synchronized', 'Detection threshold calibrated', 'Observation protocol active'] },
      { type: 'calibration' as const, templates: ['Calibrating detection sensitivity', 'Adjusting signal thresholds', 'Recalibrating model parameters', 'Fine-tuning attention mechanisms'] },
      { type: 'threshold' as const, templates: ['Threshold updated: 0.72', 'Sensitivity adjusted: ±0.15', 'Detection boundary modified', 'Signal filter recalibrated'] },
      { type: 'error' as const, templates: ['Signal processing error detected', 'Temporary system instability', 'Recovery protocol initiated', 'Error corrected: signal restored'] },
      { type: 'performance' as const, templates: ['Performance metrics updated', 'Detection rate: 78.5%', 'Processing efficiency: 92%', 'System performance optimal'] },
      { type: 'metric' as const, templates: ['Behavioral metrics calculated', 'Stability analysis complete', 'Variability assessment finished', 'Reactivity index updated'] },
      { type: 'stimulus' as const, templates: ['Stimulus emitted', 'Pattern generated', 'Signal wave transmitted', 'Stimulus sequence initiated', 'New stimulus pattern detected', 'Signal burst generated'] },
      { type: 'detection' as const, templates: ['Model B: response detected', 'Pattern recognized', 'Signal matched', 'Detection confirmed', 'Attention focus confirmed', 'Pattern successfully identified'] },
      { type: 'miss' as const, templates: ['Stimulus not detected', 'Pattern missed', 'Signal below threshold', 'Detection failed', 'Attention lapse detected', 'Signal processing timeout'] },
    ]

    const addLog = () => {
      const shouldIncludeMetrics = Math.random() < 0.15 // 15% chance of including metrics
      const metrics = shouldIncludeMetrics 
        ? calculateBehavioralMetrics(metricsHistoryRef.current)
        : undefined

      const newLog = generateLogMessage(messages, {
        experimentId: experimentIdRef.current,
        metrics,
        includeMetrics: shouldIncludeMetrics,
      })
      newLog.id = logIdRef.current++

      // Update metrics history
      if (newLog.type === 'detection') {
        metricsHistoryRef.current.detections.push(1)
        metricsHistoryRef.current.misses.push(0)
      } else if (newLog.type === 'miss') {
        metricsHistoryRef.current.detections.push(0)
        metricsHistoryRef.current.misses.push(1)
      }
      metricsHistoryRef.current.timestamps.push(Date.now())

      // Keep history limited to last 100 events
      if (metricsHistoryRef.current.detections.length > 100) {
        metricsHistoryRef.current.detections = metricsHistoryRef.current.detections.slice(-100)
        metricsHistoryRef.current.misses = metricsHistoryRef.current.misses.slice(-100)
        metricsHistoryRef.current.timestamps = metricsHistoryRef.current.timestamps.slice(-100)
      }

      setLogs(prev => {
        const updated = [...prev, newLog]
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

  // Calculate current metrics
  const currentMetrics = calculateBehavioralMetrics(metricsHistoryRef.current)

  return {
    logs,
    logEndRef,
    scrollContainerRef,
    metrics: currentMetrics,
  }
}

