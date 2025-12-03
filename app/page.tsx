'use client'

import { useRoomFocus } from '@/hooks/useRoomFocus'
import { CrossRoomInfluenceProvider } from '@/lib/providers/CrossRoomInfluenceProvider'
import AttentionResponseLab from '@/components/AttentionResponseLabPage/AttentionResponseLab'
import ReactionTimeChamber from '@/components/ReactionTimeChamberPage/ReactionTimeChamber'
import PatternPredictionRoom from '@/components/PatternPredictionRoomPage/PatternPredictionRoom'
import BehavioralConflictZone from '@/components/BehavioralConflictZonePage/BehavioralConflictZone'

export default function Home() {
  const { focusedRoom, setFocusedRoom } = useRoomFocus('attention')

  return (
    <CrossRoomInfluenceProvider>
      <main className="min-h-screen p-8">
        <div className="max-w-[1440px] mx-auto">
        <header className="mb-8 pb-4 border-b border-lab-border flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-mono text-lab-accent mb-2">
              AI Behavioral Observation Protocol
            </h1>
            <p className="text-sm text-lab-text/70">
              v0.1 Experimental Research Facility
            </p>
          </div>
          <a
            href="https://x.com/behavioral_lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lab-text/70 hover:text-lab-accent transition-colors"
            aria-label="Follow on X"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="room-attention">
            <AttentionResponseLab 
              isFocused={focusedRoom === 'attention'}
              onFocus={() => setFocusedRoom('attention')}
            />
          </div>
          <div id="room-reaction">
            <ReactionTimeChamber 
              isFocused={focusedRoom === 'reaction'}
              onFocus={() => setFocusedRoom('reaction')}
            />
          </div>
          <div id="room-pattern">
            <PatternPredictionRoom 
              isFocused={focusedRoom === 'pattern'}
              onFocus={() => setFocusedRoom('pattern')}
            />
          </div>
          <div id="room-conflict">
            <BehavioralConflictZone 
              isFocused={focusedRoom === 'conflict'}
              onFocus={() => setFocusedRoom('conflict')}
            />
          </div>
        </div>
      </div>
      </main>
    </CrossRoomInfluenceProvider>
  )
}

