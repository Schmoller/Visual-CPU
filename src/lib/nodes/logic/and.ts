import { Node, PortSize, PortSpacing } from '../../node'
import { BusPort, Side } from '../../ports'
import { MetaData } from '../common'

export class AndNode extends Node {
    inputA: BusPort
    inputB: BusPort
    output: BusPort

    static createExample() {
        return new AndNode(0, 0)
    }

    static metadata(): MetaData {
        return {
            id: 'logic-and',
            name: 'And',
        }
    }

    constructor(x: number, y: number) {
        super(x, y, 120, PortSize * 4 + PortSpacing * 5)
        this.inputA = new BusPort('A', Side.Left, 0, 8)
        this.inputB = new BusPort('B', Side.Left, 2, 8)
        this.output = new BusPort('Output', Side.Right, 0, 8)

        this.ports.push(this.inputA, this.inputB, this.output)
    }

    onClockBegin(): void {
        const a = this.inputA.getValue()
        const b = this.inputB.getValue()
        this.output.assertValue(a & b)
    }
}
