import React, { FC, useState } from 'react'

export interface ItemProps {
    title: string
    onClick?: () => void
}
export const Item: FC<ItemProps> = ({ title, children, onClick }) => {
    return (
        <div className='tray-item' onClick={onClick}>
            <div>{children}</div>
            <div title={title} className='title'>
                {title}
            </div>
        </div>
    )
}
