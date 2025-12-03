'use client'

import { useState, useEffect, useRef } from 'react'
import { useBehavioralConflict } from '@/hooks/useBehavioralConflict'
import { detectAnomaly } from '@/lib/anomaly/detectAnomaly'
import type { Anomaly } from '@/types/anomaly'

export const useConflictAnomaly = () => {
  const [activeAnomaly, setActiveAnomaly] = useState<Anomaly | null>(null)
  const { modelAPower, modelBPower, currentDominance } = useBehavioralConflict()
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    // Track power imbalance history
    const imbalance = Math.abs(modelAPower - modelBPower) / 100
    historyRef.current.push(imbalance)
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10)
    }
  }, [modelAPower, modelBPower])

  useEffect(() => {
    const interval = setInterval(() => {
      if (historyRef.current.length < 3) return

      const currentValue = Math.abs(modelAPower - modelBPower) / 100
      const expectedRange: [number, number] = [0.1, 0.4] // Expected 10-40% imbalance

      const anomaly = detectAnomaly('conflict', {
        value: currentValue,
        expectedRange,
        history: historyRef.current,
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
  }, [modelAPower, modelBPower])

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

