import { EventEmitter } from 'events'
import { PortLink } from '../link'

export enum Side {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
    Virtual = 'virtual',
}

export enum LinkReason {
    Success,
    NoInput,
    NoOutput,
    Occupied,
}

export abstract class Port<T = boolean | number> extends EventEmitter {
    // links are just visual, actual connections are through outputs and input
    links: PortLink[] = []

    constructor(public name: string, public side: Side, public slot: number) {
        super()
    }

    abstract destroy(): void

    assertValue(value: T) {}

    getValue(): T {
        throw new Error('operation not supported')
    }

    // Temporary
    abstract glyph(): string
    size(): number {
        return 1
    }
}

/**
 * a port that has an on or off state
 */
export abstract class BinaryPort extends Port<boolean> {
    outputs: BinaryPort[] = []
    input: BinaryPort | null = null

    abstract canInput(): boolean
    abstract canOutput(): boolean

    /**
     * links this port to another port
     * @param port the port to link to from our output to their input
     * @returns a reason which could be an error or success code
     */
    linkTo(port: BinaryPort): LinkReason {
        if (!this.canOutput()) {
            return LinkReason.NoOutput
        }
        if (!port.canInput()) {
            return LinkReason.NoInput
        }
        if (port.input) {
            return LinkReason.Occupied
        }

        port.input = this
        this.outputs.push(port)

        port.emit('link', this, true)
        this.emit('link', port, false)

        return LinkReason.Success
    }

    unlinkTo(port: BinaryPort): boolean {
        if (port.input !== this) {
            return false
        }

        port.input = null
        const index = this.outputs.indexOf(port)
        if (index >= 0) {
            this.outputs.splice(index, 1)
        }

        port.emit('unlink', this, true)
        this.emit('unlink', port, false)

        return true
    }

    destroy(): void {
        for (const port of this.outputs) {
            if (port instanceof BinaryPort) {
                if (port.input !== this) {
                    continue
                }

                port.input = null

                port.emit('unlink', this, true)
                this.emit('unlink', port, false)
            }
        }
        if (this.input) {
            this.input.unlinkTo(this)
        }
        this.input = null
        this.outputs = []
    }
}
