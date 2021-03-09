import React, { FC, useState } from 'react'
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

    const [x, y] = node.getPortLocation(port)

    let glyph: string
    switch (port.type) {
        case 'input':
            glyph = 'I'
            break
        case 'output':
            glyph = 'O'
            break
        case 'bidi':
            glyph = 'X'
            break
        default:
            glyph = '?'
    }

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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            <text
                x={x + PortSize / 2}
                y={y + PortSize / 2}
                textAnchor='middle'
                dominantBaseline='central'
                pointerEvents='none'
            >
                {glyph}
            </text>
            {port.link && <Link srcNode={node} srcPort={port} dstNode={port.link[0]} dstPort={port.link[1]} />}
            {showDescription && <PortDescription port={port} ox={x} oy={y} />}
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
        case 'top':
            hAlign = 'middle'
            ox += PortSize / 2
            oy -= PortSpacing
            vAlign = 'auto'
            break
        case 'bottom':
            hAlign = 'middle'
            ox += PortSize / 2
            oy += PortSize + PortSpacing
            vAlign = 'hanging'
            break
        case 'left':
            hAlign = 'end'
            ox -= PortSpacing
            oy += PortSize / 2
            vAlign = 'central'
            break
        case 'right':
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
