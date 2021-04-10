import { offsetPoint, Point } from './common'
import { Node, PortSize, PortSpacing } from './node'
import { Port } from './ports'

export class PortLink {
    middlePoints: Point[] = []

    constructor(public src: [Node, Port], public dst: [Node, Port] | null = null) {}

    recomputePath(avoid: Node[] = []): void {
        this.middlePoints = []
        if (!this.dst) {
            return
        }

        const start = this.src[0].getPortLocation(this.src[1], true)
        const end = this.dst[0].getPortLocation(this.dst[1], true)

        let offsetStart: Point = offsetPoint(start, this.src[1].side, PortSize + PortSpacing)
        let offsetEnd: Point = offsetPoint(end, this.dst[1].side, PortSize + PortSpacing)

        // const direction: Point = { x: Math.sign(end.x - start.x), y: Math.sign(end.y - start.y) }
        // const magnitude: Point = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) }
        // console.log(avoid)

        this.middlePoints.push(offsetStart)
        const midPoint = squareMidpoint(offsetStart, offsetEnd)
        // if (midPoint) {
        //     for (const node of avoid) {
        //         if (
        //             (midPoint.x >= node.x || midPoint.x <= node.x + node.width) &&
        //             (offsetStart.x >= node.x || offsetStart.x <= node.x + node.width)
        //         ) {
        //             if (offsetStart.y < node.y && midPoint.y > node.y) {
        //                 console.log('below', offsetStart.y, node.y)
        //             } else if (offsetStart.y > node.y && midPoint.y < node.y) {
        //                 console.log('above', offsetStart.y, node.y)
        //             } else {
        //                 console.log(offsetStart.y, node.y, midPoint.y)
        //             }
        //         }
        //         if (midPoint.y >= node.y || midPoint.y <= node.y + node.height) {
        //         }
        //     }
        // }

        if (midPoint) {
            this.middlePoints.push(midPoint)
        }
        this.middlePoints.push(offsetEnd)
    }

    splitSegment(start: number, end: number, position: 'left' | 'right') {
        if (start < 0) {
            return false
        }
        if (end < start) {
            return false
        }
        if (this.end != null) {
            if (end > this.middlePoints.length + 2) {
                return false
            }
        } else {
            if (end > this.middlePoints.length + 1) {
                return false
            }
        }

        let startPoint: Point
        let endPoint: Point
        if (start == 0) {
            startPoint = this.start
        } else {
            startPoint = this.middlePoints[start - 1]
        }
        if (this.end != null && end == this.middlePoints.length + 2) {
            endPoint = this.end
        } else {
            endPoint = this.middlePoints[end - 1]
        }

        const midPoint = { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 }
        this.middlePoints.splice(start - 1, 0, midPoint)
        return true
    }

    get start(): Point {
        return this.src[0].getPortLocation(this.src[1], true)
    }
    get end(): Point | null {
        if (this.dst) {
            return this.dst[0].getPortLocation(this.dst[1], true)
        } else {
            return null
        }
    }
}

function squareMidpoint(start: Point, end: Point): Point | null {
    const magnitude: Point = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) }

    if (magnitude.x > magnitude.y) {
        // Horizontal first
        if (magnitude.y == 0) {
            // Direct line to
            return null
        }

        return { x: end.x, y: start.y }
    } else {
        // Vertical first
        if (magnitude.x == 0) {
            // Direct line to
            return null
        }

        return { x: start.x, y: end.y }
    }
}
