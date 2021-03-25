import React, { FC, useState } from 'react'
import { Node, PortSize } from '../../../lib/node'
import { Port } from '../../../lib/port'
import { Point } from '../../../lib/common'
import Path from 'svg-path-generator'
import { PortLink } from '../../../lib/link'
import { Handle } from './Handle'

const DefaultHitSensitivity = 14
export interface LinkProps {
    link: PortLink
    selected?: boolean

    hitSensitivity?: number

    onHoverEnter?: (event: React.MouseEvent, link: PortLink) => void
    onHoverLeave?: (event: React.MouseEvent, link: PortLink) => void
    onMouseDown?: (event: React.MouseEvent, link: PortLink) => void
    onMouseUp?: (event: React.MouseEvent, link: PortLink) => void
}

export const Link: FC<LinkProps> = ({
    link,
    selected,
    onHoverEnter,
    onHoverLeave,
    onMouseDown,
    onMouseUp,
    hitSensitivity = DefaultHitSensitivity,
}) => {
    const start = link.start
    const end = link.end!

    let points: Point[]
    if (link.middlePoints) {
        points = [...link.middlePoints, end]
    } else {
        points = [end]
    }
    const path = Path().moveTo(start.x, start.y)
    for (const point of points) {
        path.lineTo(point.x, point.y)
    }
    const handles: React.ReactNode[] = []

    if (selected) {
        let previous = start
        for (const point of points) {
            const midPoint = { x: (point.x + previous.x) / 2, y: (point.y + previous.y) / 2 }
            const quarterPoint = { x: (midPoint.x + previous.x) / 2, y: (midPoint.y + previous.y) / 2 }
            const threeQuarterPoint = { x: (point.x + midPoint.x) / 2, y: (point.y + midPoint.y) / 2 }
            handles.push(<Handle position={midPoint} />)
            handles.push(<Handle position={quarterPoint} splitting />)
            handles.push(<Handle position={threeQuarterPoint} splitting />)
            previous = point
        }
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
                onMouseEnter={event => onHoverEnter?.(event, link)}
                onMouseLeave={event => onHoverLeave?.(event, link)}
                onMouseDown={event => onMouseDown?.(event, link)}
                onMouseUp={event => onMouseUp?.(event, link)}
            />
            <path d={path.end()} stroke='#000000' pointerEvents='none' fill='none' />
            {/* <circle
                cx={startX + (endX - startX) * 0.9 + PortSize / 2}
                cy={startY + (endY - startY) * 0.9 + PortSize / 2}
                r={4}
                fill='#000000'
            /> */}
            {handles}
        </g>
    )
}
