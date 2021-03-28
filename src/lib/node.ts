import { Point } from './common'
import { PortLink } from './link'
import { Port, Side } from './port'

export const PortSize = 15
export const PortSpacing = 5

export interface Node {
    x: number
    y: number
    width: number
    height: number

    ports: Port[]
}

export class Node {
    constructor(public x: number, public y: number, public width: number, public height: number) {
        this.ports = []
    }

    getPortLocation(port: Port, center = false): Point {
        let x: number
        let y: number

        switch (port.side) {
            case Side.Top:
                x = this.x + PortSize + PortSpacing + port.slot * (PortSize + PortSpacing)
                y = this.y - PortSize / 2
                break
            case Side.Bottom:
                x = this.x + PortSize + PortSpacing + port.slot * (PortSize + PortSpacing)
                y = this.y + this.height - PortSize / 2
                break

            case Side.Left:
                y = this.y + PortSpacing + port.slot * (PortSize + PortSpacing)
                x = this.x - PortSize / 2
                break
            case Side.Right:
                y = this.y + PortSpacing + port.slot * (PortSize + PortSpacing)
                x = this.x + this.width - PortSize / 2
                break
        }

        if (center) {
            x += PortSize / 2
            y += PortSize / 2
        }

        return { x, y }
    }

    link(sourcePort: string, destNode: Node, destPort: string): PortLink | null
    link(sourcePort: Port, destNode: Node, destPort: Port): PortLink | null
    link(sourcePort: string | Port, destNode: Node, destPort: string | Port): PortLink | null {
        let sourcePortActual: Port | null
        if (typeof sourcePort === 'string') {
            sourcePortActual = this.getPort(sourcePort)
        } else {
            sourcePortActual = sourcePort
        }
        let destPortActual: Port | null
        if (typeof destPort === 'string') {
            destPortActual = destNode.getPort(destPort)
        } else {
            destPortActual = destPort
        }

        if (!sourcePortActual || !destPortActual) {
            return null
        }
        if (!destPortActual.canConnectInbound(sourcePortActual)) {
            return null
        }
        if (destPortActual.inputLink) {
            return null
        }

        const link = new PortLink([this, sourcePortActual], [destNode, destPortActual])
        destPortActual.inputLink = link
        sourcePortActual.outputLinks.push(link)
        return link
    }

    unlink(sourcePort: Port, destNode: Node, destPort: Port): boolean
    unlink(sourcePort: string, destNode: Node, destPort: string): boolean
    unlink(sourcePort: string | Port, destNode: Node, destPort: string | Port): boolean {
        let sourcePortActual: Port | null
        if (typeof sourcePort === 'string') {
            sourcePortActual = this.getPort(sourcePort)
        } else {
            sourcePortActual = sourcePort
        }
        let destPortActual: Port | null
        if (typeof destPort === 'string') {
            destPortActual = destNode.getPort(destPort)
        } else {
            destPortActual = destPort
        }

        if (!sourcePortActual || !destPortActual) {
            return false
        }
        const link = destPortActual.inputLink
        if (!link) {
            return false
        }
        if (link.src[0] != this || link.src[1] != sourcePortActual) {
            return false
        }

        destPortActual.inputLink = null
        const index = sourcePortActual.outputLinks.indexOf(link)
        if (index >= 0) {
            sourcePortActual.outputLinks.splice(index, 1)
        }
        return true
    }

    getPort(name: string): Port | null {
        for (const port of this.ports) {
            if (port.name === name) {
                return port
            }
        }

        return null
    }

    updateLinks() {
        for (const port of this.ports) {
            for (const link of port.outputLinks) {
                link.recomputePath()
            }
            if (port.inputLink) {
                port.inputLink.recomputePath()
            }
        }
    }
}
