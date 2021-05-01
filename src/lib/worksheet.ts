import { Bus } from './bus'
import { ObservableArray } from './observable'
import { createContext, useContext } from 'react'
import { Node } from './node'

export interface Worksheet {
    definedBuses: ObservableArray<Bus>
    nodes: ObservableArray<Node>
}

export function createWorksheet(): Worksheet {
    return {
        definedBuses: new ObservableArray(),
        nodes: new ObservableArray(),
    }
}

const WorksheetContext = createContext(createWorksheet())

export function useActiveWorksheet() {
    return useContext(WorksheetContext)
}
export const WorksheetProvider = WorksheetContext.Provider
