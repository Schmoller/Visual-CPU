import EventEmitter from 'node:events'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

type PushDispatch<T> = (...values: T[]) => void
type RemoveDispatch<T> = (value: T) => void

export function useStateArray<T>(initialValue: T[] = []): [T[], PushDispatch<T>, RemoveDispatch<T>] {
    const array = useMemo<T[]>(() => [...initialValue], [])
    const [, setForceUpdate] = useState(false)

    const pushValue = useCallback((...value: T[]) => {
        array.push(...value)
        setForceUpdate(b => !b)
    }, [])

    const removeValue = useCallback((value: T) => {
        const index = array.indexOf(value)
        if (index >= 0) {
            array.splice(index, 1)
            setForceUpdate(b => !b)
        }
    }, [])

    return [array, pushValue, removeValue]
}

export function useForceUpdate(): () => void {
    return useReducer(() => ({}), {})[1] as () => void
}

export function useUpdateOnChange(item: EventEmitter): void {
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        item.on('change', forceUpdate)
        return () => {
            item.off('change', forceUpdate)
        }
    }, [item, forceUpdate])
}
