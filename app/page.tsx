import AttentionResponseLab from '@/components/AttentionResponseLab'
import ReactionTimeChamber from '@/components/ReactionTimeChamber'
import PatternPredictionRoom from '@/components/PatternPredictionRoom'
import BehavioralConflictZone from '@/components/BehavioralConflictZone'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-8 pb-4 border-b border-lab-border">
          <h1 className="text-2xl font-mono text-lab-accent mb-2">
            AI Behavioral Observation Protocol
          </h1>
          <p className="text-sm text-lab-text/70">
            v0.1 Experimental Research Facility
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttentionResponseLab />
          <ReactionTimeChamber />
          <PatternPredictionRoom />
          {/* <BehavioralConflictZone /> */}
        </div>
      </div>
    </main>
  )
}

