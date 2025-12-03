'use client'

import { useState, useEffect, useRef } from 'react'
import type { RoomId, InfluenceState, RoomActivity } from '@/types/crossRoomInfluence'
import { calculateActivityLevel } from '@/lib/crossRoomInfluence/calculateActivityLevel'
import { determineInfluence } from '@/lib/crossRoomInfluence/determineInfluence'
import { useAttentionResponse } from '@/hooks/useAttentionResponse'
import { useReactionTime } from '@/hooks/useReactionTime'
import { usePatternPrediction } from '@/hooks/usePatternPrediction'
import { useBehavioralConflict } from '@/hooks/useBehavioralConflict'

// Singleton pattern to share activity tracking across all instances
const globalActivityHistory = new Map<string, { events: number[], timestamps: number[] }>([
  ['attention', { events: [], timestamps: [] }],
  ['reaction', { events: [], timestamps: [] }],
  ['pattern', { events: [], timestamps: [] }],
  ['conflict', { events: [], timestamps: [] }],
])

export const useCrossRoomInfluence = () => {
  const [activeInfluences, setActiveInfluences] = useState<InfluenceState[]>([])

  // Get activity data from each room
  const attentionData = useAttentionResponse()
  const reactionData = useReactionTime()
  const patternData = usePatternPrediction()
  const conflictData = useBehavioralConflict()

  // Track activity from each room
  useEffect(() => {
    // Track attention room activity (based on stimuli count)
    if (attentionData.stimuli.length > 0) {
      const history = globalActivityHistory.get('attention')!
      history.events.push(attentionData.stimuli.length)
      history.timestamps.push(Date.now())
      
      // Keep last 20 events
      if (history.events.length > 20) {
        history.events = history.events.slice(-20)
        history.timestamps = history.timestamps.slice(-20)
      }
    }
  }, [attentionData.stimuli.length])

  useEffect(() => {
    // Track reaction room activity (based on stimuli count)
    if (reactionData.stimuli.length > 0) {
      const history = globalActivityHistory.get('reaction')!
      history.events.push(reactionData.stimuli.length)
      history.timestamps.push(Date.now())
      
      if (history.events.length > 20) {
        history.events = history.events.slice(-20)
        history.timestamps = history.timestamps.slice(-20)
      }
    }
  }, [reactionData.stimuli.length])

  useEffect(() => {
    // Track pattern room activity (based on sequence length)
    if (patternData.sequence.length > 0) {
      const history = globalActivityHistory.get('pattern')!
      history.events.push(patternData.sequence.length)
      history.timestamps.push(Date.now())
      
      if (history.events.length > 20) {
        history.events = history.events.slice(-20)
        history.timestamps = history.timestamps.slice(-20)
      }
    }
  }, [patternData.sequence.length])

  useEffect(() => {
    // Track conflict room activity (based on power shifts)
    const totalPower = conflictData.modelAPower + conflictData.modelBPower
    if (totalPower > 0) {
      const history = globalActivityHistory.get('conflict')!
      history.events.push(Math.abs(conflictData.modelAPower - conflictData.modelBPower))
      history.timestamps.push(Date.now())
      
      if (history.events.length > 20) {
        history.events = history.events.slice(-20)
        history.timestamps = history.timestamps.slice(-20)
      }
    }
  }, [conflictData.modelAPower, conflictData.modelBPower])

  // Calculate activity levels and determine influences
  useEffect(() => {
    const interval = setInterval(() => {
      const roomActivities: RoomActivity[] = []
      
      // Calculate activity for each room
      ;(['attention', 'reaction', 'pattern', 'conflict'] as RoomId[]).forEach((roomId) => {
        const history = globalActivityHistory.get(roomId)!
        if (history.timestamps.length === 0) {
          roomActivities.push({
            roomId,
            activityLevel: 0,
            lastActivity: 0,
          })
          return
        }

        const timeWindow = history.timestamps.length > 1
          ? history.timestamps[history.timestamps.length - 1] - history.timestamps[0]
          : 1000

        const activityLevel = calculateActivityLevel({
          eventCount: history.events.length,
          timeWindow,
          intensity: history.events.length > 0
            ? history.events.reduce((a, b) => a + b, 0) / history.events.length / 10
            : 0,
        })

        roomActivities.push({
          roomId,
          activityLevel,
          lastActivity: history.timestamps[history.timestamps.length - 1] || 0,
        })
      })

      // Determine influences between rooms
      const newInfluences: InfluenceState[] = []
      for (let i = 0; i < roomActivities.length; i++) {
        for (let j = 0; j < roomActivities.length; j++) {
          if (i !== j) {
            const influence = determineInfluence(roomActivities[i], roomActivities[j])
            if (influence && influence.intensity > 0.3) {
              newInfluences.push(influence)
            }
          }
        }
      }

      // Remove expired influences (older than 5 seconds)
      const now = Date.now()
      setActiveInfluences((prev) => [
        ...prev.filter((inf) => now - inf.timestamp < 5000),
        ...newInfluences,
      ])
    }, 2000) // Check every 2 seconds

    return () => clearInterval(interval)
  }, [])

  // Get influence for a specific room
  const getInfluenceForRoom = (roomId: RoomId): InfluenceState | null => {
    const influence = activeInfluences.find((inf) => inf.targetRoom === roomId)
    return influence && Date.now() - influence.timestamp < 5000 ? influence : null
  }

  return {
    activeInfluences,
    getInfluenceForRoom,
  }
}

