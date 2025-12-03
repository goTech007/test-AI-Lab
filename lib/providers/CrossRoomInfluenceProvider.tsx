'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCrossRoomInfluence } from '@/hooks/useCrossRoomInfluence'
import type { InfluenceState } from '@/types/crossRoomInfluence'

interface CrossRoomInfluenceContextType {
  activeInfluences: InfluenceState[]
  getInfluenceForRoom: (roomId: 'attention' | 'reaction' | 'pattern' | 'conflict') => InfluenceState | null
}

const CrossRoomInfluenceContext = createContext<CrossRoomInfluenceContextType | undefined>(undefined)

export const useCrossRoomInfluenceContext = () => {
  const context = useContext(CrossRoomInfluenceContext)
  if (!context) {
    throw new Error('useCrossRoomInfluenceContext must be used within CrossRoomInfluenceProvider')
  }
  return context
}

interface CrossRoomInfluenceProviderProps {
  children: ReactNode
}

export const CrossRoomInfluenceProvider = ({ children }: CrossRoomInfluenceProviderProps) => {
  const influenceData = useCrossRoomInfluence()

  return (
    <CrossRoomInfluenceContext.Provider value={influenceData}>
      {children}
    </CrossRoomInfluenceContext.Provider>
  )
}

