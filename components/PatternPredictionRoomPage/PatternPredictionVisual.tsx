'use client'

import { usePatternPrediction } from '@/hooks/usePatternPrediction'
import { useCrossRoomInfluence } from '@/hooks/useCrossRoomInfluence'
import { usePatternAnomaly } from '@/hooks/usePatternAnomaly'
import { getInfluenceVisualEffect } from '@/lib/crossRoomInfluence/getInfluenceVisualEffect'
import { getAnomalyVisualEffect } from '@/lib/anomaly/getAnomalyVisualEffect'
import InfluenceIndicator from './InfluenceIndicator'
import AnomalyIndicator from './AnomalyIndicator'
import NeuralMapProjection from '@/components/ui/NeuralMapProjection'

export default function PatternPredictionVisual() {
  const { sequence, prediction, modelAStatus, modelBStatus, accuracy, currentPattern, patternComplexity } = usePatternPrediction()
  const { getInfluenceForRoom } = useCrossRoomInfluence()
  const { activeAnomaly } = usePatternAnomaly()
  const influence = getInfluenceForRoom('pattern')
  const influenceEffect = getInfluenceVisualEffect(influence)
  const anomalyEffect = getAnomalyVisualEffect(activeAnomaly)

  const hasAnomaly = activeAnomaly !== null

  return (
    <div 
      className="lab-border rounded-lg p-6 bg-lab-bg h-[400px] relative overflow-hidden transition-all duration-500"
      style={{
        borderColor: hasAnomaly ? anomalyEffect.borderColor : influenceEffect.borderColor,
        borderWidth: hasAnomaly ? '3px' : '1px',
        boxShadow: hasAnomaly
          ? `0 0 30px ${anomalyEffect.glowColor}, 0 0 60px ${anomalyEffect.flashColor}, inset 0 0 30px ${anomalyEffect.flashColor}` 
          : (influenceEffect.opacity > 0.1
            ? `0 0 20px ${influenceEffect.glowColor}, inset 0 0 20px ${influenceEffect.glowColor}` 
            : undefined),
      }}
    >
      <AnomalyIndicator />
      <InfluenceIndicator />
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
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-lg transition-all relative ${
                  element.isNoise
                    ? 'border-lab-warning bg-lab-warning/10 border-dashed'
                    : element.isFalseSignal
                    ? 'border-lab-orange bg-lab-orange/10 border-dotted'
                    : element.predicted
                    ? element.correct
                      ? 'border-lab-accent bg-lab-accent/20 lab-glow'
                      : 'border-red-500 bg-red-500/20'
                    : 'border-lab-text/30 bg-lab-bg'
                }`}
              >
                {element.value}
                {element.isNoise && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-lab-warning rounded-full text-[8px] flex items-center justify-center" title="Noise">
                    N
                  </div>
                )}
                {element.isFalseSignal && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-lab-orange rounded-full text-[8px] flex items-center justify-center" title="False Signal">
                    F
                  </div>
                )}
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
        <div className="text-xs text-lab-text/50 text-center space-y-1">
          <div>
            Pattern: {currentPattern.join(' → ')}
            {patternComplexity && (
              <span className="ml-2 text-lab-text/40">
                (Cycle: {patternComplexity.cycleLength})
              </span>
            )}
          </div>
          {patternComplexity && (
            <div className="flex items-center justify-center gap-3 text-[10px]">
              {patternComplexity.hasNoise && (
                <span className="text-lab-warning">⚡ Noise: {Math.round(patternComplexity.noiseProbability * 100)}%</span>
              )}
              {patternComplexity.hasFalseSignals && (
                <span className="text-lab-orange">⚠ False Signals: {Math.round(patternComplexity.falseSignalProbability * 100)}%</span>
              )}
              {!patternComplexity.hasNoise && !patternComplexity.hasFalseSignals && (
                <span className="text-lab-accent">✓ Simple Pattern</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Neural Map Projection */}
      <div className="absolute bottom-4 right-4 lab-border rounded p-2 bg-lab-bg/80 backdrop-blur-sm">
        <NeuralMapProjection 
          nodeCount={10} 
          width={180} 
          height={120} 
          activityTrigger={sequence.length}
        />
      </div>
    </div>
  )
}

