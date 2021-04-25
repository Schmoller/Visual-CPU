import EventEmitter from 'events'

export class Bus extends EventEmitter {
    value: number = 0

    constructor(private _size: number, private _name: string, private _color: string) {
        super()
    }

    get size(): number {
        return this._size
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
        this.emit('change')
    }

    get color(): string {
        return this._color
    }

    set color(value: string) {
        this._color = value
        this.emit('change')
    }
}
