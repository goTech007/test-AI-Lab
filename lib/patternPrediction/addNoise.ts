import type { SequenceElement } from '@/types/patternPrediction'
import { SYMBOL_SETS } from './generateComplexPattern'

export const addNoise = (
  value: string,
  probability: number
): { value: string; isNoise: boolean } => {
  if (Math.random() > probability) {
    return { value, isNoise: false }
  }

  // Generate random noise symbol
  const allSymbols = Object.values(SYMBOL_SETS).flat()
  const noiseSymbols = allSymbols.filter(s => s !== value)
  const randomNoise = noiseSymbols[Math.floor(Math.random() * noiseSymbols.length)]

  return {
    value: randomNoise,
    isNoise: true,
  }
}

