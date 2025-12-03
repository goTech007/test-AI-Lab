'use client'

import { useState, useEffect, useRef } from 'react'
import { useAttentionResponse } from '@/hooks/useAttentionResponse'
import { detectAnomaly } from '@/lib/anomaly/detectAnomaly'
import type { Anomaly } from '@/types/anomaly'

export const useAttentionAnomaly = () => {
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null)
  const { detectionRate, stimuli } = useAttentionResponse()
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    // Track detection rate history
    historyRef.current.push(detectionRate)
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }
  }, [detectionRate])

  useEffect(() => {
    const interval = setInterval(() => {
      // Check for anomalies every 3-5 seconds
      if (historyRef.current.length < 3) return

      const currentValue = detectionRate / 100 // Normalize to 0-1
      const expectedRange: [number, number] = [0.5, 0.9] // Expected 50-90% detection rate

      const anomaly = detectAnomaly('attention', {
        value: currentValue,
        expectedRange,
        history: historyRef.current.map(v => v / 100),
        timestamp: Date.now(),
      })

      if (anomaly) {
        setActiveAnomaly(anomaly)
        
        // Clear anomaly after duration
        setTimeout(() => {
          setActiveAnomaly(null)
        }, anomaly.duration)
      }
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [detectionRate])

  // Clear expired anomalies
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

