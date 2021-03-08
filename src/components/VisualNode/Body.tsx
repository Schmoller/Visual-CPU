import React, { FC, useRef } from 'react'
import { Node } from '../../lib/node'

import './style.css'

export interface BodyProps {
    x: number
    y: number
    width: number
    height: number

    allowEdit?: boolean
    onMouseDown?: (event: React.PointerEvent) => void
    onMouseUp?: (event: React.PointerEvent) => void
}

export const Body: FC<BodyProps> = ({ x, y, width, height, allowEdit, onMouseDown, onMouseUp }) => {
    return (
        <g transform='translate(0.5,0.5)'>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                stroke='#000000'
                fill='#ffffff'
                rx={2}
                ry={2}
                pointerEvents='all'
                cursor={allowEdit ? 'move' : undefined}
                onPointerDown={onMouseDown}
                onPointerUp={onMouseUp}
            />
        </g>
    )
}
