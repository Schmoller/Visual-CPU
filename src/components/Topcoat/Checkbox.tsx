import React, { FC } from 'react'
export interface CheckboxProps {
    value: boolean
    name: React.ReactNode
    onChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({ value, name, disabled, onChecked }) => {
    return (
        <label className='topcoat-checkbox'>
            <input type='checkbox' checked={value} disabled={disabled} onChange={onChecked} readOnly={!onChecked} />
            <div className='topcoat-checkbox__checkmark'></div>
            {name}
        </label>
    )
}
