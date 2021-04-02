import React, { FC, useCallback, useRef, useState } from 'react'
import { ResizeDirection, WindowFrame } from './WindowFrame'

type ResizeOrMove = ResizeDirection | 'move'
const DefaultMinWidth = 100
const DefaultMinHeight = 100

export interface WindowProps {
    initialX: number
    initialY: number
    initialWidth: number
    initialHeight: number

    title: React.ReactNode
    minWidth?: number
    minHeight?: number
}

export const Window: FC<WindowProps> = ({
    initialX,
    initialY,
    initialWidth,
    initialHeight,
    title,
    children,
    minWidth = DefaultMinWidth,
    minHeight = DefaultMinHeight,
}) => {
    const [x, setX] = useState(initialX)
    const [y, setY] = useState(initialY)
    const [width, setWidth] = useState(initialWidth)
    const [height, setHeight] = useState(initialHeight)

    const mouseOffset = useRef({ x: 0, y: 0 })
    const mouseAction = useRef<ResizeOrMove | null>(null)

    const onHeaderMouseDown = (event: React.MouseEvent) => {
        mouseOffset.current.x = event.pageX - x
        mouseOffset.current.y = event.pageY - y
        mouseAction.current = 'move'

        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove)
    }
    const onStartResize = (direction: ResizeDirection, event: React.MouseEvent) => {
        switch (direction) {
            case 'top':
            case 'top-left':
            case 'top-right':
                mouseOffset.current.y = y + height
                break
            case 'bottom':
            case 'bottom-left':
            case 'bottom-right':
                mouseOffset.current.y = y
                break
        }
        switch (direction) {
            case 'left':
            case 'top-left':
            case 'bottom-left':
                mouseOffset.current.x = x + width
                break
            case 'right':
            case 'top-right':
            case 'bottom-right':
                mouseOffset.current.x = x
                break
        }

        mouseAction.current = direction
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove)
    }

    const onMouseUp = useCallback((event: MouseEvent) => {
        if (mouseAction.current === 'move') {
            setX(event.pageX - mouseOffset.current.x)
            setY(event.pageY - mouseOffset.current.y)
        } else {
            if (
                mouseAction.current === 'left' ||
                mouseAction.current === 'top-left' ||
                mouseAction.current === 'bottom-left'
            ) {
                const left = Math.min(event.pageX, mouseOffset.current.x - minWidth)

                setX(left)
                setWidth(mouseOffset.current.x - left)
            }
            if (
                mouseAction.current === 'right' ||
                mouseAction.current === 'top-right' ||
                mouseAction.current === 'bottom-right'
            ) {
                const right = Math.max(event.pageX, mouseOffset.current.x + minWidth)
                setWidth(right - mouseOffset.current.x)
            }
            if (
                mouseAction.current === 'top' ||
                mouseAction.current === 'top-left' ||
                mouseAction.current === 'top-right'
            ) {
                const top = Math.min(event.pageY, mouseOffset.current.y - minHeight)
                setY(top)
                setHeight(mouseOffset.current.y - top)
            }
            if (
                mouseAction.current === 'bottom' ||
                mouseAction.current === 'bottom-left' ||
                mouseAction.current === 'bottom-right'
            ) {
                const bottom = Math.max(event.pageY, mouseOffset.current.y + minHeight)
                setHeight(bottom - mouseOffset.current.y)
            }
        }
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
    }, [])
    const onMouseMove = useCallback((event: MouseEvent) => {
        if (mouseAction.current === 'move') {
            setX(event.pageX - mouseOffset.current.x)
            setY(event.pageY - mouseOffset.current.y)
        } else {
            if (
                mouseAction.current === 'left' ||
                mouseAction.current === 'top-left' ||
                mouseAction.current === 'bottom-left'
            ) {
                const left = Math.min(event.pageX, mouseOffset.current.x - minWidth)

                setX(left)
                setWidth(mouseOffset.current.x - left)
            }
            if (
                mouseAction.current === 'right' ||
                mouseAction.current === 'top-right' ||
                mouseAction.current === 'bottom-right'
            ) {
                const right = Math.max(event.pageX, mouseOffset.current.x + minWidth)
                setWidth(right - mouseOffset.current.x)
            }
            if (
                mouseAction.current === 'top' ||
                mouseAction.current === 'top-left' ||
                mouseAction.current === 'top-right'
            ) {
                const top = Math.min(event.pageY, mouseOffset.current.y - minHeight)
                setY(top)
                setHeight(mouseOffset.current.y - top)
            }
            if (
                mouseAction.current === 'bottom' ||
                mouseAction.current === 'bottom-left' ||
                mouseAction.current === 'bottom-right'
            ) {
                const bottom = Math.max(event.pageY, mouseOffset.current.y + minHeight)
                setHeight(bottom - mouseOffset.current.y)
            }
        }
    }, [])

    return (
        <WindowFrame
            x={x}
            y={y}
            width={width}
            height={height}
            title={title}
            onHeaderMouseDown={onHeaderMouseDown}
            onStartResize={onStartResize}
        >
            {children}
        </WindowFrame>
    )
}
