import React, { FC, useMemo, useState } from 'react'
interface ButtonBarContext {
    isButtonBar: boolean
    isLarge?: boolean
}

export const ButtonBarContext = React.createContext<ButtonBarContext>({ isButtonBar: false, isLarge: false })

export interface ButtonBarProps {
    large?: boolean
}
export const ButtonBar: FC<ButtonBarProps> = ({ large, children }) => {
    const context = useMemo<ButtonBarContext>(
        () => ({
            isButtonBar: true,
            isLarge: large,
        }),
        [large],
    )

    return (
        <div className='topcoat-button-bar'>
            <ButtonBarContext.Provider value={context}>{children}</ButtonBarContext.Provider>
        </div>
    )
}
