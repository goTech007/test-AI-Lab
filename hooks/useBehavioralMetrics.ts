'use client'

import { useState, useEffect } from 'react'
import { useTextLog } from '@/hooks/useTextLog'
import type { BehavioralMetrics } from '@/lib/textLog/calculateBehavioralMetrics'

export const useBehavioralMetrics = () => {
  const { metrics: logMetrics } = useTextLog(false)
  const [metrics, setMetrics] = useState<BehavioralMetrics>(logMetrics)

  useEffect(() => {
    // Update metrics when log metrics change
    setMetrics(logMetrics)
  }, [logMetrics])

  // Also update periodically to ensure smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(logMetrics)
    }, 1000)

    return () => clearInterval(interval)
  }, [logMetrics])

  return { metrics }
}

