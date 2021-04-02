import React, { FC, useCallback, useRef, useState } from 'react'
import './style.css'

export type ResizeDirection =
    | 'top-left'
    | 'top-right'
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'

export interface WindowFrameProps {
    x: number
    y: number
    width: number
    height: number
    title: React.ReactNode

    onStartResize?: (direction: ResizeDirection, event: React.MouseEvent) => void
    onHeaderMouseDown?: (event: React.MouseEvent) => void
}

export const WindowFrame: FC<WindowFrameProps> = ({
    x,
    y,
    width,
    height,
    title,
    onHeaderMouseDown,
    children,
    onStartResize,
}) => {
    const [cursor, setCursor] = useState<React.CSSProperties['cursor']>('inherit')
    const style: React.CSSProperties = {
        left: x,
        top: y,
        width,
        height,
        cursor,
    }
    const windowFrame = useRef<HTMLDivElement>(null)

    const onFrameMouseMove = useCallback(
        (event: React.MouseEvent) => {
            if (!windowFrame.current || !onStartResize) {
                return
            }
            const bounds = windowFrame.current.getBoundingClientRect()
            const relLeft = event.clientX - bounds.x
            const relRight = bounds.x + bounds.width - event.clientX
            const relTop = event.clientY - bounds.y
            const relBottom = bounds.y + bounds.height - event.clientY

            const fontSize = parseFloat(
                window.getComputedStyle(windowFrame.current, null).getPropertyValue('font-size'),
            )
            const pad = fontSize * 0.25

            const isLeft = relLeft <= pad
            const isRight = relRight <= pad
            const isTop = relTop <= pad
            const isBottom = relBottom <= pad

            if (isLeft) {
                if (isTop) {
                    setCursor('nwse-resize')
                } else if (isBottom) {
                    setCursor('nesw-resize')
                } else {
                    setCursor('ew-resize')
                }
            } else if (isRight) {
                if (isTop) {
                    setCursor('nesw-resize')
                } else if (isBottom) {
                    setCursor('nwse-resize')
                } else {
                    setCursor('ew-resize')
                }
            } else if (isTop) {
                setCursor('ns-resize')
            } else if (isBottom) {
                setCursor('ns-resize')
            } else {
                setCursor('inherit')
            }
        },
        [onStartResize, windowFrame.current],
    )
    const onFrameMouseDown = useCallback(
        (event: React.MouseEvent) => {
            if (!windowFrame.current || !onStartResize) {
                return
            }
            const bounds = windowFrame.current.getBoundingClientRect()
            const relLeft = event.clientX - bounds.x
            const relRight = bounds.x + bounds.width - event.clientX
            const relTop = event.clientY - bounds.y
            const relBottom = bounds.y + bounds.height - event.clientY

            const fontSize = parseFloat(
                window.getComputedStyle(windowFrame.current, null).getPropertyValue('font-size'),
            )
            const pad = fontSize * 0.25

            const isLeft = relLeft <= pad
            const isRight = relRight <= pad
            const isTop = relTop <= pad
            const isBottom = relBottom <= pad

            if (isLeft) {
                if (isTop) {
                    onStartResize('top-left', event)
                } else if (isBottom) {
                    onStartResize('bottom-left', event)
                } else {
                    onStartResize('left', event)
                }
            } else if (isRight) {
                if (isTop) {
                    onStartResize('top-right', event)
                } else if (isBottom) {
                    onStartResize('bottom-right', event)
                } else {
                    onStartResize('right', event)
                }
            } else if (isTop) {
                onStartResize('top', event)
            } else if (isBottom) {
                onStartResize('bottom', event)
            }
        },
        [onStartResize, windowFrame.current],
    )

    return (
        <div
            className='window-frame'
            style={style}
            onMouseMove={onFrameMouseMove}
            ref={windowFrame}
            onMouseDown={onFrameMouseDown}
        >
            <div className='window-header' onMouseDown={onHeaderMouseDown}>
                {title}
            </div>
            <div className='window-content'>{children}</div>
        </div>
    )
}
