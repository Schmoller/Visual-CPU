import React, { FC, useCallback } from 'react'
import './style.css'
import classNames from 'classnames'
import { Button } from '../../components/Topcoat'

export interface BitDisplayProps {
    bit: number

    linkedTo?: string
    hideLinked?: boolean
    variant?: 'normal' | 'edited' | 'highlight'

    linking?: boolean

    onClicked?: (bit: number, event: React.MouseEvent) => void
    onDelete?: (bit: number) => void
    onDragStart?: (bit: number, event: React.DragEvent) => void
}

export const BitDisplay: FC<BitDisplayProps> = ({
    bit,
    linkedTo,
    variant,
    linking,
    onClicked,
    onDelete,
    onDragStart,
    hideLinked,
}) => {
    const doDragStart = useCallback(
        (event: React.DragEvent) => {
            if (onDragStart) {
                onDragStart(bit, event)
            }
        },
        [bit, onDragStart],
    )
    const doDelete = useCallback(() => {
        if (onDelete) {
            onDelete(bit)
        }
    }, [onDelete])

    return (
        <div
            onClick={event => {
                if (onClicked) {
                    onClicked(bit, event)
                }
            }}
            className={classNames('bit-display', { linking: linking, editing: !linking && linkedTo }, variant)}
            draggable={!!onDragStart && !linking && !!linkedTo}
            onDragStart={doDragStart}
        >
            <div className='bit'>{linkedTo && <div></div>}</div>
            <div className='label'>Bit {bit}</div>

            {!hideLinked && <div className='link-to'>{linkedTo}</div>}
            {!hideLinked && !linking && linkedTo && (
                <div className='remove' onClick={doDelete}>
                    x
                </div>
            )}
        </div>
    )
}
