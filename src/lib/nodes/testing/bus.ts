import { Node, PortSize, PortSpacing } from '../../node'
import { BusPort, Side } from '../../port'
import { MetaData } from '../common'

export class BusOutputNode extends Node {
    static createExample() {
        return new BusOutputNode(0, 0)
    }

    static metadata(): MetaData {
        return {
            id: 'bus-output-test',
            name: 'Bus output tester',
        }
    }

    constructor(x: number, y: number) {
        super(x, y, 120, PortSize * 2 + PortSpacing * 3)
        this.ports.push(new BusPort('Bus', Side.Right, 0))
    }
}
export class BusDisplayNode extends Node {
    static createExample() {
        return new BusDisplayNode(0, 0)
    }

    static metadata(): MetaData {
        return {
            id: 'bus-display',
            name: 'Bus display',
        }
    }

    constructor(x: number, y: number) {
        super(x, y, 120, PortSize * 2 + PortSpacing * 3)
        this.ports.push(new BusPort('Bus', Side.Left, 0))
    }
}
