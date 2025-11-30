'use client'

import BehavioralConflictVisual from './BehavioralConflictVisual'
import BehavioralConflictLog from './BehavioralConflictLog'

export default function BehavioralConflictZone() {
  return (
    <div className="lab-border rounded-lg p-6 bg-lab-surface">
      <div className="mb-6">
        <h2 className="text-xl font-mono text-lab-accent mb-2">
          Behavioral Conflict Zone
        </h2>
        <p className="text-sm text-lab-text/70">
          Two models attempt to dominate or adapt to each other's behavior.
          Goal: to demonstrate "conflict" or "tug-of-war."
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BehavioralConflictVisual />
        </div>
        <div className="lg:col-span-1">
          <BehavioralConflictLog />
        </div>
      </div>
    </div>
  )
}

