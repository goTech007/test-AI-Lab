'use client'

import { useState, useEffect } from 'react'
import { useNeuralMap } from '@/hooks/useNeuralMap'

interface NeuralMapProjectionProps {
  nodeCount?: number
  width?: number
  height?: number
  className?: string
  activityTrigger?: number // Trigger activation when this changes
}

export default function NeuralMapProjection({
  nodeCount = 12,
  width = 200,
  height = 150,
  className = '',
  activityTrigger,
}: NeuralMapProjectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { nodes, connections } = useNeuralMap(nodeCount, activityTrigger)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted || nodes.length === 0 || connections.length === 0) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] text-lab-text/20 font-mono">Initializing...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Connections */}
        {connections.map(conn => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          if (!fromNode || !toNode) return null

          const opacity = conn.active 
            ? 0.8
            : 0.1 + (fromNode.activation * 0.3)
          
          // Calculate pulse position along the line
          const pulseX = fromNode.x + (toNode.x - fromNode.x) * conn.pulseProgress
          const pulseY = fromNode.y + (toNode.y - fromNode.y) * conn.pulseProgress
          
          return (
            <g key={conn.id}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="rgba(0, 255, 136, 0.3)"
                strokeWidth={conn.active ? 1.5 : 0.5}
                opacity={opacity}
                className="transition-opacity duration-200"
              />
              {/* Pulse indicator */}
              {conn.active && (
                <circle
                  cx={pulseX}
                  cy={pulseY}
                  r={2}
                  fill="rgba(0, 255, 136, 1)"
                  className="animate-pulse"
                />
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const size = 3 + (node.activation * 2)
          const glowSize = size + (node.activation * 3)
          
          return (
            <g key={node.id}>
              {/* Glow effect when activated */}
              {node.activation > 0.3 && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={glowSize}
                  fill="rgba(0, 255, 136, 0.2)"
                  className="animate-pulse"
                />
              )}
              {/* Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={size}
                fill={
                  node.layer === 'input'
                    ? 'rgba(0, 255, 136, 0.8)'
                    : node.layer === 'hidden'
                    ? 'rgba(255, 170, 0, 0.8)'
                    : 'rgba(167, 139, 250, 0.8)'
                }
                stroke="rgba(0, 255, 136, 0.5)"
                strokeWidth={node.activation > 0.5 ? 1.5 : 0.5}
                opacity={0.5 + (node.activation * 0.5)}
                className="transition-all duration-200"
              />
            </g>
          )
        })}
      </svg>
      
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-[8px] text-lab-text/40 font-mono">
          Neural Map
        </span>
      </div>
    </div>
  )
}

