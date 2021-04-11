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

    linkFrom?: SourceLink
    initialX: number
    initialY: number
}

export const BusNodeLinkWindow: FC<BusNodeLinkWindowProps> = ({
    port,
    initialX,
    initialY,
    linkFrom,
    onLinkComplete,
    onClose,
    onHighlightLink,
}) => {
    // TODO: allow the height to be automatically determined
    const height = port.bitSize * 21
    const [placementRange, setPlacementRange] = useState<[number, number] | null>(null)

    const onBitClick = useCallback(
        (bit: number) => {
            if (!linkFrom) {
                return
            }
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
        },
        [linkFrom],
    )
    const completeLink = useCallback(() => {
        if (!placementRange || !linkFrom) {
            return
        }
        const [start, end] = placementRange
        if (linkFrom.bus) {
            if (linkFrom.subRange) {
                if (port.linkToBus(linkFrom.bus, start, linkFrom.subRange)) {
                    if (onLinkComplete) {
                        onLinkComplete()
                    }
                } else {
                }
            } else {
                if (port.linkToBus(linkFrom.bus, start)) {
                    if (onLinkComplete) {
                        onLinkComplete()
                    }
                } else {
                }
            }
        } else {
            const reason = port.linkToPort(linkFrom.port as BinaryPort, start)
            if (reason === LinkReason.Success) {
                if (onLinkComplete) {
                    onLinkComplete()
                }
            } else {
            }
        }
    }, [placementRange, linkFrom, onLinkComplete])

    let nextBit = 0
    const bitDisplay = []
    let mappings: BusMapping[] = port.mappings
    let highlightMapping: BusMapping | null = null
    if (placementRange) {
        mappings = [...mappings]
        const size = placementRange[1] - placementRange[0]
        if (size > 1) {
            highlightMapping = {
                type: 'bus',
                bit: placementRange[0],
                size,
                bus: linkFrom!.bus!,
                offset: 0,
            }
        } else {
            highlightMapping = {
                type: 'port',
                bit: placementRange[0],
                port: linkFrom!.port!,
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
            if (linkFrom) {
                variant = 'edited'
            } else {
                variant = 'highlight'
            }
        }
        for (; nextBit < mapping.bit; ++nextBit) {
            // Add an empty bit display
            bitDisplay.push(<BitDisplay bit={nextBit} key={nextBit} linking={!!linkFrom} onClicked={onBitClick} />)
        }
        // Add bit display for mapping
        if (isBusMapping(mapping)) {
            bitDisplay.push(
                <BitGroupDisplay
                    bit={nextBit}
                    size={mapping.bus.size}
                    key={nextBit}
                    linking={!!linkFrom}
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
                    linking={!!linkFrom}
                    onClicked={onBitClick}
                    linkedTo={mapping.port.name}
                    variant={variant}
                />,
            )
            ++nextBit
        }
    }
    for (; nextBit < port.bitSize; ++nextBit) {
        bitDisplay.push(<BitDisplay bit={nextBit} key={nextBit} linking={!!linkFrom} onClicked={onBitClick} />)
    }
    let title = port.name
    if (linkFrom) {
        title += ' (Link)'
    }

    let controls: React.ReactNode
    if (linkFrom) {
        controls = (
            <div className='window-controls'>
                <Button text='Apply' variant='cta' onClick={completeLink} />
                <Button text='Cancel' variant='quiet' onClick={onClose} />
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
