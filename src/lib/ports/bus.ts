import { Bus } from '../bus'
import { BinaryPort, LinkReason, Port, Side } from './common'

interface BusMappingForPort {
    type: 'port'
    bit: number

    port: BinaryPort
    vPort: VirtualPort
}
type SubRange = [number, number]
interface BusMappingForBus {
    type: 'bus'
    bit: number

    bus: Bus
    offset: number
    size: number
}

export type BusMapping = BusMappingForPort | BusMappingForBus

export function isPortMapping(mapping: BusMapping): mapping is BusMappingForPort {
    return mapping.type === 'port'
}

export function isBusMapping(mapping: BusMapping): mapping is BusMappingForBus {
    return mapping.type === 'bus'
}
export function doesMappingOverlap(a: BusMapping, b: BusMapping): boolean {
    let aStart: number = a.bit
    let aEnd: number
    let bStart: number = b.bit
    let bEnd: number

    if (isPortMapping(a)) {
        aEnd = aStart + 1
    } else {
        aEnd = aStart + a.size
    }
    if (isPortMapping(b)) {
        bEnd = bStart + 1
    } else {
        bEnd = bStart + b.size
    }

    if ((aStart <= bStart && aEnd > bStart) || (aStart <= bEnd && aEnd > bEnd)) {
        return true
    } else {
        return false
    }
}

export class BusPort extends Port<number> {
    mappings: BusMapping[] = []

    constructor(name: string, side: Side, slot: number, public bitSize: number) {
        super(name, side, slot)
    }

    linkToBus(bus: Bus, offset: number = 0, range?: SubRange): boolean {
        let size: number
        if (range) {
            size = range[1] - range[0]
        } else {
            size = bus.size
        }

        const endBit = offset + size

        // check if bus is overlapping others
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (offset <= mapping.bit && endBit > mapping.bit) {
                    return false
                }
            } else if (isBusMapping(mapping)) {
                const otherEnd = mapping.bit + mapping.size
                if ((offset <= mapping.bit && endBit > mapping.bit) || (offset <= otherEnd && endBit > otherEnd)) {
                    return false
                }
            }
        }
        this.mappings.push({
            type: 'bus',
            bit: offset,
            bus,
            offset: range ? range[0] : 0,
            size,
        })
        this.sortMappings()
        this.emit('change')

        return true
    }

    linkToPort(port: BinaryPort, bit: number): LinkReason {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (bit == mapping.bit) {
                    return LinkReason.Occupied
                }
            } else if (isBusMapping(mapping)) {
                if (bit >= mapping.bit && bit < mapping.bit + mapping.size) {
                    return LinkReason.Occupied
                }
            }
        }

        const localPort = new VirtualPort(this, bit)
        let result = localPort.linkTo(port)
        if (result == LinkReason.NoInput) {
            // TODO: do we need to doubly linked these ports?
            // reverse it because we are bi directional
            result = port.linkTo(localPort)
        }
        if (result != LinkReason.Success) {
            return result
        }

        this.mappings.push({
            type: 'port',
            bit,
            port,
            vPort: localPort,
        })
        this.sortMappings()
        this.emit('change')

        return LinkReason.Success
    }

    unlinkToPort(port: BinaryPort, bit: number, doUnlink = true): boolean {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (mapping.port === port && mapping.bit === bit) {
                    const index = this.mappings.indexOf(mapping)
                    if (index >= 0) {
                        this.mappings.splice(index, 1)
                        if (doUnlink) {
                            port.unlinkTo(mapping.vPort)
                            mapping.vPort.unlinkTo(port)
                        }
                        this.sortMappings()
                        this.emit('change')

                        return true
                    } else {
                        return false
                    }
                }
            }
        }
        return false
    }

    unlinkToBus(bus: Bus, bit: number): boolean {
        for (const mapping of this.mappings) {
            if (isBusMapping(mapping)) {
                if (mapping.bus === bus && mapping.bit === bit) {
                    const index = this.mappings.indexOf(mapping)
                    if (index >= 0) {
                        this.mappings.splice(index, 1)
                        this.sortMappings()
                        this.emit('change')

                        return true
                    } else {
                        return false
                    }
                }
            }
        }
        return false
    }

    isBitOccupied(bit: number): boolean {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (bit == mapping.bit) {
                    return true
                }
            } else if (isBusMapping(mapping)) {
                if (bit >= mapping.bit && bit < mapping.bit + mapping.size) {
                    return true
                }
            }
        }
        return false
    }

    getConnectedPort(bit: number): BinaryPort | null {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (bit == mapping.bit) {
                    return mapping.port
                }
            }
        }
        return null
    }

    getConnectedBus(bit: number): Bus | null {
        for (const mapping of this.mappings) {
            if (isBusMapping(mapping)) {
                if (bit == mapping.bit) {
                    return mapping.bus
                }
            }
        }
        return null
    }

    assertValue(value: number) {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (value & (1 << mapping.bit)) {
                    mapping.vPort.assertValue(true)
                } else {
                    mapping.vPort.assertValue(false)
                }
            } else if (isBusMapping(mapping)) {
                let maskedValue = value >> mapping.bit
                maskedValue = maskedValue & ((1 << mapping.size) - 1)
                if (mapping.offset > 0 || mapping.size !== mapping.bus.size) {
                    maskedValue <<= mapping.offset
                    const invertedMask = ~(((1 << mapping.size) - 1) << mapping.offset)
                    mapping.bus.value = (mapping.bus.value & invertedMask) | maskedValue
                } else {
                    mapping.bus.value = maskedValue
                }
            }
        }
    }

    getValue(): number {
        let value = 0
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                const input = mapping.port.getValue()
                if (input) {
                    value |= 1 << mapping.bit
                }
            } else if (isBusMapping(mapping)) {
                if (mapping.offset > 0 || mapping.size !== mapping.bus.size) {
                    const mask = ((1 << mapping.size) - 1) << mapping.offset
                    let incomingValue = mapping.bus.value & mask
                    incomingValue >>= mapping.offset
                    value |= incomingValue << mapping.bit
                } else {
                    value |= (mapping.bus.value & ((1 << mapping.bus.size) - 1)) << mapping.bit
                }
            }
        }
        return value
    }

    size(): number {
        return 2
    }

    glyph(): string {
        return 'B'
    }

    destroy(): void {
        const mappings = this.mappings
        this.mappings = []
        for (const mapping of mappings) {
            if (isPortMapping(mapping)) {
                mapping.vPort.destroy()
            }
        }
    }

    private sortMappings(): void {
        this.mappings.sort((a, b) => a.bit - b.bit)
    }
}

export class VirtualPort extends BinaryPort {
    value: boolean = false

    constructor(private busPort: BusPort, private bit: number) {
        super('virtual', Side.Virtual, 0)
        this.on('unlink', this.onUnlink)
    }

    canInput(): boolean {
        return true
    }

    canOutput(): boolean {
        return true
    }

    assertValue(value: boolean) {
        this.value = value
    }

    getValue(): boolean {
        return this.value
    }

    glyph(): string {
        return 'v'
    }

    private onUnlink = (port: BinaryPort, input: boolean) => {
        this.busPort.unlinkToPort(port, this.bit, false)
    }
}
