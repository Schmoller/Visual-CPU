import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VisualNode } from '../components/VisualNode'
import { PortLink } from '../lib/link'
import { Node } from '../lib/node'

import './style.css'
import { Link } from '../components/VisualNode/Link/Link'
import { Point } from '../lib/common'
import { useEditorState } from '../lib/editor'
import { createNodeFromId } from '../lib/nodes'
import { BinaryPort, BusPort, LinkReason, Port } from '../lib/ports'
import { useStateArray } from '../lib/react_util'
import { BusNodeLinkWindow, SourceLink } from '../windows/BusNodeLinkWindow/BusNodeLinkWindow'
import { Bus } from '../lib/bus'

let currentMouseX: number
let currentMouseY: number

type Selectable = PortLink | Node
interface DraggedPort {
    node: Node
    port: Port
    bus?: Bus
}
interface BusLinkState {
    node: Node
    port: BusPort
    to?: DraggedPort
    from?: DraggedPort
    link?: PortLink
}

export interface CanvasProps {
    gridSnap?: number
}

export const Canvas: FC<CanvasProps> = ({ gridSnap = 30 }) => {
    const editorState = useEditorState()
    const canvasDiv = useRef<HTMLDivElement>(null)
    const [links, addLink, removeLink] = useStateArray<PortLink>()
    const [nodes, addNode, removeNode] = useStateArray<Node>()
    const [selected, setSelected] = useState<Selectable | null>(null)
    const [draggedNode, setDraggedNode] = useState<Node | null>(null)
    const [draggedPort, setDraggedPort] = useState<DraggedPort | null>(null)
    const dragOffset = useRef({ x: 0, y: 0 })
    const panOffset = useRef({ x: 0, y: 0 })
    const cursorPanOffset = useRef({ x: 0, y: 0 })
    const [editMode, setEditMode] = useState(true)
    const [panMode, setPanMode] = useState(false)
    const [, setForcedUpdate] = useState<number>(0)
    const [zoom, setZoom] = useState(1)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)
    const [showBusLink, setShowBusLink] = useState<BusLinkState | null>(null)

    const getCanvasRect = useCallback(() => {
        if (canvasDiv.current) {
            return canvasDiv.current.getBoundingClientRect()
        } else {
            return new DOMRect()
        }
    }, [])

    const fullLinks = links.filter(item => !!item.dst)
    const onLinkMouseDown = (event: React.MouseEvent, link: PortLink) => {
        setSelected(link)
    }

    const doCanvasMouseDown = (event: React.MouseEvent) => {
        const canvasRect = getCanvasRect()

        if (event.button === 1) {
            setPanMode(true)
            panOffset.current.x = panX
            panOffset.current.y = panY
            cursorPanOffset.current.x = (event.clientX - canvasRect.x) / zoom
            cursorPanOffset.current.y = (event.clientY - canvasRect.y) / zoom
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
        const canvasRect = getCanvasRect()

        if (draggedNode) {
            draggedNode.x = (event.clientX - canvasRect.x) / zoom + dragOffset.current.x
            draggedNode.y = (event.clientY - canvasRect.y) / zoom + dragOffset.current.y

            draggedNode.x = Math.round(draggedNode.x / gridSnap) * gridSnap
            draggedNode.y = Math.round(draggedNode.y / gridSnap) * gridSnap

            draggedNode.updateLinks()

            setForcedUpdate(num => num + 1)
        } else if (panMode) {
            setPanX((event.clientX - canvasRect.x) / zoom - cursorPanOffset.current.x + panOffset.current.x)
            setPanY((event.clientY - canvasRect.y) / zoom - cursorPanOffset.current.y + panOffset.current.y)
        }

        currentMouseX = event.clientX - canvasRect.x
        currentMouseY = event.clientY - canvasRect.y
    }
    const onDragOver = (event: React.DragEvent) => {
        const draggedTypeId = editorState.placementComponent
        if (draggedTypeId) {
            event.preventDefault()
        }
    }
    const onDragDrop = (event: React.DragEvent) => {
        const canvasRect = getCanvasRect()

        const draggedTypeId = editorState.placementComponent
        if (draggedTypeId) {
            event.preventDefault()
            let x = (event.clientX - canvasRect.x) / zoom - panX
            let y = (event.clientY - canvasRect.y) / zoom - panY

            x = Math.round(x / gridSnap) * gridSnap
            y = Math.round(y / gridSnap) * gridSnap
            const node = createNodeFromId(draggedTypeId, x, y)
            if (node) {
                addNode(node)
            }
        }
    }

    const deleteNode = useCallback(
        (node: Node) => {
            for (const port of node.ports) {
                for (const link of port.links) {
                    deleteLink(link)
                }
            }
            node.destroy()
            removeNode(node)
        },
        [nodes],
    )
    const deleteLink = useCallback(
        (link: PortLink) => {
            if (link.dst) {
                link.src[0].unlink(link.src[1], link.dst[0], link.dst[1])
            }
            removeLink(link)
        },
        [links],
    )

    useEffect(() => {
        const onGlobalKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Delete') {
                if (selected) {
                    if (selected instanceof Node) {
                        deleteNode(selected)
                    } else if (selected instanceof PortLink) {
                        deleteLink(selected)
                    }
                }
            }
        }

        document.addEventListener('keyup', onGlobalKeyUp)

        return () => {
            document.removeEventListener('keyup', onGlobalKeyUp)
        }
    })

    const onNodeMouseDown = (node: Node, event: React.PointerEvent) => {
        const canvasRect = getCanvasRect()

        if (editMode && event.button == 0) {
            setDraggedNode(node)

            dragOffset.current.x = node.x - (event.clientX - canvasRect.x) / zoom
            dragOffset.current.y = node.y - (event.clientY - canvasRect.y) / zoom
        }
    }

    const onNodeMouseUp = (node: Node, event: React.PointerEvent) => {
        setSelected(node)
    }

    const onPortLinkStart = (node: Node, port: Port) => {
        if (port instanceof BinaryPort) {
            if (!port.canOutput()) {
                return
            }
        }

        setDraggedPort({
            node,
            port,
        })
    }

    const onPortMouseUp = (node: Node, port: Port, event: React.PointerEvent) => {
        if (draggedPort) {
            const { node: sourceNode, port: sourcePort } = draggedPort
            if (port === sourcePort) {
                if (port instanceof BusPort) {
                    // show window for editing
                    setShowBusLink({
                        port,
                        node,
                    })
                }
            } else {
                if (port instanceof BusPort) {
                    const link = new PortLink([sourceNode, sourcePort], [node, port])
                    // create a visual link
                    link.recomputePath()
                    addLink(link)

                    // show the bus window
                    setShowBusLink({
                        port,
                        node,
                        from: draggedPort,
                        link,
                    })
                } else {
                    if (sourcePort instanceof BusPort) {
                        const link = new PortLink([sourceNode, sourcePort], [node, port])
                        // create a visual link
                        link.recomputePath()
                        addLink(link)

                        // show window to select the source bit
                        setShowBusLink({
                            node: sourceNode,
                            port: sourcePort,
                            to: { node, port },
                            link,
                        })
                    } else {
                        let link = sourceNode.link(sourcePort, node, port)
                        if (!link) {
                            link = node.link(port, sourceNode, sourcePort)
                        }
                        if (link) {
                            link.recomputePath()
                            addLink(link)
                        }
                    }
                }
            }

            setDraggedPort(null)
        }
    }

    const doWheel = (event: React.WheelEvent) => {
        const canvasRect = getCanvasRect()

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

    const windows: React.ReactNode[] = []
    if (showBusLink) {
        const canvasRect = getCanvasRect()

        const location = showBusLink.node.getPortLocation(showBusLink.port)
        const initialX = (location.x + panX) * zoom + canvasRect.x
        const initialY = (location.y + panY) * zoom + canvasRect.y
        const onLinkComplete = () => {
            if (showBusLink.from) {
                const { port: sourcePort } = showBusLink.from
                sourcePort.links.push(showBusLink.link!)
                showBusLink.port.links.push(showBusLink.link!)
            } else if (showBusLink.to) {
                const { port: destPort } = showBusLink.to

                showBusLink.port.links.push(showBusLink.link!)
                destPort.links.push(showBusLink.link!)
            }
            setShowBusLink(null)
        }
        const onClose = () => {
            if (showBusLink.link) {
                removeLink(showBusLink.link)
            }
            setShowBusLink(null)
        }
        const onUnlink = (port: BinaryPort, bit: number) => {
            if (showBusLink.port.unlinkToPort(port, bit)) {
                for (const link of port.links) {
                    if (link.src[1] === showBusLink.port || (link.dst && link.dst[1] === showBusLink.port)) {
                        deleteLink(link)
                        const index = port.links.indexOf(link)
                        if (index >= 0) {
                            port.links.splice(index, 1)
                        }
                        break
                    }
                }
            }
        }

        let linkFrom: SourceLink | undefined
        if (showBusLink.from) {
            linkFrom = {
                port: showBusLink.from.port,
                bus: showBusLink.from.bus,
            }
        }
        let linkTo: SourceLink | undefined
        if (showBusLink.to) {
            linkTo = {
                port: showBusLink.to.port,
                bus: showBusLink.to.bus,
            }
        }

        windows.push(
            <BusNodeLinkWindow
                initialX={initialX}
                initialY={initialY}
                port={showBusLink.port}
                key='bus'
                onLinkComplete={onLinkComplete}
                onClose={onClose}
                onUnlink={onUnlink}
                linkFrom={linkFrom}
                linkTo={linkTo}
            />,
        )
    }

    return (
        <div
            ref={canvasDiv}
            className='background-workspace workspace'
            onMouseDown={doCanvasMouseDown}
            onMouseUp={doCanvasMouseUp}
            onMouseMove={doCanvasMouseDrag}
            onWheel={doWheel}
            onDragOver={onDragOver}
            onDrop={onDragDrop}
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
            {windows}
        </div>
    )
}
