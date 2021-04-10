import { Bus } from '../bus'
import { BinaryPort, LinkReason, Port, Side } from './common'

interface BusMappingForPort {
    type: 'port'
    bit: number

    port: Port
    vPort: VirtualPort
}

interface BusMappingForBus {
    type: 'bus'
    bit: number

    bus: Bus
}

export type BusMapping = BusMappingForPort | BusMappingForBus

export function isPortMapping(mapping: BusMapping): mapping is BusMappingForPort {
    return mapping.type === 'port'
}

export function isBusMapping(mapping: BusMapping): mapping is BusMappingForBus {
    return mapping.type === 'bus'
}

export class BusPort extends Port<number> {
    mappings: BusMapping[] = []

    constructor(name: string, side: Side, slot: number, public bitSize: number) {
        super(name, side, slot)
    }

    linkToBus(bus: Bus, offset: number = 0): boolean {
        const endBit = offset + bus.size

        // check if bus is overlapping others
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (offset <= mapping.bit && endBit > mapping.bit) {
                    return false
                }
            } else if (isBusMapping(mapping)) {
                const otherEnd = mapping.bit + mapping.bus.size
                if ((offset <= mapping.bit && endBit > mapping.bit) || (offset <= otherEnd && endBit > otherEnd)) {
                    return false
                }
            }
        }
        this.mappings.push({
            type: 'bus',
            bit: offset,
            bus,
        })

        return true
    }

    linkToPort(port: BinaryPort, bit: number): LinkReason {
        for (const mapping of this.mappings) {
            if (isPortMapping(mapping)) {
                if (bit == mapping.bit) {
                    return LinkReason.Occupied
                }
            } else if (isBusMapping(mapping)) {
                if (bit >= mapping.bit && bit < mapping.bit + mapping.bus.size) {
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

                        return true
                    } else {
                        return false
                    }
                }
            }
        }
        return false
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
                maskedValue = maskedValue & ((1 << mapping.bus.size) - 1)
                mapping.bus.value = maskedValue
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
                value |= (mapping.bus.value & ((1 << mapping.bus.size) - 1)) << mapping.bit
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
