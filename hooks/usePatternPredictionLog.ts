'use client'

import { useState, useEffect, useRef } from 'react'
import type { LogEntry } from '@/types/patternPrediction'
import { generatePatternPredictionLogMessage } from '@/lib/patternPredictionLog/generatePatternPredictionLogMessage'
import { generateExperimentId } from '@/lib/textLog/generateExperimentId'
import { calculateBehavioralMetrics } from '@/lib/patternPredictionLog/calculateBehavioralMetrics'

export const usePatternPredictionLog = (isFocused: boolean = false) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const experimentIdRef = useRef<string>(generateExperimentId())
  const metricsHistoryRef = useRef<{
    correct: number[]
    incorrect: number[]
    predictions: number[]
    timestamps: number[]
  }>({
    correct: [],
    incorrect: [],
    predictions: [],
    timestamps: [],
  })

  useEffect(() => {
    if (scrollContainerRef.current && isFocused) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [logs, isFocused])

  useEffect(() => {
    const messages = [
      { type: 'status' as const, templates: ['Room initialized', 'Pattern recognition active', 'Prediction model loaded', 'Sequence analysis protocol active'] },
      { type: 'calibration' as const, templates: ['Calibrating pattern recognition', 'Adjusting prediction thresholds', 'Recalibrating sequence analysis', 'Fine-tuning prediction confidence'] },
      { type: 'threshold' as const, templates: ['Prediction threshold updated: 0.65', 'Confidence boundary adjusted: ±0.10', 'Pattern matching window modified', 'Sequence filter recalibrated'] },
      { type: 'error' as const, templates: ['Pattern analysis error detected', 'Prediction processing instability', 'Recovery protocol initiated', 'Error corrected: pattern restored'] },
      { type: 'performance' as const, templates: ['Performance metrics updated', 'Prediction accuracy: 72.3%', 'Pattern recognition efficiency: 85%', 'System performance optimal'] },
      { type: 'metric' as const, templates: ['Behavioral metrics calculated', 'Stability analysis complete', 'Variability assessment finished', 'Reactivity index updated'] },
      { type: 'confidence' as const, templates: ['Confidence level: 78%', 'Prediction confidence: high', 'Low confidence prediction', 'Confidence threshold met'] },
      { type: 'sequence' as const, templates: ['Sequence element generated', 'Pattern extended', 'New element added', 'Sequence progression detected', 'Pattern sequence updated'] },
      { type: 'prediction' as const, templates: ['Model B: prediction made', 'Next element predicted', 'Pattern analysis complete', 'Prediction generated', 'Pattern hypothesis formed'] },
      { type: 'correct' as const, templates: ['Prediction correct', 'Pattern matched', 'Successful prediction', 'Accurate prediction confirmed', 'Pattern recognition successful'] },
      { type: 'incorrect' as const, templates: ['Prediction incorrect', 'Pattern mismatch', 'Prediction failed', 'Pattern recognition failed', 'Incorrect prediction logged'] },
    ]

    const addLog = () => {
      const shouldIncludeMetrics = Math.random() < 0.15 // 15% chance of including metrics
      const metrics = shouldIncludeMetrics 
        ? calculateBehavioralMetrics(metricsHistoryRef.current)
        : undefined

      const newLog = generatePatternPredictionLogMessage(messages, {
        experimentId: experimentIdRef.current,
        metrics,
        includeMetrics: shouldIncludeMetrics,
      })
      newLog.id = logIdRef.current++

      // Update metrics history
      if (newLog.type === 'correct') {
        metricsHistoryRef.current.correct.push(1)
        metricsHistoryRef.current.incorrect.push(0)
        metricsHistoryRef.current.predictions.push(1)
      } else if (newLog.type === 'incorrect') {
        metricsHistoryRef.current.correct.push(0)
        metricsHistoryRef.current.incorrect.push(1)
        metricsHistoryRef.current.predictions.push(0)
      } else if (newLog.type === 'prediction') {
        metricsHistoryRef.current.predictions.push(0.5)
      }
      metricsHistoryRef.current.timestamps.push(Date.now())

      // Keep history limited to last 100 events
      if (metricsHistoryRef.current.correct.length > 100) {
        metricsHistoryRef.current.correct = metricsHistoryRef.current.correct.slice(-100)
        metricsHistoryRef.current.incorrect = metricsHistoryRef.current.incorrect.slice(-100)
        metricsHistoryRef.current.predictions = metricsHistoryRef.current.predictions.slice(-100)
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

  // Calculate current metrics
  const currentMetrics = calculateBehavioralMetrics(metricsHistoryRef.current)

  return {
    logs,
    logEndRef,
    scrollContainerRef,
    metrics: currentMetrics,
  }
}

