import { Node, PortSize, PortSpacing } from '../../node'
import { BusPort, Side } from '../../ports'
import { MetaData } from '../common'

export class NotNode extends Node {
    input: BusPort
    output: BusPort

    static createExample() {
        return new NotNode(0, 0)
    }

    static metadata(): MetaData {
        return {
            id: 'logic-not',
            name: 'Inverter',
        }
    }

    constructor(x: number, y: number) {
        super(x, y, 120, PortSize * 2 + PortSpacing * 3)
        this.input = new BusPort('Input', Side.Left, 0, 8)
        this.output = new BusPort('Output', Side.Right, 0, 8)

        this.ports.push(this.input, this.output)
    }

    onClockBegin(): void {
        const value = this.input.getValue()
        this.output.assertValue(~value)
    }
}
