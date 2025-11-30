'use client'

import { useState, useEffect, useRef } from 'react'
import type { SequenceElement } from '@/types/patternPrediction'

export default function PatternPredictionVisual() {
  const [sequence, setSequence] = useState<SequenceElement[]>([])
  const [prediction, setPrediction] = useState<string | null>(null)
  const [modelAStatus, setModelAStatus] = useState<'idle' | 'generating'>('idle')
  const [modelBStatus, setModelBStatus] = useState<'idle' | 'predicting' | 'correct' | 'incorrect'>('idle')
  const [accuracy, setAccuracy] = useState(0)
  const elementIdRef = useRef(0)

  // Pattern types
  const patterns = [
    ['A', 'B', 'C', 'A', 'B', 'C'],
    ['1', '2', '3', '1', '2', '3'],
    ['X', 'Y', 'Z', 'X', 'Y', 'Z'],
    ['α', 'β', 'γ', 'α', 'β', 'γ'],
  ]

  const [currentPattern, setCurrentPattern] = useState<string[]>(patterns[0])
  const [patternIndex, setPatternIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Model A generates next element in sequence
      setModelAStatus('generating')
      
      setTimeout(() => {
        const nextValue = currentPattern[patternIndex % currentPattern.length]
        const newElement: SequenceElement = {
          id: elementIdRef.current++,
          value: nextValue,
          predicted: false,
          correct: null,
        }
        
        setSequence(prev => [...prev, newElement])
        setPatternIndex(prev => prev + 1)
        setModelAStatus('idle')
        
        // Model B attempts to predict
        setModelBStatus('predicting')
        
        setTimeout(() => {
          // Prediction logic: sometimes correct, sometimes wrong
          const willPredictCorrectly = Math.random() > 0.25 // 75% accuracy
          const predictedValue = willPredictCorrectly
            ? currentPattern[(patternIndex + 1) % currentPattern.length]
            : currentPattern[Math.floor(Math.random() * currentPattern.length)]
          
          setPrediction(predictedValue)
          
          setTimeout(() => {
            const actualNext = currentPattern[(patternIndex + 1) % currentPattern.length]
            const isCorrect = predictedValue === actualNext
            
            setSequence(prev => 
              prev.map(s => 
                s.id === newElement.id 
                  ? { ...s, predicted: true, correct: isCorrect } 
                  : s
              )
            )
            
            setModelBStatus(isCorrect ? 'correct' : 'incorrect')
            setPrediction(null)
            
            // Update accuracy
            setAccuracy(prev => {
              const allPredictions = [...sequence, { ...newElement, predicted: true, correct: isCorrect }]
                .filter(s => s.predicted && s.correct !== null)
              const correctCount = allPredictions.filter(s => s.correct).length
              return allPredictions.length > 0
                ? Math.round((correctCount / allPredictions.length) * 100)
                : (isCorrect ? 100 : 0)
            })
            
            setTimeout(() => setModelBStatus('idle'), 1000)
          }, 500)
        }, 600 + Math.random() * 800)
      }, 300)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [sequence.length, patternIndex, currentPattern])

  // Change pattern occasionally
  useEffect(() => {
    const patternChange = setInterval(() => {
      const newPattern = patterns[Math.floor(Math.random() * patterns.length)]
      setCurrentPattern(newPattern)
      setSequence([])
      setPatternIndex(0)
    }, 30000) // Change every 30 seconds

    return () => clearInterval(patternChange)
  }, [])

  // Keep only last 8 elements
  useEffect(() => {
    if (sequence.length > 8) {
      setSequence(prev => prev.slice(-8))
    }
  }, [sequence.length])

  return (
    <div className="lab-border rounded-lg p-6 bg-lab-bg h-[400px] relative overflow-hidden">
      {/* Model A - Sequence Generator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelAStatus === 'generating' 
              ? 'bg-lab-accent lab-pulse lab-glow' 
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model A (Generator)</span>
        </div>
      </div>

      {/* Model B - Predictor */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            modelBStatus === 'predicting' 
              ? 'bg-lab-warning lab-pulse' 
              : modelBStatus === 'correct'
              ? 'bg-lab-accent lab-glow'
              : modelBStatus === 'incorrect'
              ? 'bg-red-500'
              : 'bg-lab-text/30'
          }`} />
          <span className="text-xs text-lab-text/70">Model B (Predictor)</span>
        </div>
        <div className="text-xs text-lab-text/50 mt-1">
          Accuracy: {accuracy}%
        </div>
      </div>

      {/* Sequence Display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-3">
          {sequence.map((element, idx) => (
            <div
              key={element.id}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-lg transition-all ${
                  element.predicted
                    ? element.correct
                      ? 'border-lab-accent bg-lab-accent/20 lab-glow'
                      : 'border-red-500 bg-red-500/20'
                    : 'border-lab-text/30 bg-lab-bg'
                }`}
              >
                {element.value}
              </div>
              {element.predicted && (
                <div className={`text-xs ${
                  element.correct ? 'text-lab-accent' : 'text-red-500'
                }`}>
                  {element.correct ? '✓' : '✗'}
                </div>
              )}
            </div>
          ))}
          
          {/* Prediction Indicator */}
          {prediction && (
            <div className="flex flex-col items-center gap-2 ml-2">
              <div className="w-12 h-12 rounded-lg border-2 border-dashed border-lab-warning bg-lab-warning/10 flex items-center justify-center font-mono text-lg lab-pulse">
                ?
              </div>
              <div className="text-xs text-lab-warning">Predicting...</div>
            </div>
          )}
        </div>
      </div>

      {/* Pattern Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-lab-text/50 text-center">
          Pattern: {currentPattern.join(' → ')}
        </div>
      </div>
    </div>
  )
}

