import { PortLink } from './link'
import { Node } from './node'

export enum Side {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export abstract class Port {
    inputLink: PortLink | null = null
    outputLinks: PortLink[] = []

    constructor(public name: string, public side: Side, public slot: number) {}

    // Temporary
    abstract glyph(): string
    abstract canConnectInbound(source: Port): boolean
}

export class InputPort extends Port {
    glyph(): string {
        return 'I'
    }

    canConnectInbound(source: Port): boolean {
        if (source instanceof OutputPort) {
            return true
        }
        if (source instanceof BiDiPort) {
            return true
        }

        return false
    }
}

export class OutputPort extends Port {
    glyph(): string {
        return 'O'
    }

    canConnectInbound(source: Port): boolean {
        return false
    }
}

export class BiDiPort extends Port {
    glyph(): string {
        return 'X'
    }

    canConnectInbound(source: Port): boolean {
        return true
    }
}
