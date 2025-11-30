'use client'

import { useState, useEffect, useRef } from 'react'
import type { Stimulus } from '@/types/attentionResponse'

export default function ExperimentVisual() {
  const [stimuli, setStimuli] = useState<Stimulus[]>([])
  const [modelAStatus, setModelAStatus] = useState<'idle' | 'generating'>('idle')
  const [modelBStatus, setModelBStatus] = useState<'idle' | 'detecting' | 'detected'>('idle')
  const [detectionRate, setDetectionRate] = useState(0)
  const stimulusIdRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Model A generates a stimulus
      setModelAStatus('generating')
      
      setTimeout(() => {
        const newStimulus: Stimulus = {
          id: stimulusIdRef.current++,
          x: Math.random() * 80 + 10, // 10-90%
          y: Math.random() * 80 + 10,
          type: Math.random() > 0.5 ? 'pattern' : 'signal',
          detected: false,
          timestamp: Date.now(),
        }
        
        setStimuli(prev => [...prev, newStimulus])
        setModelAStatus('idle')
        
        // Model B attempts to detect
        setModelBStatus('detecting')
        
        setTimeout(() => {
          const willDetect = Math.random() > 0.3 // 70% detection rate
          if (willDetect) {
            setStimuli(prev => 
              prev.map(s => 
                s.id === newStimulus.id ? { ...s, detected: true } : s
              )
            )
            setModelBStatus('detected')
            setTimeout(() => setModelBStatus('idle'), 500)
          } else {
            setModelBStatus('idle')
          }
          
          // Update detection rate
          setDetectionRate(prev => {
            const total = stimuli.length + 1
            const detected = stimuli.filter(s => s.detected).length + (willDetect ? 1 : 0)
            return Math.round((detected / total) * 100)
          })
        }, 800 + Math.random() * 1200) // Detection delay
      }, 300)
    }, 3000 + Math.random() * 2000) // Generate every 3-5 seconds

    return () => clearInterval(interval)
  }, [stimuli.length])

  // Remove old stimuli after 8 seconds
  useEffect(() => {
    const cleanup = setInterval(() => {
      setStimuli(prev => 
        prev.filter(s => Date.now() - s.timestamp < 8000)
      )
    }, 1000)
    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="lab-border rounded-lg p-6 bg-lab-bg h-[400px] relative overflow-hidden">
      {/* Model A - Stimulus Generator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelAStatus === 'generating' 
              ? 'bg-lab-accent lab-pulse lab-glow' 
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model A (Generator)</span>
        </div>
      </div>

      {/* Model B - Detector */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelBStatus === 'detecting' 
              ? 'bg-lab-warning lab-pulse' 
              : modelBStatus === 'detected'
              ? 'bg-lab-accent lab-glow'
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model B (Detector)</span>
        </div>
        <div className="text-xs text-lab-text/50 mt-1">
          Detection Rate: {detectionRate}%
        </div>
      </div>

      {/* Connection Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line
          x1="10%"
          y1="10%"
          x2="90%"
          y2="10%"
          stroke="rgba(42, 42, 42, 0.5)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      </svg>

      {/* Stimuli Visualization */}
      {stimuli.map((stimulus) => (
        <div
          key={stimulus.id}
          className={`absolute transition-all duration-300 ${
            stimulus.detected 
              ? 'opacity-100 scale-110' 
              : 'opacity-60 scale-100'
          }`}
          style={{
            left: `${stimulus.x}%`,
            top: `${stimulus.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              stimulus.type === 'pattern'
                ? 'border-lab-accent bg-lab-accent/20'
                : 'border-lab-warning bg-lab-warning/20'
            } ${
              stimulus.detected 
                ? 'lab-glow lab-pulse' 
                : ''
            }`}
          />
          {stimulus.detected && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-lab-accent">
              ✓ Detected
            </div>
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-lab-accent bg-lab-accent/20" />
          <span className="text-lab-text/50">Pattern Stimulus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-lab-warning bg-lab-warning/20" />
          <span className="text-lab-text/50">Signal Stimulus</span>
        </div>
      </div>
    </div>
  )
}

