import React, { FC, useState } from 'react'

export interface ItemProps {
    title: string
    onClick?: () => void
    onDragStart?: (event: React.DragEvent) => void
}
export const Item: FC<ItemProps> = ({ title, children, onClick, onDragStart }) => {
    return (
        <div className='tray-item' onClick={onClick} draggable={!!onDragStart} onDragStart={onDragStart}>
            <div className='icon'>{children}</div>
            <div title={title} className='title'>
                {title}
            </div>
        </div>
    )
}
