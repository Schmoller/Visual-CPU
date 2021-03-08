import { Port } from './port'

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
}
