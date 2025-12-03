import type { NeuralNode } from '@/types/neuralMap'

export const generateNeuralNodes = (nodeCount: number = 12): NeuralNode[] => {
  const nodes: NeuralNode[] = []
  
  // Input layer (3-4 nodes)
  const inputCount = Math.max(3, Math.floor(nodeCount * 0.25))
  for (let i = 0; i < inputCount; i++) {
    nodes.push({
      id: `input-${i}`,
      x: 15 + (i * 20),
      y: 20,
      activation: 0,
      layer: 'input',
      lastPulse: 0,
    })
  }
  
  // Hidden layer (4-6 nodes)
  const hiddenCount = Math.max(4, Math.floor(nodeCount * 0.5))
  const hiddenStart = Math.floor((nodeCount - hiddenCount) / 2)
  for (let i = 0; i < hiddenCount; i++) {
    nodes.push({
      id: `hidden-${i}`,
      x: 20 + (i * (60 / hiddenCount)),
      y: 50,
      activation: 0,
      layer: 'hidden',
      lastPulse: 0,
    })
  }
  
  // Output layer (2-3 nodes)
  const outputCount = Math.max(2, nodeCount - inputCount - hiddenCount)
  for (let i = 0; i < outputCount; i++) {
    nodes.push({
      id: `output-${i}`,
      x: 30 + (i * 30),
      y: 80,
      activation: 0,
      layer: 'output',
      lastPulse: 0,
    })
  }
  
  return nodes
}

