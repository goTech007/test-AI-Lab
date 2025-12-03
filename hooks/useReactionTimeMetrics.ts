'use client'

import { useState, useEffect } from 'react'
import { useReactionTimeLog } from '@/hooks/useReactionTimeLog'
import type { BehavioralMetrics } from '@/lib/reactionTimeLog/calculateBehavioralMetrics'

export const useReactionTimeMetrics = () => {
  const { metrics: logMetrics } = useReactionTimeLog(false)
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

