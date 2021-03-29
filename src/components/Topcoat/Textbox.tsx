import React, { FC, useRef, useState } from 'react'
export interface TextboxProps {
    value: string
    onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    type?: 'text'
    large?: boolean
    disabled?: boolean
}
export const Textbox: FC<TextboxProps> = ({
    value,
    onValueChange,
    placeholder,
    type = 'text',
    large = false,
    disabled = false,
}) => {
    let textboxClass: string
    if (large) {
        textboxClass = 'topcoat-text-input--large'
    } else {
        textboxClass = 'topcoat-text-input'
    }
    return (
        <input
            className={textboxClass}
            type={type}
            value={value}
            onChange={onValueChange}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}
