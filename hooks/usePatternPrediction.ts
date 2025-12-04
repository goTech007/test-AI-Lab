'use client'

import { useState, useEffect, useRef } from 'react'
import type { SequenceElement } from '@/types/patternPrediction'
import { generateSequenceElement } from '@/lib/patternPrediction/generateSequenceElement'
import { getNextPatternValueComplex } from '@/lib/patternPrediction/getNextPatternValueComplex'
import { calculateAccuracy } from '@/lib/patternPrediction/calculateAccuracy'
import { limitSequenceLength } from '@/lib/patternPrediction/limitSequenceLength'
import { generatePrediction } from '@/lib/patternPrediction/generatePrediction'
import { generateComplexPattern, type ComplexPattern } from '@/lib/patternPrediction/generateComplexPattern'

export const usePatternPrediction = () => {
  const [sequence, setSequence] = useState<SequenceElement[]>([])
  const [prediction, setPrediction] = useState<string | null>(null)
  const [modelAStatus, setModelAStatus] = useState<'idle' | 'generating'>('idle')
  const [modelBStatus, setModelBStatus] = useState<'idle' | 'predicting' | 'correct' | 'incorrect'>('idle')
  const [accuracy, setAccuracy] = useState(0)
  const elementIdRef = useRef(0)
  const [currentPattern, setCurrentPattern] = useState<ComplexPattern | null>(null)
  const [patternIndex, setPatternIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Initialize on client side only
  useEffect(() => {
    setIsMounted(true)
    if (!currentPattern) {
      setCurrentPattern(generateComplexPattern())
    }
  }, [])

  useEffect(() => {
    if (!currentPattern || !isMounted) return

    const interval = setInterval(() => {
      // Model A generates next element in sequence
      setModelAStatus('generating')
      
      setTimeout(() => {
        const nextResult = getNextPatternValueComplex(currentPattern, patternIndex)
        const newElement = generateSequenceElement(
          elementIdRef.current++,
          nextResult.value,
          {
            isNoise: nextResult.isNoise,
            isFalseSignal: nextResult.isFalseSignal,
            cycleIndex: nextResult.cycleIndex,
          }
        )
        
        setSequence(prev => [...prev, newElement])
        setPatternIndex(prev => prev + 1)
        setModelAStatus('idle')
        
        // Model B attempts to predict (harder with noise and false signals)
        setModelBStatus('predicting')
        
        setTimeout(() => {
          // Prediction accuracy reduced by complexity
          const complexityPenalty = (currentPattern.hasNoise ? 0.15 : 0) + 
                                    (currentPattern.hasFalseSignals ? 0.2 : 0)
          const baseAccuracy = 0.75
          const adjustedAccuracy = baseAccuracy - complexityPenalty
          const willPredictCorrectly = Math.random() > (1 - adjustedAccuracy)
          
          // Get the actual next value from base pattern (what should come next)
          const actualNextBase = currentPattern.basePattern[(patternIndex + 1) % currentPattern.cycleLength]
          const predictedValue = generatePrediction(currentPattern.basePattern, patternIndex, willPredictCorrectly)
          
          setPrediction(predictedValue)
          
          setTimeout(() => {
            // Get what actually comes next (may be noise/false signal)
            const nextNextResult = getNextPatternValueComplex(currentPattern, patternIndex + 1)
            const actualNext = nextNextResult.value
            
            // Prediction is correct if:
            // 1. Predicted value matches the base pattern next value
            // 2. The actual next value is not noise or false signal (or if it is, prediction still matches base)
            const isCorrect = predictedValue === actualNextBase && 
                             (actualNext === actualNextBase || predictedValue === actualNext)
            
            setSequence(prevSequence => {
              const updated = prevSequence.map(s => 
                s.id === newElement.id 
                  ? { ...s, predicted: true, correct: isCorrect } 
                  : s
              )
              setAccuracy(calculateAccuracy(updated, { ...newElement, predicted: true, correct: isCorrect }, isCorrect))
              return updated
            })
            
            setModelBStatus(isCorrect ? 'correct' : 'incorrect')
            setPrediction(null)
            
            setTimeout(() => setModelBStatus('idle'), 1000)
          }, 500)
        }, 600 + Math.random() * 800)
      }, 300)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [sequence.length, patternIndex, currentPattern, isMounted])

  // Change pattern occasionally (with complexity upgrade)
  useEffect(() => {
    if (!isMounted) return

    const patternChange = setInterval(() => {
      const newPattern = generateComplexPattern()
      setCurrentPattern(newPattern)
      setSequence([])
      setPatternIndex(0)
    }, 30000) // Change every 30 seconds

    return () => clearInterval(patternChange)
  }, [isMounted])

  // Keep only last 8 elements
  useEffect(() => {
    setSequence(prev => limitSequenceLength(prev))
  }, [sequence.length])

  return {
    sequence,
    prediction,
    modelAStatus,
    modelBStatus,
    accuracy,
    currentPattern: currentPattern?.basePattern || [],
    patternComplexity: currentPattern,
  }
}

