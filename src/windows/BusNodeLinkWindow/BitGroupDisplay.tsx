import React, { FC } from 'react'
import { BitDisplay } from './BitDisplay'

export interface BitGroupDisplayProps {
    bit: number
    size: number
    linkedTo?: string

    variant?: 'normal' | 'edited' | 'highlight'
    linking?: boolean
    onClicked?: (bit: number, event: React.MouseEvent) => void
}

export const BitGroupDisplay: FC<BitGroupDisplayProps> = ({ bit, size, linkedTo, variant, linking, onClicked }) => {
    const bits = []
    for (let b = bit; b < bit + size; ++b) {
        bits.push(
            <BitDisplay
                bit={b}
                key={b}
                hideLinked
                linkedTo={linkedTo}
                onClicked={onClicked}
                linking={linking}
                variant={variant}
            />,
        )
    }

    return (
        <div className='bit-group-display'>
            <div className='bus-link-window'>{bits}</div>
            <div className='group-divider'></div>
            <div className='link-to'>{linkedTo}</div>
        </div>
    )
}
