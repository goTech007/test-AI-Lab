export interface NeuralNode {
  id: string
  x: number // 0-100 percentage
  y: number // 0-100 percentage
  activation: number // 0-1
  layer: 'input' | 'hidden' | 'output'
  lastPulse: number // timestamp
}

export interface NeuralConnection {
  id: string
  from: string // node id
  to: string // node id
  weight: number // 0-1
  active: boolean
  pulseProgress: number // 0-1 for animation
}

export interface NeuralMapState {
  nodes: NeuralNode[]
  connections: NeuralConnection[]
  lastActivation: number
}

