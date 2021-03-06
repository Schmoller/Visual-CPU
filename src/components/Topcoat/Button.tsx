import React, { FC, useContext } from 'react'
import { ButtonBarContext } from './ButtonBar'

export interface ButtonProps {
    text: React.ReactNode
    disabled?: boolean
    large?: boolean
    variant?: 'normal' | 'quiet' | 'cta'
    onClick?: (event: React.MouseEvent) => void
}
export const Button: FC<ButtonProps> = ({ text, disabled, large, variant = 'normal', onClick }) => {
    const { isButtonBar, isLarge } = useContext(ButtonBarContext)

    if (isButtonBar) {
        const classParts = ['topcoat-button-bar__button']
        if (isLarge) {
            classParts.push('large')
        }

        return (
            <div className='topcoat-button-bar__item'>
                <button className={classParts.join('--')} onClick={onClick}>
                    {text}
                </button>
            </div>
        )
    } else {
        const classParts = ['topcoat-button']

        if (large) {
            classParts.push('large')
        }

        switch (variant) {
            case 'quiet':
                classParts.push('quiet')
                break
            case 'cta':
                classParts.push('cta')
                break
        }

        return (
            <button className={classParts.join('--')} onClick={onClick} disabled={disabled}>
                {text}
            </button>
        )
    }
}
