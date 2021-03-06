import React, { FC, useCallback, useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { WindowContext } from './Container'
import { ResizeDirection, WindowFrame } from './WindowFrame'

type ResizeOrMove = ResizeDirection | 'move'
const DefaultMinWidth = 100
const DefaultMinHeight = 100

export interface WindowProps {
    initialX: number
    initialY: number
    initialWidth: number | 'auto'
    initialHeight: number | 'auto'
    allowResize?: boolean

    title: React.ReactNode
    minWidth?: number
    minHeight?: number

    children?: React.ReactNode
}

// export const Window: FC<WindowProps> = ({
export function Window({
    initialX,
    initialY,
    initialWidth,
    initialHeight,
    allowResize,
    title,
    children,
    minWidth = DefaultMinWidth,
    minHeight = DefaultMinHeight,
}: WindowProps) {
    const windowContainer = useContext(WindowContext)

    const [x, setX] = useState(initialX)
    const [y, setY] = useState(initialY)
    const [width, setWidth] = useState<number | null>(initialWidth === 'auto' ? null : initialWidth)
    const [height, setHeight] = useState<number | null>(initialHeight === 'auto' ? null : initialHeight)

    const mouseOffset = useRef({ x: 0, y: 0 })
    const mouseAction = useRef<ResizeOrMove | null>(null)

    const onHeaderMouseDown = (event: React.MouseEvent) => {
        mouseOffset.current.x = event.pageX - x
        mouseOffset.current.y = event.pageY - y
        mouseAction.current = 'move'

        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove)
    }
    const onStartResize = (direction: ResizeDirection, event: React.MouseEvent<Element>) => {
        let actualWidth, actualHeight

        if (width === null || height === null) {
            const rect = event.currentTarget.getBoundingClientRect()
            if (width === null) {
                actualWidth = rect.width
                setWidth(actualWidth)
            } else {
                actualWidth = width
            }

            if (height === null) {
                actualHeight = rect.height
                setHeight(actualHeight)
            } else {
                actualHeight = height
            }
        } else {
            actualWidth = width
            actualHeight = height
        }

        switch (direction) {
            case 'top':
            case 'top-left':
            case 'top-right':
                mouseOffset.current.y = y + actualHeight
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
                mouseOffset.current.x = x + actualWidth
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
    if (windowContainer.current) {
        return ReactDOM.createPortal(
            <WindowFrame
                x={x}
                y={y}
                width={width ?? 'auto'}
                height={height ?? 'auto'}
                title={title}
                onHeaderMouseDown={onHeaderMouseDown}
                onStartResize={allowResize ? onStartResize : undefined}
            >
                {children}
            </WindowFrame>,
            windowContainer.current,
        )
    } else {
        return null
    }
}
