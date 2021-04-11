import React, { FC } from 'react'
import './style.css'
import classNames from 'classnames'

export interface BitDisplayProps {
    bit: number

    linkedTo?: string
    hideLinked?: boolean
    variant?: 'normal' | 'edited' | 'highlight'

    linking?: boolean

    onClicked?: (bit: number, event: React.MouseEvent) => void
}

export const BitDisplay: FC<BitDisplayProps> = ({ bit, linkedTo, variant, linking, onClicked, hideLinked }) => {
    return (
        <div
            onClick={event => {
                if (onClicked) {
                    onClicked(bit, event)
                }
            }}
            className={classNames('bit-display', { linking: linking }, variant)}
        >
            <div className='bit'>{linkedTo && <div></div>}</div>
            <div className='label'>Bit {bit}</div>

            {!hideLinked && <div className='link-to'>{linkedTo}</div>}
        </div>
    )
}
