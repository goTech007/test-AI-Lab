'use client'

import { useState, useEffect, useRef } from 'react'
import type { Stimulus } from '@/types/reactionTime'

export default function ReactionTimeVisual() {
  const [stimuli, setStimuli] = useState<Stimulus[]>([])
  const [modelAStatus, setModelAStatus] = useState<'idle' | 'emitting'>('idle')
  const [modelBStatus, setModelBStatus] = useState<'idle' | 'reacting'>('idle')
  const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null)
  const [averageReactionTime, setAverageReactionTime] = useState(0)
  const stimulusIdRef = useRef(0)
  const reactionStartRef = useRef<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Model A emits a stimulus
      setModelAStatus('emitting')
      
      setTimeout(() => {
        const newStimulus: Stimulus = {
          id: stimulusIdRef.current++,
          timestamp: Date.now(),
          reactionTime: null,
          responded: false,
        }
        
        setCurrentStimulus(newStimulus)
        setStimuli(prev => [...prev, newStimulus])
        setModelAStatus('idle')
        reactionStartRef.current = Date.now()
        
        // Model B reacts after a delay (simulating reaction time)
        const reactionDelay = 200 + Math.random() * 800 // 200-1000ms
        setModelBStatus('reacting')
        
        setTimeout(() => {
          const reactionTime = Date.now() - (reactionStartRef.current || Date.now())
          setStimuli(prev => 
            prev.map(s => 
              s.id === newStimulus.id 
                ? { ...s, reactionTime, responded: true } 
                : s
            )
          )
          setCurrentStimulus(null)
          setModelBStatus('idle')
          
          // Update average
          setAverageReactionTime(prev => {
            const allTimes = [...stimuli, { ...newStimulus, reactionTime, responded: true }]
              .filter(s => s.reactionTime !== null)
              .map(s => s.reactionTime!)
            return allTimes.length > 0 
              ? Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length)
              : reactionTime
          })
        }, reactionDelay)
      }, 300)
    }, 4000 + Math.random() * 2000) // Emit every 4-6 seconds

    return () => clearInterval(interval)
  }, [stimuli.length])

  // Cleanup old stimuli
  useEffect(() => {
    const cleanup = setInterval(() => {
      setStimuli(prev => 
        prev.filter(s => Date.now() - s.timestamp < 10000)
      )
    }, 1000)
    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="lab-border rounded-lg p-6 bg-lab-bg h-[400px] relative overflow-hidden">
      {/* Model A - Stimulus Emitter */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelAStatus === 'emitting' 
              ? 'bg-lab-accent lab-pulse lab-glow' 
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model A (Emitter)</span>
        </div>
      </div>

      {/* Model B - Reactor */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelBStatus === 'reacting' 
              ? 'bg-lab-warning lab-pulse' 
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model B (Reactor)</span>
        </div>
        <div className="text-xs text-lab-text/50 mt-1">
          Avg Reaction: {averageReactionTime}ms
        </div>
      </div>

      {/* Connection Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line
          x1="10%"
          y1="50%"
          x2="90%"
          y2="50%"
          stroke="rgba(42, 42, 42, 0.5)"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
      </svg>

      {/* Stimulus Wave Animation */}
      {currentStimulus && (
        <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-lab-accent lab-glow lab-pulse absolute" 
                 style={{ animation: 'pulse 0.5s infinite' }} />
            <div className="w-8 h-8 rounded-full border-2 border-lab-accent absolute -top-2 -left-2 lab-pulse" 
                 style={{ animation: 'pulse 0.5s infinite', animationDelay: '0.1s' }} />
          </div>
        </div>
      )}

      {/* Reaction Indicator */}
      {stimuli.filter(s => s.responded).map((stimulus, idx) => {
        const position = 90 - (idx * 5) // Stack reactions
        return (
          <div
            key={stimulus.id}
            className="absolute right-[10%] top-1/2 transform -translate-y-1/2"
            style={{ marginTop: `${(idx % 5) * 20 - 40}px` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-lab-warning lab-glow" />
              <div className="text-xs text-lab-warning mt-1 font-mono">
                {stimulus.reactionTime}ms
              </div>
            </div>
          </div>
        )
      })}

      {/* Timeline Visualization */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4">
        <div className="flex items-center justify-between text-xs text-lab-text/30 mb-2">
          <span>Stimulus</span>
          <span>Reaction</span>
        </div>
        <div className="h-1 bg-lab-border rounded-full relative">
          {stimuli.slice(-5).map((stimulus, idx) => {
            if (!stimulus.responded) return null
            const delay = stimulus.reactionTime! / 1000 // Convert to seconds
            const width = Math.min((delay / 2) * 100, 100) // Max 2 seconds = 100%
            return (
              <div
                key={stimulus.id}
                className="absolute h-full bg-lab-warning rounded-full lab-pulse"
                style={{
                  left: `${idx * 20}%`,
                  width: `${width}%`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

