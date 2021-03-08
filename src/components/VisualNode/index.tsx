import React, { FC } from 'react'

import { Body, BodyProps } from './Body'
import { Node } from '../../lib/node'

export interface VisualNodeProps {
    node: Node

    allowEdit?: boolean
    onMouseDown?: (node: Node, event: React.PointerEvent) => void
    onMouseUp?: (node: Node, event: React.PointerEvent) => void
}

export const VisualNode: FC<VisualNodeProps> = ({ node, allowEdit, onMouseDown, onMouseUp }) => {
    return (
        <Body
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            allowEdit={allowEdit}
            onMouseDown={onMouseDown ? onMouseDown.bind(null, node) : undefined}
            onMouseUp={onMouseUp ? onMouseUp.bind(null, node) : undefined}
        />
    )
}
