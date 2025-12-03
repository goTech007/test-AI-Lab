export interface ComplexPattern {
  basePattern: string[]
  cycleLength: number
  hasNoise: boolean
  hasFalseSignals: boolean
  noiseProbability: number
  falseSignalProbability: number
}

export const SYMBOL_SETS = {
  basic: ['A', 'B', 'C'],
  numeric: ['1', '2', '3', '4'],
  greek: ['α', 'β', 'γ', 'δ'],
  shapes: ['●', '■', '▲', '◆'],
  arrows: ['→', '←', '↑', '↓'],
  symbols: ['★', '☆', '◉', '◈'],
}

export const generateComplexPattern = (): ComplexPattern => {
  const rand = Math.random()
  
  // Different complexity levels
  if (rand < 0.3) {
    // Simple pattern with cycles
    return {
      basePattern: ['A', 'B', 'C', 'A', 'B', 'C'],
      cycleLength: 3,
      hasNoise: false,
      hasFalseSignals: false,
      noiseProbability: 0,
      falseSignalProbability: 0,
    }
  } else if (rand < 0.6) {
    // Pattern with noise
    const symbols = Object.values(SYMBOL_SETS)[Math.floor(Math.random() * Object.keys(SYMBOL_SETS).length)]
    return {
      basePattern: [...symbols, ...symbols.slice(0, 2)],
      cycleLength: symbols.length,
      hasNoise: true,
      hasFalseSignals: false,
      noiseProbability: 0.15, // 15% chance of noise
      falseSignalProbability: 0,
    }
  } else if (rand < 0.85) {
    // Pattern with false signals
    const symbols = Object.values(SYMBOL_SETS)[Math.floor(Math.random() * Object.keys(SYMBOL_SETS).length)]
    return {
      basePattern: [...symbols, ...symbols.slice(0, 2)],
      cycleLength: symbols.length,
      hasNoise: false,
      hasFalseSignals: true,
      noiseProbability: 0,
      falseSignalProbability: 0.2, // 20% chance of false signal
    }
  } else {
    // Complex pattern with both noise and false signals
    const symbols = Object.values(SYMBOL_SETS)[Math.floor(Math.random() * Object.keys(SYMBOL_SETS).length)]
    return {
      basePattern: [...symbols, ...symbols.slice(0, 2)],
      cycleLength: symbols.length,
      hasNoise: true,
      hasFalseSignals: true,
      noiseProbability: 0.12,
      falseSignalProbability: 0.15,
    }
  }
}

