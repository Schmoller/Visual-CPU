import React, { FC, useMemo, useState } from 'react'
import { BitDisplay, BitDisplayVariant } from './BitDisplay'
import { BitGroupDisplay } from './BitGroupDisplay'

export interface Range {
    start: number
    end: number
    name?: string
}
interface BitInfo {
    selected?: boolean
    linkedTo?: string
    variant?: BitDisplayVariant
}

export interface BitSelectorProps {
    bits: number
    isLinking?: boolean
    hideLinked?: boolean

    ranges: Range[]
    highlight?: Range | null

    onBitClick?: (bit: number) => void
    onBitUnlink?: (bit: number, count?: number) => void

    canSelectRange?: boolean
    maxSelectedRange?: number
    onSelectRange?: (start: number, end: number) => void
}

export const BitSelector: FC<BitSelectorProps> = ({
    bits,
    isLinking,
    hideLinked,
    ranges,
    highlight,
    onBitClick,
    onBitUnlink,
    canSelectRange,
    maxSelectedRange,
    onSelectRange,
}) => {
    const [isSelecting, setIsSelecting] = useState<boolean>(false)
    const [selectionStartBit, setSelectionStartBit] = useState<number>(0)
    const [selectedRange, setSelectedRange] = useState<Range | null>(null)

    const onMouseDown = useMemo(() => {
        if (!canSelectRange) {
            return
        }
        return (bit: number) => {
            setIsSelecting(true)
            // setSelectedRange({ start: bit, end: bit + 1 })
            setSelectionStartBit(bit)
        }
    }, [canSelectRange])
    const onMouseEnter = useMemo(() => {
        if (!canSelectRange || !isSelecting) {
            return
        }

        return (bit: number) => {
            const span = bit - selectionStartBit
            if (maxSelectedRange && Math.abs(span) >= maxSelectedRange) {
                bit = selectionStartBit + (maxSelectedRange - 1) * Math.sign(span)
            }

            const start = Math.min(bit, selectionStartBit)
            const end = Math.max(bit + 1, selectionStartBit + 1)
            if (end > start + 1) {
                setSelectedRange({ start, end })
            } else {
                setSelectedRange(null)
            }
        }
    }, [canSelectRange, isSelecting, selectionStartBit])
    const onMouseUp = useMemo(() => {
        if (!canSelectRange || !isSelecting) {
            return
        }

        return (bit: number) => {
            const span = bit - selectionStartBit
            if (maxSelectedRange && Math.abs(span) >= maxSelectedRange) {
                bit = selectionStartBit + (maxSelectedRange - 1) * Math.sign(span)
            }
            const start = Math.min(bit, selectionStartBit)
            const end = Math.max(bit + 1, selectionStartBit + 1)
            if (onSelectRange && end > start + 1) {
                onSelectRange(start, end)
            }

            setIsSelecting(false)
            setSelectedRange(null)
        }
    }, [canSelectRange, isSelecting, selectionStartBit, onSelectRange])

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
        let variant: BitDisplayVariant
        if (isLinking) {
            variant = 'edited'
        } else {
            variant = 'highlight'
        }

        for (let bit = highlight.start; bit < highlight.end; ++bit) {
            bitMapping[bit] = { linkedTo: highlight.name, variant, selected: true }
        }
    }
    if (selectedRange) {
        for (let bit = selectedRange.start; bit < selectedRange.end; ++bit) {
            bitMapping[bit] = { variant: 'highlight', selected: true }
        }
    }

    let nextBit = 0
    const bitDisplay = []
    while (nextBit < bits) {
        let variant: BitDisplayVariant = 'normal'

        const mapped = bitMapping[nextBit]
        if (mapped.variant) {
            variant = mapped.variant
        }

        if (!mapped.linkedTo && !mapped.selected) {
            bitDisplay.push(
                <BitDisplay
                    bit={nextBit}
                    key={nextBit}
                    linking={isLinking}
                    hideLinked={hideLinked}
                    variant={variant}
                    onClicked={onBitClick}
                    onMouseDown={onMouseDown}
                    onMouseEnter={onMouseEnter}
                    onMouseUp={onMouseUp}
                />,
            )
            ++nextBit
        } else {
            let rangeEnd = nextBit + 1
            for (; rangeEnd < bits; ++rangeEnd) {
                const other = bitMapping[rangeEnd]
                if (
                    other.linkedTo !== mapped.linkedTo ||
                    other.variant != mapped.variant ||
                    other.selected != mapped.selected
                ) {
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
                        hideLinked={hideLinked}
                        linkedTo={mapped.linkedTo}
                        variant={variant}
                        onClicked={onBitClick}
                        onDelete={onBitUnlink}
                        onMouseDown={onMouseDown}
                        onMouseEnter={onMouseEnter}
                        onMouseUp={onMouseUp}
                    />,
                )
            } else {
                bitDisplay.push(
                    <BitDisplay
                        bit={nextBit}
                        key={nextBit}
                        linking={isLinking}
                        hideLinked={hideLinked}
                        onClicked={onBitClick}
                        linkedTo={mapped.linkedTo}
                        variant={variant}
                        onDelete={onBitUnlink}
                        onMouseDown={onMouseDown}
                        onMouseEnter={onMouseEnter}
                        onMouseUp={onMouseUp}
                    />,
                )
            }
            nextBit = rangeEnd
        }
    }

    return <div className='bus-link-window'>{bitDisplay}</div>
}
