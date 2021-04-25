import React, { FC } from 'react'
import { BusMapping, doesMappingOverlap, isBusMapping, isPortMapping } from '../../lib/ports'
import { BitDisplay } from './BitDisplay'
import { BitGroupDisplay } from './BitGroupDisplay'

export interface Range {
    start: number
    end: number
    name: string
}
interface BitInfo {
    linkedTo?: string
    highlight?: boolean
}

export interface BitSelectorProps {
    bits: number
    isLinking?: boolean

    ranges: Range[]
    highlight?: Range | null

    onBitClick: (bits: number) => void
    onBitUnlink: (bits: number) => void
}

export const BitSelector: FC<BitSelectorProps> = ({ bits, isLinking, ranges, highlight, onBitClick, onBitUnlink }) => {
    // compute the bit ranges
    const bitMapping: Record<number, BitInfo> = {}
    for (let bit = 0; bit < bits; ++bit) {
        bitMapping[bit] = {}
    }
    for (const range of ranges) {
        for (let bit = range.start; bit < range.end; ++bit) {
            bitMapping[bit] = { linkedTo: range.name }
        }
    }
    if (highlight) {
        for (let bit = highlight.start; bit < highlight.end; ++bit) {
            bitMapping[bit] = { linkedTo: highlight.name, highlight: true }
        }
    }

    let nextBit = 0
    const bitDisplay = []
    while (nextBit < bits) {
        let variant: 'normal' | 'highlight' | 'edited' = 'normal'

        const mapped = bitMapping[nextBit]
        if (mapped.highlight) {
            if (isLinking) {
                variant = 'edited'
            } else {
                variant = 'highlight'
            }
        }

        if (!mapped.linkedTo) {
            bitDisplay.push(
                <BitDisplay bit={nextBit} key={nextBit} linking={isLinking} variant={variant} onClicked={onBitClick} />,
            )
            ++nextBit
        } else {
            let rangeEnd = nextBit + 1
            for (; rangeEnd < bits; ++rangeEnd) {
                const other = bitMapping[rangeEnd]
                if (other.linkedTo !== mapped.linkedTo || other.highlight != mapped.highlight) {
                    break
                }
            }
            if (rangeEnd != nextBit + 1) {
                bitDisplay.push(
                    <BitGroupDisplay
                        bit={nextBit}
                        size={rangeEnd - nextBit}
                        key={nextBit}
                        linking={isLinking}
                        linkedTo={mapped.linkedTo}
                        variant={variant}
                        onClicked={onBitClick}
                    />,
                )
            } else {
                bitDisplay.push(
                    <BitDisplay
                        bit={nextBit}
                        key={nextBit}
                        linking={isLinking}
                        onClicked={onBitClick}
                        linkedTo={mapped.linkedTo}
                        variant={variant}
                        onDelete={onBitUnlink}
                    />,
                )
            }
            nextBit = rangeEnd
        }
    }

    return <>{bitDisplay}</>
}
