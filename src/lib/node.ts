import { ComponentClass, FunctionComponent, ReactElement, ReactNode } from 'react'
import { Point } from './common'
import { PortLink } from './link'
import { Port, Side, BinaryPort, BusPort, LinkReason } from './ports'

export const PortSize = 15
export const PortSpacing = 5
export interface NodeDisplayProps<T extends Node> {
    node: T
}
export interface NodeSettingsProps<T extends Node> {
    node: T
    onClose: () => void
}

export interface Node {
    x: number
    y: number
    width: number
    height: number

    ports: Port[]
}

export class Node {
    displayComponent: FunctionComponent<NodeDisplayProps<any>> | ComponentClass<NodeDisplayProps<any>> | null = null
    settingsComponent: FunctionComponent<NodeSettingsProps<any>> | ComponentClass<NodeSettingsProps<any>> | null = null

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
            case Side.Virtual:
                x = this.x
                y = this.y
                break
        }

        if (center) {
            x += PortSize / 2
            y += PortSize / 2
        }

        return { x, y }
    }

    destroy() {
        for (const port of this.ports) {
            port.destroy()
        }
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
        if (sourcePortActual instanceof BinaryPort) {
            if (destPortActual instanceof BinaryPort) {
                const reason = sourcePortActual.linkTo(destPortActual)
                if (reason != LinkReason.Success) {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }

        const link = new PortLink([this, sourcePortActual], [destNode, destPortActual])
        sourcePortActual.links.push(link)
        destPortActual.links.push(link)
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
        if (sourcePortActual instanceof BinaryPort) {
            if (destPortActual instanceof BinaryPort) {
                if (!sourcePortActual.unlinkTo(destPortActual)) {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
        const link = sourcePortActual.links.find(link => {
            if (link.src[1] === sourcePortActual && link.dst && link.dst[1] === destPortActual) {
                return true
            } else {
                return false
            }
        })
        if (!link) {
            return false
        }

        let index = sourcePortActual.links.indexOf(link)
        if (index >= 0) {
            sourcePortActual.links.splice(index, 1)
        }
        index = destPortActual.links.indexOf(link)
        if (index >= 0) {
            destPortActual.links.splice(index, 1)
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
            for (const link of port.links) {
                link.recomputePath()
            }
        }
    }

    onClockBegin(): void {}

    onClockEnd(): void {}
}
