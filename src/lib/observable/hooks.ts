import { useCallback, useEffect, useState } from 'react'
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
    const [, setForceUpdate] = useState<boolean>(false)

    const onUpdate = useCallback(() => {
        setForceUpdate(value => !value)
    }, [])

    const setValue = useCallback(
        (newValue: T) => {
            value.set(newValue)
        },
        [value],
    )

    useEffect(() => {
        value.addObserver(onUpdate)
        return () => {
            value.removeObserver(onUpdate)
        }
    }, [value, onUpdate])

    return [value.get(), setValue]
}
