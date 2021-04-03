import React, { useRef } from 'react'
import './style/style'
import { Layout } from './views/Layout'
import { EditorContext, EditorState } from './lib/editor'
import { WindowContainer, WindowContext } from './components/Window/Container'

function App() {
    const editorState = useRef<EditorState>({
        placementComponent: null,
    })
    const windowContainer = useRef<HTMLDivElement>(null)

    return (
        <EditorContext.Provider value={editorState.current}>
            <WindowContext.Provider value={windowContainer}>
                <Layout />
                <WindowContainer />
            </WindowContext.Provider>
        </EditorContext.Provider>
    )
}

export default App
