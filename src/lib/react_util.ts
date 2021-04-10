import { useCallback, useMemo, useState } from 'react'

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
