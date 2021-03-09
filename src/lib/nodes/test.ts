import { Node } from '../node'
import { BiDiPort, InputPort, OutputPort, Side } from '../port'

export class TestNode extends Node {
    constructor(x: number, y: number) {
        super(x, y, 120, 60)

        this.ports.push(new InputPort('In 1', Side.Left, 0))
        this.ports.push(new InputPort('In 2', Side.Left, 1))
        this.ports.push(new InputPort('In 3', Side.Left, 2))

        this.ports.push(new OutputPort('Out 1', Side.Right, 0))
        this.ports.push(new OutputPort('Out 2', Side.Right, 1))

        this.ports.push(new BiDiPort('BiDi 1', Side.Top, 0))
        this.ports.push(new BiDiPort('BiDi 2', Side.Bottom, 0))
    }
}
