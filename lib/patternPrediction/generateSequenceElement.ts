import type { SequenceElement } from '@/types/patternPrediction'

export interface GenerateSequenceElementOptions {
  isNoise?: boolean
  isFalseSignal?: boolean
  cycleIndex?: number
}

export const generateSequenceElement = (
  id: number,
  value: string,
  options: GenerateSequenceElementOptions = {}
): SequenceElement => {
  return {
    id,
    value,
    predicted: false,
    correct: null,
    isNoise: options.isNoise,
    isFalseSignal: options.isFalseSignal,
    cycleIndex: options.cycleIndex,
  }
}

