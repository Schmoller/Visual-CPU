import React, { FC, useCallback, useState } from 'react'
import {
    BinaryPort,
    BusPort,
    isBusMapping,
    isPortMapping,
    LinkReason,
    Port,
    BusMapping,
    VirtualPort,
    doesMappingOverlap,
} from '../../lib/ports'
import { Window } from '../../components/Window/Window'
import { BitDisplay } from './BitDisplay'
import './style.css'
import { BitGroupDisplay } from './BitGroupDisplay'
import { PortLink } from '../../lib/link'
import { Bus } from '../../lib/bus'
import { Button } from '../../components/Topcoat'
import { BitSelector, Range } from './BitSelector'

export interface SourceLink {
    port?: Port
    bus?: Bus
    subRange?: [number, number]
}

export interface BusNodeLinkWindowProps {
    port: BusPort
    onLinkComplete?: () => void
    onClose?: () => void
    onHighlightLink?: (link: PortLink | null) => void
    onUnlink?: (port: BinaryPort, bit: number) => void

    linkFrom?: SourceLink
    linkTo?: SourceLink
    initialX: number
    initialY: number
}

export const BusNodeLinkWindow: FC<BusNodeLinkWindowProps> = ({
    port,
    initialX,
    initialY,
    linkFrom,
    linkTo,
    onLinkComplete,
    onUnlink,
    onClose,
    onHighlightLink,
}) => {
    const [placementRange, setPlacementRange] = useState<[number, number] | null>(null)

    const onBitClick = useCallback(
        (bit: number) => {
            if (linkFrom) {
                let start = bit
                let end = 0
                if (linkFrom.bus) {
                    if (linkFrom.subRange) {
                        const size = linkFrom.subRange[1] - linkFrom.subRange[0]
                        end = start + size
                    } else {
                        end = start + linkFrom.bus.size
                    }
                } else {
                    end = start + 1
                }

                for (let i = start; i < end; ++i) {
                    if (port.isBitOccupied(i)) {
                        setPlacementRange(null)
                        return
                    }
                }
                setPlacementRange([start, end])
            } else if (linkTo) {
                let start = bit
                let end = 0
                if (linkTo.bus) {
                    if (linkTo.subRange) {
                        const size = linkTo.subRange[1] - linkTo.subRange[0]
                        end = start + size
                    } else {
                        end = start + linkTo.bus.size
                    }
                } else {
                    end = start + 1
                }

                for (let i = start; i < end; ++i) {
                    if (port.isBitOccupied(i)) {
                        setPlacementRange(null)
                        return
                    }
                }
                setPlacementRange([start, end])
            }
        },
        [linkFrom],
    )
    const completeLink = useCallback(() => {
        if (!placementRange) {
            return
        }
        const [start, end] = placementRange
        const link = linkFrom ? linkFrom : linkTo
        if (!link) {
            return
        }

        if (link.bus) {
            if (link.subRange) {
                if (port.linkToBus(link.bus, start, link.subRange)) {
                    if (onLinkComplete) {
                        onLinkComplete()
                    }
                } else {
                }
            } else {
                if (port.linkToBus(link.bus, start)) {
                    if (onLinkComplete) {
                        onLinkComplete()
                    }
                } else {
                }
            }
        } else {
            const reason = port.linkToPort(link.port as BinaryPort, start)
            if (reason === LinkReason.Success) {
                if (onLinkComplete) {
                    onLinkComplete()
                }
            } else {
            }
        }
    }, [placementRange, linkFrom, linkTo, onLinkComplete])

    const doUnlink = useCallback(
        (bit: number) => {
            const connected = port.getConnectedPort(bit)
            if (connected && onUnlink) {
                onUnlink(connected, bit)
            }
        },
        [onUnlink],
    )
    const ranges: Range[] = port.mappings.map(mapping => {
        if (isBusMapping(mapping)) {
            return {
                start: mapping.bit,
                end: mapping.bit + mapping.bus.size,
                name: mapping.bus.name,
            }
        } else if (isPortMapping(mapping)) {
            return {
                start: mapping.bit,
                end: mapping.bit + 1,
                name: mapping.port.name,
            }
        }
        throw new Error('invalid mapping type')
    })

    let highlightRange: Range | null = null
    if (placementRange) {
        let name: string
        if (linkFrom) {
            if (linkFrom.bus) {
                name = linkFrom.bus.name
            } else if (linkFrom.port) {
                name = linkFrom.port.name
            } else {
                name = ''
            }
        } else if (linkTo) {
            if (linkTo.bus) {
                name = linkTo.bus.name
            } else if (linkTo.port) {
                name = linkTo.port.name
            } else {
                name = ''
            }
        } else {
            name = ''
        }

        highlightRange = {
            start: placementRange[0],
            end: placementRange[1],
            name,
        }
    }

    let title = port.name
    if (linkFrom) {
        title += ' (Link)'
    } else if (linkTo) {
        title += ' (Source)'
    }

    let controls: React.ReactNode
    if (linkFrom || linkTo) {
        controls = (
            <div className='window-controls'>
                <Button text='Apply' variant='cta' onClick={completeLink} />
                <Button text='Cancel' variant='quiet' onClick={onClose} />
            </div>
        )
    } else {
        controls = (
            <div className='window-controls'>
                <Button text='Close' onClick={onClose} />
            </div>
        )
    }

    return (
        <Window title={title} initialX={initialX} initialY={initialY} initialWidth={150} initialHeight={'auto'}>
            <div className='bus-link-window'>
                <BitSelector
                    bits={port.bitSize}
                    isLinking={!!linkFrom || !!linkTo}
                    ranges={ranges}
                    highlight={highlightRange}
                    onBitClick={onBitClick}
                    onBitUnlink={doUnlink}
                />
                {controls}
            </div>
        </Window>
    )
}
