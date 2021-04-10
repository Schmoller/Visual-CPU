import React, { FC } from 'react'
import type { BusOutputNode } from './bus'

export interface BusOutputDisplayProps {
    node: BusOutputNode
}

export const BusOutputDisplay: FC<BusOutputDisplayProps> = ({ node }) => {
    const value = node.value.toString(16)
    return (
        <text textAnchor='middle' dominantBaseline='middle' x={node.width / 2} y={node.height / 2}>
            x{value}
        </text>
    )
}
