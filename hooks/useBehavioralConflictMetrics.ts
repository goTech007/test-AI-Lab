'use client'

import { useState, useEffect } from 'react'
import { useBehavioralConflictLog } from '@/hooks/useBehavioralConflictLog'
import type { BehavioralMetrics } from '@/lib/behavioralConflictLog/calculateBehavioralMetrics'

export const useBehavioralConflictMetrics = () => {
  const { metrics: logMetrics } = useBehavioralConflictLog(false)
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

