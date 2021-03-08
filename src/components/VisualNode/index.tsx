import React, { FC } from 'react'

import { Body, BodyProps } from './Body'
import { NodePort } from './Port'
import { Node } from '../../lib/node'
import { Port } from '../../lib/port'

export interface VisualNodeProps {
    node: Node

    allowEdit?: boolean
    onMouseDown?: (node: Node, event: React.PointerEvent) => void
    onMouseUp?: (node: Node, event: React.PointerEvent) => void

    onLinkStart?: (node: Node, port: Port) => void
    onPortMouseUp?: (node: Node, port: Port, event: React.PointerEvent) => void
}

export const VisualNode: FC<VisualNodeProps> = ({
    node,
    allowEdit,
    onMouseDown,
    onMouseUp,
    onLinkStart,
    onPortMouseUp,
}) => {
    return (
        <>
            <Body
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                allowEdit={allowEdit}
                onMouseDown={onMouseDown ? onMouseDown.bind(null, node) : undefined}
                onMouseUp={onMouseUp ? onMouseUp.bind(null, node) : undefined}
            />

            {node.ports.map(port => (
                <NodePort key={port.name} node={node} port={port} onLinkStart={onLinkStart} onMouseUp={onPortMouseUp} />
            ))}
        </>
    )
}
