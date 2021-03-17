import React, { FC, useState } from 'react'
import { Node } from '../../lib/node'
import { Port, Side } from '../../lib/port'
import { Link } from './Link'
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

    let linkVisual: React.ReactNode
    if (port.linkedFrom) {
        const link = new PortLink(port.linkedFrom, [node, port])
        link.recomputePath([node, port.linkedFrom[0]])

        linkVisual = (
            <Link
                dstNode={node}
                dstPort={port}
                srcNode={port.linkedFrom[0]}
                srcPort={port.linkedFrom[1]}
                links={link.middlePoints}
            />
        )
    }

    return (
        <g>
            <rect
                stroke='#000000'
                fill='#ffffff'
                x={portLocation.x}
                y={portLocation.y}
                width={PortSize}
                height={PortSize}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            <text
                x={portLocation.x + PortSize / 2}
                y={portLocation.y + PortSize / 2}
                textAnchor='middle'
                dominantBaseline='central'
                pointerEvents='none'
            >
                {port.glyph()}
            </text>
            {linkVisual}
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
