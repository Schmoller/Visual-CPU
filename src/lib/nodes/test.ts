import { Node } from '../node'

export class TestNode extends Node {
    constructor(x: number, y: number) {
        super(x, y, 120, 60)

        this.ports.push({
            type: 'input',
            link: null,
            reverseLink: null,
            name: 'In 1',
            slot: 0,
            side: 'left',
        })

        this.ports.push({
            type: 'output',
            link: null,
            reverseLink: null,
            name: 'Out 1',
            slot: 0,
            side: 'right',
        })
    }
}
