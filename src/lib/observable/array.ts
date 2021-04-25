export type ArrayObserver<T> = (array: T[], from: number, to: number) => void

export class ObservableArray<T> extends Array<T> {
    private observers: ArrayObserver<T>[] = []
    private notify(from: number, to: number): void {
        for (const observer of this.observers) {
            observer(this, from, to)
        }
    }

    set(index: number, value: T): void {
        this[index] = value
        this.notify(index, index + 1)
    }

    addObserver(observer: ArrayObserver<T>): void {
        this.observers.push(observer)
    }
    removeObserver(observer: ArrayObserver<T>): void {
        const index = this.observers.indexOf(observer)
        if (index >= 0) {
            this.observers.splice(index, 1)
        }
    }

    // Overwriting existing methods

    push(...items: T[]): number {
        const start = this.length
        const length = super.push(...items)
        this.notify(start, length)
        return length
    }

    fill(value: T, start?: number | undefined, end?: number | undefined): this {
        super.fill(value, start, end)
        let from
        let to

        if (start !== undefined) {
            from = start
        } else {
            from = 0
        }
        if (end !== undefined) {
            to = end
        } else {
            to = this.length
        }
        this.notify(from, to)

        return this
    }

    pop(): T | undefined {
        const value = super.pop()
        this.notify(this.length, this.length + 1)
        return value
    }

    shift(): T | undefined {
        const value = super.shift()
        this.notify(0, this.length + 1)
        return value
    }

    sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
        super.sort(compareFn)
        this.notify(0, this.length)
        return this
    }

    splice(start: number, deleteCount?: number): T[]
    splice(start: number, deleteCount: number, ...items: T[]): T[]
    splice(start: number, deleteCount: number | undefined, ...items: T[]): T[] {
        let result: T[] = []

        if (deleteCount !== undefined) {
            result = super.splice(start, deleteCount, ...items)
        } else {
            result = super.splice(start, deleteCount)
        }
        this.notify(start, this.length)
        return result
    }

    unshift(...items: T[]): number {
        const length = super.unshift(...items)
        this.notify(0, length)

        return length
    }
}
