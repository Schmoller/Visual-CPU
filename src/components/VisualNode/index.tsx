import React, { FC, useCallback, useState } from 'react'

import { Body, BodyProps } from './Body'
import { NodePort } from './Port'
import { Node } from '../../lib/node'
import { Port } from '../../lib/port'

export interface VisualNodeProps {
    node: Node

    allowEdit?: boolean
    selected?: boolean
    onMouseDown?: (node: Node, event: React.PointerEvent) => void
    onMouseUp?: (node: Node, event: React.PointerEvent) => void

    onLinkStart?: (node: Node, port: Port) => void
    onPortMouseUp?: (node: Node, port: Port, event: React.PointerEvent) => void
}

export const VisualNode: FC<VisualNodeProps> = ({
    node,
    allowEdit,
    selected,
    onMouseDown,
    onMouseUp,
    onLinkStart,
    onPortMouseUp,
}) => {
    const [displaySettings, setDisplaySettings] = useState<boolean>(false)

    const onOpenSettings = useCallback((event: React.MouseEvent) => {
        setDisplaySettings(true)
    }, [])

    const onCloseSettings = useCallback(() => {
        setDisplaySettings(false)
    }, [])

    let displayNode: React.ReactNode
    if (node.displayComponent) {
        displayNode = React.createElement(node.displayComponent, { node: node })
    }

    let settingsNode: React.ReactNode
    if (node.settingsComponent && displaySettings) {
        settingsNode = React.createElement(node.settingsComponent, { node, onClose: onCloseSettings })
    }

    return (
        <>
            <Body
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                display={displayNode}
                allowEdit={allowEdit}
                onMouseDown={onMouseDown ? onMouseDown.bind(null, node) : undefined}
                onMouseUp={onMouseUp ? onMouseUp.bind(null, node) : undefined}
                onDoubleClick={onOpenSettings}
            />

            {node.ports.map(port => (
                <NodePort key={port.name} node={node} port={port} onLinkStart={onLinkStart} onMouseUp={onPortMouseUp} />
            ))}
            {settingsNode}
        </>
    )
}
