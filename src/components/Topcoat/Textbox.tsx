import React, { FC, useRef, useState } from 'react'
export interface TextboxProps {
    value: string
    onValueChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    type?: 'text'
    large?: boolean
    disabled?: boolean
    autoFocus?: boolean
    onBlur?: (event: React.FocusEvent) => void
    onFocus?: (event: React.FocusEvent) => void
    onKeyDown?: (event: React.KeyboardEvent) => void
    onKeyUp?: (event: React.KeyboardEvent) => void
    onKeyPress?: (event: React.KeyboardEvent) => void
    onSubmit?: (event: React.FormEvent) => void
}
export const Textbox: FC<TextboxProps> = ({
    value,
    onValueChange,
    placeholder,
    type = 'text',
    large = false,
    disabled = false,
    autoFocus,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onSubmit,
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
            autoFocus={autoFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onKeyUp={onKeyUp}
            onKeyPress={onKeyPress}
            onSubmit={onSubmit}
        />
    )
}
