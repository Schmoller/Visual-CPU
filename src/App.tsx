import React, { useRef } from 'react'
import './style/style'
import { Layout } from './views/Layout'
import { EditorContext, EditorState } from './lib/editor'

function App() {
    const editorState = useRef<EditorState>({
        placementComponent: null,
    })

    return (
        <EditorContext.Provider value={editorState.current}>
            <Layout />
        </EditorContext.Provider>
    )
}

export default App
