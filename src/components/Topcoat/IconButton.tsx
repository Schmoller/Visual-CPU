import React, { FC } from 'react'

export interface IconButtonProps {
    icon: React.ReactNode
    disabled?: boolean
    large?: boolean
    quiet?: boolean
    onClick?: (event: React.MouseEvent) => void
}
export const IconButton: FC<IconButtonProps> = ({ icon, disabled, large, quiet, onClick }) => {
    const classParts = ['topcoat-icon-button']

    if (large) {
        classParts.push('large')
    }
    if (quiet) {
        classParts.push('quiet')
    }

    return (
        <button className={classParts.join('--')} onClick={onClick} disabled={disabled}>
            {icon}
        </button>
    )
}
