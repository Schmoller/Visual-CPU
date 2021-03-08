import React, { FC, useEffect, useRef, useState } from 'react'
import { VisualNode } from '../components/VisualNode'
import { Node } from '../lib/node'

import './style.css'

let currentMouseX: number
let currentMouseY: number

export interface CanvasProps {
    gridSnap?: number
}

export const Canvas: FC<CanvasProps> = ({ gridSnap = 30 }) => {
    const [nodes, setNodes] = useState<Node[]>([])
    const [draggedNode, setDraggedNode] = useState<Node | null>(null)
    const dragOffset = useRef({ x: 0, y: 0 })
    const [editMode, setEditMode] = useState(true)
    const [, setForcedUpdate] = useState<number>(0)

    const doCanvasMouseDown = (event: React.MouseEvent) => {}

    const doCanvasMouseUp = (event: React.MouseEvent) => {
        setDraggedNode(null)
    }

    const doCanvasMouseDrag = (event: React.MouseEvent) => {
        if (draggedNode) {
            draggedNode.x = event.clientX + dragOffset.current.x
            draggedNode.y = event.clientY + dragOffset.current.y

            draggedNode.x = Math.round(draggedNode.x / gridSnap) * gridSnap
            draggedNode.y = Math.round(draggedNode.y / gridSnap) * gridSnap

            setForcedUpdate(num => num + 1)
        }

        currentMouseX = event.clientX
        currentMouseY = event.clientY
    }

    const doKeyUp = (event: React.KeyboardEvent) => {}

    useEffect(() => {
        const onGlobalKeyUp = (event: KeyboardEvent) => {
            if (event.key == 'a') {
                const node = new Node(currentMouseX, currentMouseY, 50, 50)
                setNodes([...nodes, node])
            }
        }

        document.addEventListener('keyup', onGlobalKeyUp)

        return () => {
            document.removeEventListener('keyup', onGlobalKeyUp)
        }
    })

    const onNodeMouseDown = (node: Node, event: React.PointerEvent) => {
        if (editMode) {
            setDraggedNode(node)

            dragOffset.current.x = node.x - event.clientX
            dragOffset.current.y = node.y - event.clientY
        }
    }

    const onNodeMouseUp = (node: Node, event: React.PointerEvent) => {
        // Noop
    }

    return (
        <div
            className='background-workspace workspace'
            onMouseDown={doCanvasMouseDown}
            onMouseUp={doCanvasMouseUp}
            onMouseMove={doCanvasMouseDrag}
            onKeyUp={doKeyUp}
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
                <g>
                    {nodes.map((node, index) => (
                        <VisualNode
                            key={index}
                            node={node}
                            allowEdit={editMode}
                            onMouseDown={onNodeMouseDown}
                            onMouseUp={onNodeMouseUp}
                        />
                    ))}
                </g>
            </svg>
        </div>
    )
}
