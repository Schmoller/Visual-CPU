import React, { FC } from 'react'
import { Node, PortSize } from '../../lib/node'
import { Port } from '../../lib/port'

export interface LinkProps {
    srcNode: Node
    srcPort: Port

    dstNode: Node
    dstPort: Port
}

export const Link: FC<LinkProps> = ({ srcNode, srcPort, dstNode, dstPort }) => {
    const [startX, startY] = srcNode.getPortLocation(srcPort)
    const [endX, endY] = dstNode.getPortLocation(dstPort)

    return (
        <g>
            <line
                x1={startX + PortSize / 2}
                y1={startY + PortSize / 2}
                x2={endX + PortSize / 2}
                y2={endY + PortSize / 2}
                stroke='#000000'
            />
            <circle
                cx={startX + (endX - startX) * 0.9 + PortSize / 2}
                cy={startY + (endY - startY) * 0.9 + PortSize / 2}
                r={4}
                fill='#000000'
            />
        </g>
    )
}
