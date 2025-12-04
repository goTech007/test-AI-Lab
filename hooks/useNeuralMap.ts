'use client'

import { useState, useEffect, useRef } from 'react'
import type { NeuralNode, NeuralConnection } from '@/types/neuralMap'
import { generateNeuralNodes } from '@/lib/neuralMap/generateNeuralNodes'
import { generateNeuralConnections } from '@/lib/neuralMap/generateNeuralConnections'
import { propagateActivation } from '@/lib/neuralMap/propagateActivation'

export const useNeuralMap = (nodeCount: number = 12, activityTrigger?: number) => {
  const [nodes, setNodes] = useState<NeuralNode[]>([])
  const [connections, setConnections] = useState<NeuralConnection[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const initializedRef = useRef(false)
  const lastActivityRef = useRef(0)
  const nodesRef = useRef<NeuralNode[]>([])
  const connectionsRef = useRef<NeuralConnection[]>([])

  // Ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize nodes and connections (client-side only)
  useEffect(() => {
    if (!isMounted || initializedRef.current) return
    
    const initialNodes = generateNeuralNodes(nodeCount)
    const initialConnections = generateNeuralConnections(initialNodes)
    setNodes(initialNodes)
    setConnections(initialConnections)
    nodesRef.current = initialNodes
    connectionsRef.current = initialConnections
    initializedRef.current = true
  }, [isMounted, nodeCount])

  // Update refs when state changes
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    connectionsRef.current = connections
  }, [connections])

  // Trigger activation when activity changes
  useEffect(() => {
    if (nodes.length === 0 || connections.length === 0) return
    if (activityTrigger !== undefined && activityTrigger !== lastActivityRef.current) {
      lastActivityRef.current = activityTrigger
      // Trigger random input node
      const inputNodes = nodesRef.current.filter(n => n.layer === 'input')
      if (inputNodes.length > 0) {
        const randomInput = inputNodes[Math.floor(Math.random() * inputNodes.length)]
        const result = propagateActivation(nodesRef.current, connectionsRef.current, randomInput.id)
        setNodes(result.nodes)
        setConnections(result.connections)
      }
    }
  }, [activityTrigger, nodes.length, connections.length])

  // Propagate activation periodically
  useEffect(() => {
    if (nodes.length === 0 || connections.length === 0) return

    const interval = setInterval(() => {
      const result = propagateActivation(nodesRef.current, connectionsRef.current)
      setNodes(result.nodes)
      setConnections(result.connections)
    }, 200) // Update every 200ms for smooth animation

    return () => clearInterval(interval)
  }, [nodes.length, connections.length])

  // Trigger activation from external events
  const triggerActivation = (nodeId?: string) => {
    if (nodes.length === 0 || connections.length === 0) return
    
    const result = propagateActivation(nodesRef.current, connectionsRef.current, nodeId)
    setNodes(result.nodes)
    setConnections(result.connections)
  }

  return {
    nodes,
    connections,
    triggerActivation,
  }
}

