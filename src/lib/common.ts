import { Side } from './ports'

export interface Point {
    x: number
    y: number
}

export function offsetPoint(point: Point, dir: Side, amount: number): Point {
    switch (dir) {
        case Side.Bottom:
            return { x: point.x, y: point.y + amount }
        case Side.Top:
            return { x: point.x, y: point.y - amount }
        case Side.Left:
            return { x: point.x - amount, y: point.y }
        case Side.Right:
            return { x: point.x + amount, y: point.y }
        case Side.Virtual:
            return { x: point.x, y: point.y }
    }
}
