import { BusOutputSettings, BusOutputSettingsWindow } from '../../../windows/BusOutputSettings'
import { Node, PortSize, PortSpacing } from '../../node'
import { Side } from '../../ports'
import { BusPort } from '../../ports/bus'
import { MetaData } from '../common'
import { BusDisplayDisplay, BusOutputDisplay } from './bus_display'

export class BusOutputNode extends Node {
    value: number = 0
    port: BusPort
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
        this.port = new BusPort('Bus', Side.Right, 0, 8)
        this.ports.push(this.port)

        this.displayComponent = BusOutputDisplay
        this.settingsComponent = BusOutputSettingsWindow
    }

    onClockBegin() {
        this.port.assertValue(this.value)
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
        this.ports.push(new BusPort('Bus', Side.Left, 0, 8))
        this.displayComponent = BusDisplayDisplay
    }
}
