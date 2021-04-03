import React, { FC, useRef } from 'react'
import { Node } from '../../lib/node'

import './style.css'

export interface BodyProps {
    x: number
    y: number
    width: number
    height: number

    display?: React.ReactNode

    allowEdit?: boolean
    onMouseDown?: (event: React.PointerEvent) => void
    onMouseUp?: (event: React.PointerEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
}

export const Body: FC<BodyProps> = ({
    x,
    y,
    width,
    height,
    allowEdit,
    onMouseDown,
    onMouseUp,
    display,
    onDoubleClick,
}) => {
    return (
        <g transform='translate(0.5,0.5)'>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                stroke='#9daca9'
                fill='#e5e9e8'
                rx={2}
                ry={2}
                pointerEvents='all'
                cursor={allowEdit ? 'move' : undefined}
                onPointerDown={onMouseDown}
                onPointerUp={onMouseUp}
                onDoubleClick={onDoubleClick}
            />
            <g transform={`translate(${x}, ${y})`} pointerEvents='none'>
                {display}
            </g>
        </g>
    )
}
