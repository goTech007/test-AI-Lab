'use client'

import { useReactionTimeMetrics } from '@/hooks/useReactionTimeMetrics'
import { formatMetricValue } from '@/lib/behavioralMetrics/formatMetricValue'
import { getMetricColor } from '@/lib/behavioralMetrics/getMetricColor'

export default function BehavioralMetricsPanel() {
  const { metrics } = useReactionTimeMetrics()

  const metricItems = [
    { label: 'Stability', value: metrics.stability },
    { label: 'Variability', value: metrics.variability },
    { label: 'Deviation', value: metrics.deviation },
    { label: 'Reactivity', value: metrics.reactivity },
  ]

  return (
    <div className="lab-border rounded-lg p-4 bg-lab-bg">
      <div className="mb-3 pb-2 border-b border-lab-border">
        <h3 className="text-sm font-mono text-lab-text/70">
          Behavioral Metrics
        </h3>
      </div>
      
      <div className="space-y-3">
        {metricItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-lab-text/60 font-mono">{item.label}</span>
              <span className="text-lab-text/80 font-mono">
                {formatMetricValue(item.value)}
              </span>
            </div>
            <div className="h-2 bg-lab-surface rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getMetricColor(item.value)}`}
                style={{ width: `${item.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

