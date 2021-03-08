import React, { FC } from 'react'
import { Node } from '../../lib/node'
import { Port } from '../../lib/port'

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

    return (
        <g>
            <rect
                stroke='#000000'
                fill='#ffffff'
                x={node.x + port.relX}
                y={node.y + port.relY}
                width={15}
                height={15}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            />
            {port.linked && (
                <line
                    x1={node.x + port.relX + 7.5}
                    y1={node.y + port.relY + 7.5}
                    x2={port.linked[0].x + port.linked[1].relX + 7.5}
                    y2={port.linked[0].y + port.linked[1].relY + 7.5}
                    stroke='#000000'
                />
            )}
        </g>
    )
}
