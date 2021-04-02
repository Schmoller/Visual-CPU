import { createContext, useContext } from 'react'

export interface EditorState {
    placementComponent: string | null
}

export const EditorContext = createContext<EditorState>({
    placementComponent: null,
})

export function useEditorState(): EditorState {
    return useContext(EditorContext)
}
