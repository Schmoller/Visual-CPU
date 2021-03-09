import { Port } from './port'

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

    getPortLocation(port: Port): [number, number] {
        let x: number
        let y: number

        switch (port.side) {
            case 'top':
                x = this.x + PortSize + PortSpacing + port.slot * (PortSize + PortSpacing)
                y = this.y - PortSize / 2
                break
            case 'bottom':
                x = this.x + PortSize + PortSpacing + port.slot * (PortSize + PortSpacing)
                y = this.y + this.height - PortSize / 2
                break

            case 'left':
                y = this.y + PortSpacing + port.slot * (PortSize + PortSpacing)
                x = this.x - PortSize / 2
                break
            case 'right':
                y = this.y + PortSpacing + port.slot * (PortSize + PortSpacing)
                x = this.x + this.width - PortSize / 2
                break
        }

        return [x, y]
    }
}
