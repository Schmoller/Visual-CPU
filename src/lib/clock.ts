import EventEmitter from 'events'
import { createContext, useContext, useEffect } from 'react'
import { ObservableValue } from './observable'
import { createWorksheet, Worksheet } from './worksheet'
import { useForceUpdate } from './react_util'

export class Clock extends EventEmitter {
    isRunning: ObservableValue<boolean>
    clockDelay: number = 10

    private timerTask: NodeJS.Timeout | null = null

    constructor(public activeWorksheet: Worksheet) {
        super()

        this.isRunning = new ObservableValue<boolean>(false)
    }

    run(): boolean {
        if (this.isRunning.get()) {
            return false
        }
        this.timerTask = setInterval(this._step, this.clockDelay)
        this.isRunning.set(true)
        return true
    }

    stop(): boolean {
        if (!this.isRunning.get()) {
            return false
        }

        clearInterval(this.timerTask!)
        this.isRunning.set(false)
        return true
    }

    step() {
        if (this.isRunning.get()) {
            this.stop()
        }
        this._step()
    }

    private _step = () => {
        for (const node of this.activeWorksheet.nodes) {
            node.onClockBegin()
        }
        for (const node of this.activeWorksheet.nodes) {
            node.onClockEnd()
        }
        this.emit('clock')
    }
}
const clockContext = createContext<Clock>(new Clock(createWorksheet()))

export const ClockProvider = clockContext.Provider

export function useClock(): Clock {
    return useContext(clockContext)
}

export function useUpdateAfterClock() {
    const forceUpdate = useForceUpdate()
    const clock = useClock()

    useEffect(() => {
        clock.on('clock', forceUpdate)
        return () => {
            clock.off('clock', forceUpdate)
        }
    }, [clock, forceUpdate])
}
