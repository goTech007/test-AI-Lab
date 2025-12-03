'use client'

import { useCrossRoomInfluence } from '@/hooks/useCrossRoomInfluence'
import { getInfluenceVisualEffect, getInfluenceMessage } from '@/lib/crossRoomInfluence/getInfluenceVisualEffect'

export default function InfluenceIndicator() {
  const { getInfluenceForRoom } = useCrossRoomInfluence()
  const influence = getInfluenceForRoom('reaction')
  const effect = getInfluenceVisualEffect(influence)
  const message = getInfluenceMessage(influence)

  if (!influence || effect.opacity < 0.1) {
    return null
  }

  return (
    <div
      className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono z-10 transition-opacity duration-500"
      style={{
        backgroundColor: `rgba(10, 10, 10, 0.9)`,
        border: `1px solid ${effect.borderColor}`,
        boxShadow: `0 0 10px ${effect.glowColor}`,
        opacity: effect.opacity,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: effect.borderColor }}
        />
        <span className="text-lab-text/80">{message}</span>
      </div>
    </div>
  )
}

