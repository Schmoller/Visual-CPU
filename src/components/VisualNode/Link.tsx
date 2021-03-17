import React, { FC, useState } from 'react'
import { Node, PortSize } from '../../lib/node'
import { Port } from '../../lib/port'
import { Point } from '../../lib/common'
import Path from 'svg-path-generator'

const DefaultHitSensitivity = 14
export interface LinkProps {
    srcNode: Node
    srcPort: Port

    dstNode: Node
    dstPort: Port

    links?: Point[]

    hitSensitivity?: number

    onHoverEnter?: (event: React.MouseEvent) => void
    onHoverLeave?: (event: React.MouseEvent) => void
    onMouseDown?: (event: React.MouseEvent) => void
    onMouseUp?: (event: React.MouseEvent) => void
}

export const Link: FC<LinkProps> = ({
    srcNode,
    srcPort,
    dstNode,
    dstPort,
    links,
    onHoverEnter,
    onHoverLeave,
    onMouseDown,
    onMouseUp,
    hitSensitivity = DefaultHitSensitivity,
}) => {
    const start = srcNode.getPortLocation(srcPort, true)
    const end = dstNode.getPortLocation(dstPort, true)

    let points: Point[]
    if (links) {
        points = [...links, end]
    } else {
        points = [end]
    }

    const path = Path().moveTo(start.x, start.y)
    for (const point of points) {
        path.lineTo(point.x, point.y)
    }

    return (
        <g>
            {/* Path just for hit testing, not visible */}
            <path
                d={path.end()}
                stroke='white'
                visibility='hidden'
                pointerEvents='stroke'
                strokeWidth={hitSensitivity}
                onMouseEnter={onHoverEnter}
                onMouseLeave={onHoverLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            />
            <path d={path.end()} stroke='#000000' pointerEvents='none' fill='none' />
            {/* <circle
                cx={startX + (endX - startX) * 0.9 + PortSize / 2}
                cy={startY + (endY - startY) * 0.9 + PortSize / 2}
                r={4}
                fill='#000000'
            /> */}
        </g>
    )
}
