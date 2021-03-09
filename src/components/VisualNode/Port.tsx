import React, { FC } from 'react'
import { Node } from '../../lib/node'
import { Port } from '../../lib/port'
import { Link } from './Link'

const PortSize = 15
const PortSpacing = 5

export interface PortProps {
    node: Node
    port: Port
    onLinkStart?: (node: Node, port: Port) => void
    onMouseUp?: (node: Node, port: Port, event: React.PointerEvent) => void
}

export const NodePort: FC<PortProps> = ({ node, port, onLinkStart, onMouseUp }) => {
    const onPointerDown = (event: React.PointerEvent) => {
        if (event.button == 0) {
            onLinkStart?.(node, port)
        }
    }

    const onPointerUp = (event: React.PointerEvent) => {
        onMouseUp?.(node, port, event)
    }

    const [x, y] = node.getPortLocation(port)

    return (
        <g>
            <rect
                stroke='#000000'
                fill='#ffffff'
                x={x}
                y={y}
                width={PortSize}
                height={PortSize}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            />
            {port.link && <Link srcNode={node} srcPort={port} dstNode={port.link[0]} dstPort={port.link[1]} />}
        </g>
    )
}
