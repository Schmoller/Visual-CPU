import React, { FC, useState } from 'react'
import { Point } from '../../../lib/common'

export interface HandleProps {
    position: Point
    splitting?: boolean
    hitSize?: number
    onMouseDown?: (event: React.MouseEvent) => {}
}

export const Handle: FC<HandleProps> = ({ position, splitting, hitSize = 8, onMouseDown }) => {
    const [hover, setHover] = useState(false)

    let fill
    if (!splitting) {
        fill = '#000000'
    } else {
        fill = 'gray'
    }
    if (hover) {
        fill = 'blue'
    }

    const onMouseEnter = (event: React.MouseEvent) => {
        setHover(true)
    }
    const onMouseLeave = (event: React.MouseEvent) => {
        setHover(false)
    }

    return (
        <>
            <circle
                cx={position.x}
                cy={position.y}
                r={hitSize}
                fill='white'
                visibility='hidden'
                pointerEvents='fill'
                onMouseEnter={onMouseEnter}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
            />
            <circle cx={position.x} cy={position.y} r={4} fill={fill} pointerEvents='none' />
        </>
    )
}
