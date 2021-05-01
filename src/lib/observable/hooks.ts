import { useCallback, useEffect, useState } from 'react'
import { useForceUpdate } from '../react_util'
import { ObservableArray } from './array'
import { ObservableValue } from './value'

export function useObservableArray<T>(value: ObservableArray<T>): T[] {
    const [mirror, setMirror] = useState<T[]>(value)

    const onUpdate = useCallback((array: T[], from: number, to: number) => {
        setMirror([...array])
    }, [])

    useEffect(() => {
        value.addObserver(onUpdate)
        return () => {
            value.removeObserver(onUpdate)
        }
    }, [value, onUpdate])

    return mirror
}
export function useObservableValue<T>(value: ObservableValue<T>): [T, React.Dispatch<T>] {
    const forceUpdate = useForceUpdate()
    const setValue = useCallback(
        (newValue: T) => {
            value.set(newValue)
        },
        [value],
    )

    useEffect(() => {
        value.addObserver(forceUpdate)
        return () => {
            value.removeObserver(forceUpdate)
        }
    }, [value, forceUpdate])

    return [value.get(), setValue]
}
