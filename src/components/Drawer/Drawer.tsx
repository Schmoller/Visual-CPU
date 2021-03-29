import React, { FC, useRef, useState } from 'react'

export const Drawer: FC = ({ children }) => {
    const [width, setWidth] = useState(300)
    const drawer = useRef<HTMLDivElement>(null)

    const onResize = (event: MouseEvent) => {
        const clientRect = drawer.current!.getBoundingClientRect()
        const width = event.clientX - clientRect.x
        setWidth(width)
    }
    const onResizeFinish = () => {
        document.removeEventListener('mousemove', onResize)
        document.removeEventListener('mouseup', onResizeFinish)
    }

    const onResizeStart = (event: React.MouseEvent) => {
        document.addEventListener('mousemove', onResize)
        document.addEventListener('mouseup', onResizeFinish)
    }

    return (
        <div className='drawer' ref={drawer} style={{ width }}>
            <div className='drawer-body'>{children}</div>
            <div className='drawer-handle' onMouseDown={onResizeStart}></div>
        </div>
    )
}
