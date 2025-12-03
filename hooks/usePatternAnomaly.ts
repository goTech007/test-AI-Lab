'use client'

import { useState, useEffect, useRef } from 'react'
import { usePatternPrediction } from '@/hooks/usePatternPrediction'
import { detectAnomaly } from '@/lib/anomaly/detectAnomaly'
import type { Anomaly } from '@/types/anomaly'

export const usePatternAnomaly = () => {
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null)
  const { accuracy, sequence } = usePatternPrediction()
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    // Track accuracy history
    historyRef.current.push(accuracy)
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }
  }, [accuracy])

  useEffect(() => {
    const interval = setInterval(() => {
      if (historyRef.current.length < 3) return

      const currentValue = accuracy / 100 // Normalize to 0-1
      const expectedRange: [number, number] = [0.6, 0.9] // Expected 60-90% accuracy

      const anomaly = detectAnomaly('pattern', {
        value: currentValue,
        expectedRange,
        history: historyRef.current.map(v => v / 100),
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
  }, [accuracy])

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

