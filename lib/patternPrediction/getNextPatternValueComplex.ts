import type { ComplexPattern } from './generateComplexPattern'
import { addNoise } from './addNoise'
import { addFalseSignal } from './addFalseSignal'

export interface NextPatternResult {
  value: string
  isNoise: boolean
  isFalseSignal: boolean
  cycleIndex: number
}

export const getNextPatternValueComplex = (
  pattern: ComplexPattern,
  index: number
): NextPatternResult => {
  const cycleIndex = index % pattern.cycleLength
  const baseValue = pattern.basePattern[cycleIndex]

  // Check for false signal first (decoy pattern)
  if (pattern.hasFalseSignals) {
    const falseSignal = addFalseSignal(pattern, index)
    if (falseSignal.isFalseSignal) {
      return {
        value: falseSignal.value,
        isNoise: false,
        isFalseSignal: true,
        cycleIndex,
      }
    }
  }

  // Check for noise (random interference)
  if (pattern.hasNoise) {
    const noiseResult = addNoise(baseValue, pattern.noiseProbability)
    if (noiseResult.isNoise) {
      return {
        value: noiseResult.value,
        isNoise: true,
        isFalseSignal: false,
        cycleIndex,
      }
    }
  }

  // Normal pattern value
  return {
    value: baseValue,
    isNoise: false,
    isFalseSignal: false,
    cycleIndex,
  }
}

