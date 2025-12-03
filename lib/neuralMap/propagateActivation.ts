import type { NeuralNode, NeuralConnection } from '@/types/neuralMap'

export const propagateActivation = (
  nodes: NeuralNode[],
  connections: NeuralConnection[],
  triggerNodeId?: string
): { nodes: NeuralNode[], connections: NeuralConnection[] } => {
  const now = Date.now()
  const updatedNodes = [...nodes]
  const updatedConnections = [...connections]
  
  // If trigger node specified, activate it
  if (triggerNodeId) {
    const triggerNode = updatedNodes.find(n => n.id === triggerNodeId)
    if (triggerNode) {
      triggerNode.activation = 1.0
      triggerNode.lastPulse = now
    }
  } else {
    // Random activation of input nodes
    const inputNodes = updatedNodes.filter(n => n.layer === 'input')
    if (inputNodes.length > 0 && Math.random() < 0.3) {
      const randomInput = inputNodes[Math.floor(Math.random() * inputNodes.length)]
      randomInput.activation = 0.8 + Math.random() * 0.2
      randomInput.lastPulse = now
    }
  }
  
  // Propagate activation through connections
  updatedConnections.forEach(conn => {
    const fromNode = updatedNodes.find(n => n.id === conn.from)
    const toNode = updatedNodes.find(n => n.id === conn.to)
    
    if (fromNode && toNode && fromNode.activation > 0.3) {
      // Calculate activation transfer
      const transfer = fromNode.activation * conn.weight
      toNode.activation = Math.min(1, toNode.activation + transfer * 0.3)
      
      // Activate connection for visualization
      if (transfer > 0.2) {
        conn.active = true
        conn.pulseProgress = 0
      }
    }
    
    // Decay activation
    if (fromNode) {
      fromNode.activation = Math.max(0, fromNode.activation * 0.95)
    }
    if (toNode) {
      toNode.activation = Math.max(0, toNode.activation * 0.92)
    }
    
    // Update pulse progress
    if (conn.active) {
      conn.pulseProgress = Math.min(1, conn.pulseProgress + 0.1)
      if (conn.pulseProgress >= 1) {
        conn.active = false
        conn.pulseProgress = 0
      }
    }
  })
  
  return { nodes: updatedNodes, connections: updatedConnections }
}

