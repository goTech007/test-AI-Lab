import type { ComplexPattern } from './generateComplexPattern'

export const addFalseSignal = (
  pattern: ComplexPattern,
  currentIndex: number
): { value: string; isFalseSignal: boolean } => {
  if (Math.random() > pattern.falseSignalProbability) {
    return { value: '', isFalseSignal: false }
  }

  // Generate a decoy pattern that looks similar but is wrong
  const decoyPattern = [...pattern.basePattern].reverse() // Reverse pattern
  const falseValue = decoyPattern[currentIndex % decoyPattern.length]

  return {
    value: falseValue,
    isFalseSignal: true,
  }
}

