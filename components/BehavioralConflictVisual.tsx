'use client'

import { useState, useEffect, useRef } from 'react'

interface ConflictState {
  modelAPower: number
  modelBPower: number
  dominance: 'A' | 'B' | 'balanced'
  timestamp: number
}

export default function BehavioralConflictVisual() {
  const [modelAPower, setModelAPower] = useState(50)
  const [modelBPower, setModelBPower] = useState(50)
  const [modelAStatus, setModelAStatus] = useState<'idle' | 'dominating' | 'adapting'>('idle')
  const [modelBStatus, setModelBStatus] = useState<'idle' | 'dominating' | 'adapting'>('idle')
  const [conflictHistory, setConflictHistory] = useState<ConflictState[]>([])
  const [currentDominance, setCurrentDominance] = useState<'A' | 'B' | 'balanced'>('balanced')

  useEffect(() => {
    const interval = setInterval(() => {
      // Random conflict event
      const eventType = Math.random()
      
      if (eventType < 0.4) {
        // Model A tries to dominate
        setModelAStatus('dominating')
        setModelBStatus('adapting')
        
        setTimeout(() => {
          const powerShift = 5 + Math.random() * 10
          setModelAPower(prev => Math.min(100, prev + powerShift))
          setModelBPower(prev => Math.max(0, prev - powerShift))
        }, 300)
        
        setTimeout(() => {
          setModelAStatus('idle')
          setModelBStatus('idle')
        }, 1500)
      } else if (eventType < 0.8) {
        // Model B tries to dominate
        setModelBStatus('dominating')
        setModelAStatus('adapting')
        
        setTimeout(() => {
          const powerShift = 5 + Math.random() * 10
          setModelBPower(prev => Math.min(100, prev + powerShift))
          setModelAPower(prev => Math.max(0, prev - powerShift))
        }, 300)
        
        setTimeout(() => {
          setModelAStatus('idle')
          setModelBStatus('idle')
        }, 1500)
      } else {
        // Balanced struggle
        setModelAStatus('dominating')
        setModelBStatus('dominating')
        
        setTimeout(() => {
          const shift = (Math.random() - 0.5) * 5
          setModelAPower(prev => Math.max(0, Math.min(100, prev + shift)))
          setModelBPower(prev => Math.max(0, Math.min(100, prev - shift)))
        }, 300)
        
        setTimeout(() => {
          setModelAStatus('idle')
          setModelBStatus('idle')
        }, 1500)
      }
    }, 2000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [])

  // Update dominance and history
  useEffect(() => {
    const diff = modelAPower - modelBPower
    let dominance: 'A' | 'B' | 'balanced'
    
    if (diff > 15) {
      dominance = 'A'
    } else if (diff < -15) {
      dominance = 'B'
    } else {
      dominance = 'balanced'
    }
    
    setCurrentDominance(dominance)
    
    setConflictHistory(prev => {
      const newState: ConflictState = {
        modelAPower,
        modelBPower,
        dominance,
        timestamp: Date.now(),
      }
      const updated = [...prev, newState]
      return updated.slice(-20) // Keep last 20 states
    })
  }, [modelAPower, modelBPower])

  // Gradual rebalancing
  useEffect(() => {
    const rebalance = setInterval(() => {
      if (Math.abs(modelAPower - modelBPower) > 5) {
        const diff = (modelAPower - modelBPower) * 0.05
        setModelAPower(prev => prev - diff)
        setModelBPower(prev => prev + diff)
      }
    }, 1000)

    return () => clearInterval(rebalance)
  }, [modelAPower, modelBPower])

  return (
    <div className="lab-border rounded-lg p-6 bg-lab-bg h-[400px] relative overflow-hidden">
      {/* Model A */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelAStatus === 'dominating' 
              ? 'bg-lab-accent lab-pulse lab-glow' 
              : modelAStatus === 'adapting'
              ? 'bg-lab-warning lab-pulse'
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model A</span>
        </div>
        <div className="text-xs text-lab-text/50 mt-1">
          Power: {Math.round(modelAPower)}%
        </div>
      </div>

      {/* Model B */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelBStatus === 'dominating' 
              ? 'bg-lab-warning lab-pulse lab-glow' 
              : modelBStatus === 'adapting'
              ? 'bg-lab-accent lab-pulse'
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model B</span>
        </div>
        <div className="text-xs text-lab-text/50 mt-1">
          Power: {Math.round(modelBPower)}%
        </div>
      </div>

      {/* Conflict Visualization - Tug of War */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-lab-border transform -translate-x-1/2" />
        
        {/* Power Bars */}
        <div className="flex items-center h-32">
          {/* Model A Bar */}
          <div className="flex-1 h-full flex items-center justify-end pr-4">
            <div className="relative w-full h-8">
              <div 
                className="h-full bg-lab-accent/30 border border-lab-accent transition-all duration-500"
                style={{ width: `${modelAPower}%` }}
              />
              {modelAStatus === 'dominating' && (
                <div className="absolute inset-0 bg-lab-accent/50 lab-pulse" />
              )}
            </div>
          </div>
          
          {/* Center Indicator */}
          <div className="w-16 h-16 rounded-full border-2 border-lab-border bg-lab-bg flex items-center justify-center">
            <div className={`text-xs font-mono ${
              currentDominance === 'A' 
                ? 'text-lab-accent' 
                : currentDominance === 'B'
                ? 'text-lab-warning'
                : 'text-lab-text/50'
            }`}>
              {currentDominance === 'A' ? 'A↑' : currentDominance === 'B' ? 'B↑' : '='}
            </div>
          </div>
          
          {/* Model B Bar */}
          <div className="flex-1 h-full flex items-center justify-start pl-4">
            <div className="relative w-full h-8">
              <div 
                className="h-full bg-lab-warning/30 border border-lab-warning transition-all duration-500 ml-auto"
                style={{ width: `${modelBPower}%` }}
              />
              {modelBStatus === 'dominating' && (
                <div className="absolute inset-0 bg-lab-warning/50 lab-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Waves */}
      {(modelAStatus === 'dominating' || modelBStatus === 'dominating') && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-64 h-64">
            <div className={`absolute inset-0 rounded-full border-2 ${
              modelAStatus === 'dominating' 
                ? 'border-lab-accent' 
                : 'border-lab-warning'
            } lab-pulse`} 
            style={{ animation: 'pulse 1s infinite' }} />
            <div className={`absolute inset-4 rounded-full border-2 ${
              modelAStatus === 'dominating' 
                ? 'border-lab-accent' 
                : 'border-lab-warning'
            } lab-pulse`} 
            style={{ animation: 'pulse 1s infinite', animationDelay: '0.3s' }} />
          </div>
        </div>
      )}

      {/* Dominance Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-lab-text/50 text-center">
          Status: {currentDominance === 'A' ? 'Model A Dominating' : currentDominance === 'B' ? 'Model B Dominating' : 'Balanced Conflict'}
        </div>
      </div>
    </div>
  )
}

