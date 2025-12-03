'use client'

import { useConflictAnomaly } from '@/hooks/useConflictAnomaly'
import { getAnomalyVisualEffect } from '@/lib/anomaly/getAnomalyVisualEffect'

export default function AnomalyIndicator() {
  const { activeAnomaly } = useConflictAnomaly()
  const effect = getAnomalyVisualEffect(activeAnomaly)

  if (!activeAnomaly || effect.intensity < 0.1) {
    return null
  }

  return (
    <div
      className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-mono z-20 transition-opacity duration-300 animate-pulse"
      style={{
        backgroundColor: `rgba(10, 10, 10, 0.95)`,
        border: `2px solid ${effect.borderColor}`,
        boxShadow: `0 0 15px ${effect.flashColor}, 0 0 30px ${effect.glowColor}`,
        animation: 'pulse 0.5s ease-in-out infinite',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: effect.flashColor,
            boxShadow: `0 0 10px ${effect.flashColor}`,
          }}
        />
        <span className="text-lab-red font-bold">
          ⚠ ANOMALY: {activeAnomaly.severity.toUpperCase()}
        </span>
      </div>
      <div className="text-[10px] text-lab-text/60 mt-1">
        {activeAnomaly.description}
      </div>
    </div>
  )
}

