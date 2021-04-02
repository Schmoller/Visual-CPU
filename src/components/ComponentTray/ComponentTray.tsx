import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useEditorState } from '../../lib/editor'
import { PortSize } from '../../lib/node'
import { AllTypes } from '../../lib/nodes'
import { Textbox } from '../Topcoat'
import { VisualNode } from '../VisualNode'
import { Item } from './Item'
import './style.css'
export interface ComponentTrayProps {
    onComponentSelect?: (type: any) => void
}

export const ComponentTray: FC = () => {
    const [searchText, setSearchText] = useState('')
    const editorState = useEditorState()

    const types = useMemo(() => {
        // TODO: filter by search text
        return AllTypes
    }, [searchText])

    const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value)
    }, [])

    return (
        <div className='component-tray'>
            <Textbox value={searchText} onValueChange={onSearch} placeholder='Search' />
            <div className='tray'>
                {types.map(type => {
                    const metadata = type.metadata()
                    const example = type.createExample()
                    const onDragStart = () => {
                        editorState.placementComponent = metadata.id
                    }

                    return (
                        <Item title={metadata.name} key={metadata.id} onDragStart={onDragStart}>
                            <svg width={example.width + PortSize * 2} height={example.height + PortSize * 2}>
                                <g transform={`translate(${PortSize}, ${PortSize})`}>
                                    <VisualNode node={example} />
                                </g>
                            </svg>
                        </Item>
                    )
                })}
            </div>
        </div>
    )
}
