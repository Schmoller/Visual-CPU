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
        <line
            x1={startX + PortSize / 2}
            y1={startY + PortSize / 2}
            x2={endX + PortSize / 2}
            y2={endY + PortSize / 2}
            stroke='#000000'
        />
    )
}
