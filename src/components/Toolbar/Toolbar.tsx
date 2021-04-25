import React, { FC, useState } from 'react'
import { Button } from '../Topcoat'

export interface ToolbarProps {
    onNewClick?: () => void
    onBusesClick?: () => void
}
export const Toolbar: FC<ToolbarProps> = ({ onNewClick, onBusesClick }) => {
    return (
        <div className='toolbar'>
            <Button text='New' large onClick={onNewClick} />
            <Button text='Buses' large onClick={onBusesClick} />
        </div>
    )
}
