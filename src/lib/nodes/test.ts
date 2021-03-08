import { Node } from '../node'

export class TestNode extends Node {
    constructor(x: number, y: number) {
        super(x, y, 120, 60)

        this.ports.push({
            type: 'input',
            linked: null,
            name: 'In 1',
            relX: -5,
            relY: 10,
        })

        this.ports.push({
            type: 'output',
            linked: null,
            name: 'Out 1',
            relX: 120,
            relY: 10,
        })
    }
}
