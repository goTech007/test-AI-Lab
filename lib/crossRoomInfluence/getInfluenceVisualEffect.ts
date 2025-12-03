import type { InfluenceState } from '@/types/crossRoomInfluence'

export const getInfluenceVisualEffect = (influence: InfluenceState | null): {
  borderColor: string
  glowColor: string
  opacity: number
} => {
  if (!influence) {
    return {
      borderColor: 'rgba(42, 42, 42, 1)',
      glowColor: 'transparent',
      opacity: 0,
    }
  }

  const { type, intensity } = influence

  if (type === 'positive') {
    return {
      borderColor: `rgba(0, 255, 136, ${intensity * 0.6})`, // lab-accent
      glowColor: `rgba(0, 255, 136, ${intensity * 0.3})`,
      opacity: intensity,
    }
  } else if (type === 'negative') {
    return {
      borderColor: `rgba(248, 113, 113, ${intensity * 0.6})`, // lab-red
      glowColor: `rgba(248, 113, 113, ${intensity * 0.3})`,
      opacity: intensity,
    }
  } else {
    return {
      borderColor: `rgba(255, 170, 0, ${intensity * 0.6})`, // lab-warning
      glowColor: `rgba(255, 170, 0, ${intensity * 0.3})`,
      opacity: intensity,
    }
  }
}

export const getInfluenceMessage = (influence: InfluenceState | null): string | null => {
  if (!influence) return null

  const { sourceRoom, targetRoom, type } = influence
  const sourceNames: Record<string, string> = {
    attention: 'Attention Response Lab',
    reaction: 'Reaction Time Chamber',
    pattern: 'Pattern Prediction Room',
    conflict: 'Behavioral Conflict Zone',
  }

  const targetNames: Record<string, string> = {
    attention: 'Attention Response Lab',
    reaction: 'Reaction Time Chamber',
    pattern: 'Pattern Prediction Room',
    conflict: 'Behavioral Conflict Zone',
  }

  if (type === 'positive') {
    return `${sourceNames[sourceRoom]} → enhancing ${targetNames[targetRoom]}`
  } else if (type === 'negative') {
    return `${sourceNames[sourceRoom]} → disrupting ${targetNames[targetRoom]}`
  } else {
    return `${sourceNames[sourceRoom]} → influencing ${targetNames[targetRoom]}`
  }
}

