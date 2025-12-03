import type { NeuralNode, NeuralConnection } from '@/types/neuralMap'

export const generateNeuralConnections = (nodes: NeuralNode[]): NeuralConnection[] => {
  const connections: NeuralConnection[] = []
  const inputNodes = nodes.filter(n => n.layer === 'input')
  const hiddenNodes = nodes.filter(n => n.layer === 'hidden')
  const outputNodes = nodes.filter(n => n.layer === 'output')
  
  // Connect input to hidden (each input connects to 2-3 hidden nodes)
  inputNodes.forEach((input, i) => {
    const targetCount = Math.min(3, hiddenNodes.length)
    const startIdx = i % hiddenNodes.length
    for (let j = 0; j < targetCount; j++) {
      const targetIdx = (startIdx + j) % hiddenNodes.length
      connections.push({
        id: `conn-${input.id}-${hiddenNodes[targetIdx].id}`,
        from: input.id,
        to: hiddenNodes[targetIdx].id,
        weight: 0.5 + Math.random() * 0.5,
        active: false,
        pulseProgress: 0,
      })
    }
  })
  
  // Connect hidden to output (each hidden connects to 1-2 output nodes)
  hiddenNodes.forEach((hidden, i) => {
    const targetCount = Math.min(2, outputNodes.length)
    const startIdx = i % outputNodes.length
    for (let j = 0; j < targetCount; j++) {
      const targetIdx = (startIdx + j) % outputNodes.length
      connections.push({
        id: `conn-${hidden.id}-${outputNodes[targetIdx].id}`,
        from: hidden.id,
        to: outputNodes[targetIdx].id,
        weight: 0.5 + Math.random() * 0.5,
        active: false,
        pulseProgress: 0,
      })
    }
  })
  
  return connections
}

