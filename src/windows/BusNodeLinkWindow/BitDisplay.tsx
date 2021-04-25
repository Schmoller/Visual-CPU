import React, { FC, useCallback, useMemo } from 'react'
import './style.css'
import classNames from 'classnames'

export type BitDisplayVariant = 'normal' | 'edited' | 'highlight'
export interface BitDisplayProps {
    bit: number

    linkedTo?: string
    hideLinked?: boolean
    variant?: BitDisplayVariant

    linking?: boolean

    onClicked?: (bit: number, event: React.MouseEvent) => void
    onDelete?: (bit: number) => void
    onMouseDown?: (bit: number, event: React.MouseEvent) => void
    onMouseUp?: (bit: number, event: React.MouseEvent) => void
    onMouseEnter?: (bit: number, event: React.MouseEvent) => void
    onMouseLeave?: (bit: number, event: React.MouseEvent) => void
}

export const BitDisplay: FC<BitDisplayProps> = ({
    bit,
    linkedTo,
    variant,
    linking,
    onClicked,
    onDelete,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
    hideLinked,
}) => {
    const doMouseDown = useMemo(() => {
        if (onMouseDown) {
            return (event: React.MouseEvent) => {
                onMouseDown(bit, event)
            }
        }
    }, [bit, onMouseDown])
    const doMouseUp = useMemo(() => {
        if (onMouseUp) {
            return (event: React.MouseEvent) => {
                onMouseUp(bit, event)
            }
        }
    }, [bit, onMouseUp])
    const doMouseEnter = useMemo(() => {
        if (onMouseEnter) {
            return (event: React.MouseEvent) => {
                onMouseEnter(bit, event)
            }
        }
    }, [bit, onMouseEnter])
    const doMouseLeave = useMemo(() => {
        if (onMouseLeave) {
            return (event: React.MouseEvent) => {
                onMouseLeave(bit, event)
            }
        }
    }, [bit, onMouseLeave])

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
            onMouseDown={doMouseDown}
            onMouseUp={doMouseUp}
            onMouseEnter={doMouseEnter}
            onMouseLeave={doMouseLeave}
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
