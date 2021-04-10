import React, { FC, useState } from 'react'
import { Node } from '../../lib/node'
import { Port, Side } from '../../lib/ports'
import { Link } from './Link/Link'
import { PortLink } from '../../lib/link'

const PortSize = 15
const PortSpacing = 5

export interface PortProps {
    node: Node
    port: Port
    onLinkStart?: (node: Node, port: Port) => void
    onMouseUp?: (node: Node, port: Port, event: React.PointerEvent) => void
}

export const NodePort: FC<PortProps> = ({ node, port, onLinkStart, onMouseUp }) => {
    const [showDescription, setShowDescription] = useState(false)

    const onPointerDown = (event: React.PointerEvent) => {
        if (event.button == 0) {
            onLinkStart?.(node, port)
        }
    }

    const onPointerUp = (event: React.PointerEvent) => {
        onMouseUp?.(node, port, event)
    }

    const onMouseEnter = (event: React.MouseEvent) => {
        setShowDescription(true)
    }

    const onMouseLeave = (event: React.MouseEvent) => {
        setShowDescription(false)
    }

    const portLocation = node.getPortLocation(port)
    let width = PortSize
    let height = PortSize

    switch (port.side) {
        case Side.Left:
        case Side.Right:
            height = PortSize * port.size() + PortSpacing * (port.size() - 1)
            break

        case Side.Top:
        case Side.Bottom:
            width = PortSize * port.size() + PortSpacing * (port.size() - 1)
            break
    }

    return (
        <g>
            <rect
                stroke='#9daca9'
                fill='#e5e9e8'
                x={portLocation.x}
                y={portLocation.y}
                width={width}
                height={height}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            <text
                x={portLocation.x + width / 2}
                y={portLocation.y + height / 2}
                textAnchor='middle'
                dominantBaseline='central'
                pointerEvents='none'
            >
                {port.glyph()}
            </text>
            {/* {port.linkedFrom && (
                <Link dstNode={node} dstPort={port} srcNode={port.linkedFrom[0]} srcPort={port.linkedFrom[1]} />
            )} */}
            {showDescription && <PortDescription port={port} ox={portLocation.x} oy={portLocation.y} />}
        </g>
    )
}

interface PortDescriptionProps {
    port: Port
    ox: number
    oy: number
}

const PortDescription: FC<PortDescriptionProps> = ({ port, ox, oy }) => {
    let hAlign: string
    let vAlign: string
    switch (port.side) {
        case Side.Virtual:
        case Side.Top:
            hAlign = 'middle'
            ox += PortSize / 2
            oy -= PortSpacing
            vAlign = 'auto'
            break
        case Side.Bottom:
            hAlign = 'middle'
            ox += PortSize / 2
            oy += PortSize + PortSpacing
            vAlign = 'hanging'
            break
        case Side.Left:
            hAlign = 'end'
            ox -= PortSpacing
            oy += PortSize / 2
            vAlign = 'central'
            break
        case Side.Right:
            hAlign = 'start'
            ox += PortSize + PortSpacing
            oy += PortSize / 2
            vAlign = 'central'
            break
    }
    return (
        <g transform={`translate(${ox} ${oy})`}>
            <text textAnchor={hAlign} dominantBaseline={vAlign}>
                {port.name}
            </text>
        </g>
    )
}
