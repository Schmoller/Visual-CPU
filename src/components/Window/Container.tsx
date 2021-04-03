import React, { createContext, FC, useContext } from 'react'
import './style.css'

export const WindowContext = createContext<React.RefObject<HTMLDivElement>>({ current: null })

export interface WindowContainerProps {}

export const WindowContainer: FC<WindowContainerProps> = ({}) => {
    const containerElement = useContext(WindowContext)

    return <div ref={containerElement} className='window-container'></div>
}
