import React, { FC, useState } from 'react'
import { Button } from '../Topcoat'

export interface ToolbarProps {}
export const Toolbar: FC<ToolbarProps> = () => {
    return (
        <div className='toolbar'>
            <Button text='New' large />
        </div>
    )
}
