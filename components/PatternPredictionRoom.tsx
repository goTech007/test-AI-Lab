'use client'

import PatternPredictionVisual from './PatternPredictionVisual'
import PatternPredictionLog from './PatternPredictionLog'

export default function PatternPredictionRoom() {
  return (
    <div className="lab-border rounded-lg p-6 bg-lab-surface">
      <div className="mb-6">
        <h2 className="text-xl font-mono text-lab-accent mb-2">
          Pattern Prediction Room
        </h2>
        <p className="text-sm text-lab-text/70">
          One model creates sequences, the other tries to predict the next element.
          Goal: to demonstrate basic behavioral modeling.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatternPredictionVisual />
        </div>
        <div className="lg:col-span-1">
          <PatternPredictionLog />
        </div>
      </div>
    </div>
  )
}

