import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { VisualNode } from '../components/VisualNode'
import { PortLink } from '../lib/link'
import { Node } from '../lib/node'
import { Port } from '../lib/port'
import { TestNode } from '../lib/nodes/test'

import './style.css'
import { Link } from '../components/VisualNode/Link/Link'
import { Point } from '../lib/common'

let currentMouseX: number
let currentMouseY: number

type Selectable = PortLink | Node

export interface CanvasProps {
    gridSnap?: number
}

export const Canvas: FC<CanvasProps> = ({ gridSnap = 30 }) => {
    const canvasDiv = useRef<HTMLDivElement>(null)
    const [links, setLinks] = useState<PortLink[]>([])
    const [selected, setSelected] = useState<Selectable | null>(null)
    const [nodes, setNodes] = useState<Node[]>([])
    const [draggedNode, setDraggedNode] = useState<Node | null>(null)
    const [draggedPort, setDraggedPort] = useState<[Port, Node] | null>(null)
    const dragOffset = useRef({ x: 0, y: 0 })
    const panOffset = useRef({ x: 0, y: 0 })
    const cursorPanOffset = useRef({ x: 0, y: 0 })
    const [editMode, setEditMode] = useState(true)
    const [panMode, setPanMode] = useState(false)
    const [, setForcedUpdate] = useState<number>(0)
    const [zoom, setZoom] = useState(1)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)

    let canvasRect: DOMRect
    if (canvasDiv.current) {
        canvasRect = canvasDiv.current.getBoundingClientRect()
    } else {
        canvasRect = new DOMRect()
    }

    const fullLinks = useMemo(() => links.filter(item => !!item.dst), [links])
    const onLinkMouseDown = (event: React.MouseEvent, link: PortLink) => {
        setSelected(link)
    }

    const doCanvasMouseDown = (event: React.MouseEvent) => {
        if (event.button === 1) {
            setPanMode(true)
            panOffset.current.x = panX
            panOffset.current.y = panY
            cursorPanOffset.current.x = event.clientX / zoom
            cursorPanOffset.current.y = event.clientY / zoom
        }
    }

    const doCanvasMouseUp = (event: React.MouseEvent) => {
        if (event.button === 0) {
            if (draggedNode) {
                setDraggedNode(null)
            }
            if (draggedPort) {
                setDraggedPort(null)
            }
        } else if (event.button === 1) {
            setPanMode(false)
        }
    }

    const doCanvasMouseDrag = (event: React.MouseEvent) => {
        if (draggedNode) {
            draggedNode.x = event.clientX / zoom + dragOffset.current.x
            draggedNode.y = event.clientY / zoom + dragOffset.current.y

            draggedNode.x = Math.round(draggedNode.x / gridSnap) * gridSnap
            draggedNode.y = Math.round(draggedNode.y / gridSnap) * gridSnap

            draggedNode.updateLinks()

            setForcedUpdate(num => num + 1)
        } else if (panMode) {
            setPanX(event.clientX / zoom - cursorPanOffset.current.x + panOffset.current.x)
            setPanY(event.clientY / zoom - cursorPanOffset.current.y + panOffset.current.y)
        }

        currentMouseX = event.clientX
        currentMouseY = event.clientY
    }

    const doKeyUp = (event: React.KeyboardEvent) => {}

    useEffect(() => {
        const onGlobalKeyUp = (event: KeyboardEvent) => {
            if (event.key == 'a') {
                let x = currentMouseX / zoom - panX
                let y = currentMouseY / zoom - panY

                x = Math.round(x / gridSnap) * gridSnap
                y = Math.round(y / gridSnap) * gridSnap

                const node = new TestNode(x, y)
                setNodes([...nodes, node])
            }
        }

        document.addEventListener('keyup', onGlobalKeyUp)

        return () => {
            document.removeEventListener('keyup', onGlobalKeyUp)
        }
    })

    const onNodeMouseDown = (node: Node, event: React.PointerEvent) => {
        if (editMode && event.button == 0) {
            setDraggedNode(node)

            dragOffset.current.x = node.x - event.clientX / zoom
            dragOffset.current.y = node.y - event.clientY / zoom
        }
    }

    const onNodeMouseUp = (node: Node, event: React.PointerEvent) => {
        setSelected(node)
    }

    const onPortLinkStart = (node: Node, port: Port) => {
        setDraggedPort([port, node])
    }

    const onPortMouseUp = (node: Node, port: Port, event: React.PointerEvent) => {
        if (draggedPort) {
            const [srcPort, srcNode] = draggedPort
            let link = srcNode.link(srcPort, node, port)
            if (!link) {
                link = node.link(port, srcNode, srcPort)
            }
            if (link) {
                link.recomputePath()
                setLinks([...links, link])
            }

            setDraggedPort(null)
        }
    }

    const doWheel = (event: React.WheelEvent) => {
        const newZoom = zoom - event.deltaY * 0.001
        const cursorX = (event.clientX - canvasRect.x) / zoom - panX
        const cursorY = (event.clientY - canvasRect.y) / zoom - panY
        const cursorNewX = (event.clientX - canvasRect.x) / newZoom - panX
        const cursorNewY = (event.clientY - canvasRect.y) / newZoom - panY
        const deltaX = cursorNewX - cursorX
        const deltaY = cursorNewY - cursorY

        setZoom(newZoom)
        setPanX(panX + deltaX)
        setPanY(panY + deltaY)
    }
    const onMoveSegmentStart = (start: Point, end: Point) => {}
    const onSplitSegmentStart = (start: Point, end: Point, position: 'left' | 'right') => {}

    const renderedLinks = fullLinks.map(link => {
        return (
            <Link
                link={link}
                selected={link === selected}
                onMouseDown={onLinkMouseDown}
                onMoveSegmentStart={onMoveSegmentStart}
                onSplitSegmentStart={onSplitSegmentStart}
            />
        )
    })
    const renderedNodes = nodes.map((node, index) => (
        <VisualNode
            key={index}
            node={node}
            allowEdit={editMode}
            onMouseDown={onNodeMouseDown}
            onMouseUp={onNodeMouseUp}
            onLinkStart={onPortLinkStart}
            onPortMouseUp={onPortMouseUp}
            selected={node === selected}
        />
    ))

    return (
        <div
            ref={canvasDiv}
            className='background-workspace workspace'
            onMouseDown={doCanvasMouseDown}
            onMouseUp={doCanvasMouseUp}
            onMouseMove={doCanvasMouseDrag}
            onKeyUp={doKeyUp}
            onWheel={doWheel}
            style={{
                cursor: panMode || draggedNode ? 'grabbing' : 'inherit',
            }}
        >
            <svg
                style={{
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    position: 'absolute',
                }}
            >
                <g transform={`scale(${zoom} ${zoom}) translate(${panX} ${panY})`}>
                    {renderedNodes}
                    {renderedLinks}
                </g>
            </svg>
        </div>
    )
}
