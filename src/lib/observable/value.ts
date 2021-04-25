export type Observer<T> = (value: T) => void

export class ObservableValue<T> {
    private observers: Observer<T>[] = []

    private notify(): void {
        for (const observer of this.observers) {
            observer(this.value)
        }
    }

    constructor(private value: T) {}

    set(value: T): void {
        this.value = value
        this.notify()
    }

    get(): T {
        return this.value
    }

    addObserver(observer: Observer<T>): void {
        this.observers.push(observer)
    }

    removeObserver(observer: Observer<T>): void {
        const index = this.observers.indexOf(observer)
        if (index >= 0) {
            this.observers.splice(index, 1)
        }
    }
}
