import React, { FC, useCallback } from 'react'
import { BitDisplay, BitDisplayVariant } from './BitDisplay'

export interface BitGroupDisplayProps {
    bit: number
    size: number
    linkedTo?: string

    variant?: BitDisplayVariant
    linking?: boolean
    hideLinked?: boolean

    onClicked?: (bit: number, event: React.MouseEvent) => void
    onDelete?: (bit: number) => void
    onMouseDown?: (bit: number, event: React.MouseEvent) => void
    onMouseUp?: (bit: number, event: React.MouseEvent) => void
    onMouseEnter?: (bit: number, event: React.MouseEvent) => void
    onMouseLeave?: (bit: number, event: React.MouseEvent) => void
}

export const BitGroupDisplay: FC<BitGroupDisplayProps> = ({
    bit,
    size,
    linkedTo,
    variant,
    linking,
    hideLinked,
    onClicked,
    onDelete,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
}) => {
    const doDelete = useCallback(() => {
        if (onDelete) {
            onDelete(bit)
        }
    }, [onDelete, bit])

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
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />,
        )
    }

    return (
        <div className='bit-group-display'>
            <div className='bus-link-window'>{bits}</div>
            <div className='group-divider'></div>
            {!hideLinked && <div className='link-to'>{linkedTo}</div>}
            {!hideLinked && !linking && linkedTo && (
                <div className='remove' onClick={doDelete}>
                    x
                </div>
            )}
        </div>
    )
}
