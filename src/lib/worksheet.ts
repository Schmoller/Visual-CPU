import { Bus } from './bus'
import { ObservableArray } from './observable'
import { createContext, useContext } from 'react'

export interface Worksheet {
    definedBuses: ObservableArray<Bus>
}

export function createWorksheet(): Worksheet {
    return {
        definedBuses: new ObservableArray(),
    }
}

const WorksheetContext = createContext(createWorksheet())

export function useActiveWorksheet() {
    return useContext(WorksheetContext)
}
export const WorksheetProvider = WorksheetContext.Provider
