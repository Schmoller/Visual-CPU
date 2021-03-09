import { Node } from './node'

export enum Side {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export abstract class Port {
    linkedFrom: [Node, Port] | null = null

    constructor(public name: string, public side: Side, public slot: number) {}

    linkFrom(node: Node, port: Port): boolean {
        if (this.canConnectInbound(port)) {
            this.linkedFrom = [node, port]
            return true
        }

        return false
    }

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
