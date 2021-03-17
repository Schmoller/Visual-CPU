export interface Point {
    x: number
    y: number
}

export function offsetPoint(point: Point, dir: 'top' | 'bottom' | 'left' | 'right', amount: number): Point {
    switch (dir) {
        case 'bottom':
            return { x: point.x, y: point.y + amount }
        case 'top':
            return { x: point.x, y: point.y - amount }
        case 'left':
            return { x: point.x - amount, y: point.y }
        case 'right':
            return { x: point.x + amount, y: point.y }
    }
}
