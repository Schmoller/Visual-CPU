export interface Node {
    x: number
    y: number
    width: number
    height: number
}

export class Node {
    constructor(public x: number, public y: number, public width: number, public height: number) {}
}
