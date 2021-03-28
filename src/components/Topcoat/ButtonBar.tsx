import React, { FC, useState } from 'react'

export const ButtonBarContext = React.createContext(false)

export interface ButtonBarProps {
    large?: boolean
}
export const ButtonBar: FC<ButtonBarProps> = ({ large, children }) => {
    return (
        <div className='topcoat-button-bar'>
            <ButtonBarContext.Provider value={true}>{children}</ButtonBarContext.Provider>
        </div>
    )
}
