import React, { FC } from 'react'
import { useUpdateAfterClock } from '../../clock'
import { BusPort } from '../../ports'
import type { BusDisplayNode, BusOutputNode } from './bus'

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
export interface BusDisplayDisplayProps {
    node: BusDisplayNode
}

export const BusDisplayDisplay: FC<BusDisplayDisplayProps> = ({ node }) => {
    useUpdateAfterClock()
    const port = node.getPort('Bus') as BusPort

    const value = port.getValue().toString(16)
    console.log(value)

    return (
        <text textAnchor='middle' dominantBaseline='middle' x={node.width / 2} y={node.height / 2}>
            x{value}
        </text>
    )
}
