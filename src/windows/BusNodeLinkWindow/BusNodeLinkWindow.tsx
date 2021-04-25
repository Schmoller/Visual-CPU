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

    let nextBit = 0
    const bitDisplay = []
    let mappings: BusMapping[] = port.mappings
    let highlightMapping: BusMapping | null = null
    if (placementRange) {
        mappings = [...mappings]
        const size = placementRange[1] - placementRange[0]
        const linkBus = linkFrom ? linkFrom.bus : linkTo!.bus
        const linkPort = linkFrom ? linkFrom.port : linkTo!.port

        if (size > 1) {
            highlightMapping = {
                type: 'bus',
                bit: placementRange[0],
                size,
                bus: linkBus!,
                offset: 0,
            }
        } else {
            highlightMapping = {
                type: 'port',
                bit: placementRange[0],
                port: linkPort as BinaryPort,
                vPort: new VirtualPort(port, placementRange[0]),
            }
        }

        // insert our placement range as a mapping
        // and move anything that is in the way
        for (const mapping of mappings) {
            if (doesMappingOverlap(mapping, highlightMapping)) {
                console.log('highlight overlap')
                // TODO: what the comment above says
            }
        }
        mappings.push(highlightMapping)
        mappings.sort((a, b) => a.bit - b.bit)
    }

    for (const mapping of mappings) {
        let variant: 'normal' | 'highlight' | 'edited' = 'normal'
        if (highlightMapping === mapping) {
            if (linkFrom || linkTo) {
                variant = 'edited'
            } else {
                variant = 'highlight'
            }
        }
        for (; nextBit < mapping.bit; ++nextBit) {
            // Add an empty bit display
            bitDisplay.push(
                <BitDisplay bit={nextBit} key={nextBit} linking={!!linkFrom || !!linkTo} onClicked={onBitClick} />,
            )
        }
        // Add bit display for mapping
        if (isBusMapping(mapping)) {
            bitDisplay.push(
                <BitGroupDisplay
                    bit={nextBit}
                    size={mapping.bus.size}
                    key={nextBit}
                    linking={!!linkFrom || !!linkTo}
                    variant={variant}
                    onClicked={onBitClick}
                />,
            )
            nextBit += mapping.bus.size
        } else if (isPortMapping(mapping)) {
            bitDisplay.push(
                <BitDisplay
                    bit={nextBit}
                    key={nextBit}
                    linking={!!linkFrom || !!linkTo}
                    onClicked={onBitClick}
                    linkedTo={mapping.port.name}
                    variant={variant}
                    onDelete={doUnlink}
                />,
            )
            ++nextBit
        }
    }
    for (; nextBit < port.bitSize; ++nextBit) {
        bitDisplay.push(
            <BitDisplay bit={nextBit} key={nextBit} linking={!!linkFrom || !!linkTo} onClicked={onBitClick} />,
        )
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
                {bitDisplay}
                {controls}
            </div>
        </Window>
    )
}
