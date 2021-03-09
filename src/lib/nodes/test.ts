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
            type: 'input',
            link: null,
            reverseLink: null,
            name: 'In 2',
            slot: 1,
            side: 'left',
        })
        this.ports.push({
            type: 'input',
            link: null,
            reverseLink: null,
            name: 'In 3',
            slot: 2,
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
        this.ports.push({
            type: 'output',
            link: null,
            reverseLink: null,
            name: 'Out 2',
            slot: 1,
            side: 'right',
        })
        this.ports.push({
            type: 'bidi',
            link: null,
            reverseLink: null,
            name: 'BiDi 1',
            slot: 0,
            side: 'top',
        })
        this.ports.push({
            type: 'bidi',
            link: null,
            reverseLink: null,
            name: 'BiDi 2',
            slot: 0,
            side: 'bottom',
        })
    }
}
