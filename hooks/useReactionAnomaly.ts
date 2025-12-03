'use client'

import { useState, useEffect, useRef } from 'react'
import { useReactionTime } from '@/hooks/useReactionTime'
import { detectAnomaly } from '@/lib/anomaly/detectAnomaly'
import type { Anomaly } from '@/types/anomaly'

export const useReactionAnomaly = () => {
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null)
  const { averageReactionTime, stimuli } = useReactionTime()
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    // Track reaction time history
    if (averageReactionTime > 0) {
      historyRef.current.push(averageReactionTime)
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10)
      }
    }
  }, [averageReactionTime])

  useEffect(() => {
    const interval = setInterval(() => {
      if (historyRef.current.length < 3) return

      // Normalize reaction time (200-1000ms range)
      const currentValue = Math.min(averageReactionTime / 1000, 1)
      const expectedRange: [number, number] = [0.2, 0.8] // Expected 200-800ms

      const anomaly = detectAnomaly('reaction', {
        value: currentValue,
        expectedRange,
        history: historyRef.current.map(v => Math.min(v / 1000, 1)),
        timestamp: Date.now(),
      })

      if (anomaly) {
        setActiveAnomaly(anomaly)
        
        setTimeout(() => {
          setActiveAnomaly(null)
        }, anomaly.duration)
      }
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [averageReactionTime])

  useEffect(() => {
    if (activeAnomaly) {
      const now = Date.now()
      if (now - activeAnomaly.timestamp > activeAnomaly.duration) {
        setActiveAnomaly(null)
      }
    }
  }, [activeAnomaly])

  return { activeAnomaly }
}

