'use client'

import { useState, useEffect } from 'react'
import { usePatternPredictionLog } from '@/hooks/usePatternPredictionLog'
import type { BehavioralMetrics } from '@/lib/patternPredictionLog/calculateBehavioralMetrics'

export const usePatternPredictionMetrics = () => {
  const { metrics: logMetrics } = usePatternPredictionLog(false)
  const [metrics, setMetrics] = useState<BehavioralMetrics>(logMetrics)

  useEffect(() => {
    setMetrics(logMetrics)
  }, [logMetrics])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(logMetrics)
    }, 1000)

    return () => clearInterval(interval)
  }, [logMetrics])

  return { metrics }
}

