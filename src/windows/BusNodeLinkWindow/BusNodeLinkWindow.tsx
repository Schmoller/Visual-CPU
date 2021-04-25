import React, { FC, useCallback, useMemo, useState } from 'react'
import { BinaryPort, BusPort, isBusMapping, isPortMapping, LinkReason, Port } from '../../lib/ports'
import { Window } from '../../components/Window/Window'
import './style.css'
import { PortLink } from '../../lib/link'
import { Bus } from '../../lib/bus'
import { Button, DropdownButton, MenuItem } from '../../components/Topcoat'
import { BitSelector, Range } from './BitSelector'
import { useActiveWorksheet } from '../../lib/worksheet'
import { useObservableArray } from '../../lib/observable'
import { useUpdateOnChange } from '../../lib/react_util'

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
    useUpdateOnChange(port)

    const worksheet = useActiveWorksheet()
    const allBuses = useObservableArray(worksheet.definedBuses)

    const [placementRange, setPlacementRange] = useState<[number, number] | null>(null)
    const [sourceBusOffset, setSourceBusOffset] = useState<number>(0)

    const [selectedBusId, setSelectedBusId] = useState<string | null>(null)

    const selectedBus = useMemo(() => {
        return allBuses.find(bus => bus.name === selectedBusId)
    }, [selectedBusId, allBuses])

    const isLinking = !!linkFrom || !!linkTo || !!selectedBus
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
            } else if (selectedBus) {
                if (!placementRange) {
                    return
                }

                let size = placementRange[1] - placementRange[0]
                if (bit + size > port.bitSize) {
                    size = port.bitSize - bit
                }
                if (sourceBusOffset + size > selectedBus.size) {
                    size = selectedBus.size - sourceBusOffset
                }

                setPlacementRange([bit, bit + size])
            }
        },
        [linkFrom, linkTo, selectedBus, placementRange, port, sourceBusOffset],
    )
    const onBusBitClick = useCallback(
        (bit: number) => {
            if (!selectedBus || !placementRange) {
                return
            }
            setSourceBusOffset(bit)

            let size = placementRange[1] - placementRange[0]
            if (bit + size > selectedBus.size) {
                size = selectedBus.size - bit
            }

            const placementStart = placementRange[0]
            setPlacementRange([placementStart, placementStart + size])
        },
        [selectedBus, placementRange],
    )

    const onSelectPortRange = useCallback(
        (start: number, end: number) => {
            if (!selectedBus) {
                return
            }

            setPlacementRange([start, end])
            const size = end - start
            if (sourceBusOffset + size > selectedBus.size) {
                setSourceBusOffset(selectedBus.size - size)
            }
        },
        [selectedBus],
    )

    const onSelectBusRange = useCallback(
        (start: number, end: number) => {
            if (!selectedBus || !placementRange) {
                return
            }

            const size = end - start
            let placementStart = placementRange[0]
            if (placementStart + size > port.bitSize) {
                placementStart = port.bitSize - size
            }

            const placementEnd = Math.min(placementStart + size, port.bitSize)

            setPlacementRange([placementStart, placementEnd])
            setSourceBusOffset(start)
        },
        [selectedBus, placementRange, port],
    )

    const completeLink = useCallback(() => {
        if (!placementRange) {
            return
        }
        const [start, end] = placementRange
        const link = linkFrom ? linkFrom : linkTo
        if (link) {
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
        } else if (selectedBus) {
            const size = end - start
            if (port.linkToBus(selectedBus, start, [sourceBusOffset, sourceBusOffset + size])) {
                if (onLinkComplete) {
                    onLinkComplete()
                }
            }
        }
    }, [placementRange, linkFrom, linkTo, onLinkComplete, selectedBus, sourceBusOffset])

    const doUnlink = useCallback(
        (bit: number) => {
            const connectedPort = port.getConnectedPort(bit)
            if (connectedPort) {
                if (onUnlink) {
                    onUnlink(connectedPort, bit)
                }
            }
            const connectedBus = port.getConnectedBus(bit)
            if (connectedBus) {
                port.unlinkToBus(connectedBus, bit)
            }
        },
        [onUnlink],
    )

    const doSelectBus = useCallback((busId: string) => {
        setSelectedBusId(busId)
        const bus = allBuses.find(bus => bus.name === busId)
        let updated = false

        if (bus) {
            setSourceBusOffset(0)

            if (bus.size >= port.bitSize) {
                setPlacementRange([0, port.bitSize])
                updated = true
            } else {
                setPlacementRange([0, bus.size])
                updated = true
            }
        }
        if (!updated) {
            setPlacementRange(null)
        }
    }, [])

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

    let busRange: Range | null = null
    if (selectedBus && placementRange) {
        const size = placementRange[1] - placementRange[0]
        busRange = {
            start: sourceBusOffset,
            end: sourceBusOffset + size,
        }
    }

    let title = port.name
    if (linkFrom) {
        title += ' (Link)'
    } else if (linkTo) {
        title += ' (Source)'
    } else if (selectedBus) {
        title += ' (Link to bus)'
    }

    let controls: React.ReactNode
    const applyEnabled = placementRange
    controls = (
        <div className='window-controls'>
            <Button text='Apply' variant='cta' onClick={completeLink} disabled={!applyEnabled} />
            <Button text='Cancel' variant='quiet' onClick={onClose} />
        </div>
    )
    const linkMenuItems = useMemo(() => {
        const items: MenuItem[] = []
        for (const bus of allBuses) {
            items.push({
                id: bus.name,
                value: `${bus.name} (${bus.size} bits)`,
            })
        }
        return items
    }, [allBuses])

    let headerControls: React.ReactNode
    if (!linkFrom && !linkTo) {
        headerControls = <DropdownButton value='Link' items={linkMenuItems} onSelect={doSelectBus} />
    }

    return (
        <Window title={title} initialX={initialX} initialY={initialY} initialWidth={'auto'} initialHeight={'auto'}>
            <div className='bus-link-window'>
                {headerControls}

                <div className='bus-link-multiple'>
                    <BitSelector
                        bits={port.bitSize}
                        isLinking={isLinking}
                        ranges={ranges}
                        highlight={highlightRange}
                        onBitClick={onBitClick}
                        onBitUnlink={doUnlink}
                        canSelectRange={!!selectedBus}
                        maxSelectedRange={selectedBus ? selectedBus.size : 0}
                        onSelectRange={onSelectPortRange}
                    />
                    {selectedBus && (
                        <BitSelector
                            bits={selectedBus.size}
                            isLinking
                            ranges={[]}
                            hideLinked
                            highlight={busRange}
                            canSelectRange
                            maxSelectedRange={port.bitSize}
                            onSelectRange={onSelectBusRange}
                            onBitClick={onBusBitClick}
                        />
                    )}
                </div>
                {controls}
            </div>
        </Window>
    )
}
