'use client'

import ReactionTimeVisual from './ReactionTimeVisual'
import ReactionTimeLog from './ReactionTimeLog'

export default function ReactionTimeChamber() {
  return (
    <div className="lab-border rounded-lg p-6 bg-lab-surface">
      <div className="mb-6">
        <h2 className="text-xl font-mono text-lab-accent mb-2">
          Reaction Time Chamber
        </h2>
        <p className="text-sm text-lab-text/70">
          One model generates stimuli, the other must respond as quickly as possible.
          Goal: to demonstrate reaction latency.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReactionTimeVisual />
        </div>
        <div className="lg:col-span-1">
          <ReactionTimeLog />
        </div>
      </div>
    </div>
  )
}

