import React, { FC, useCallback, useState } from 'react'
import { ComponentTray } from '../components/ComponentTray'
import { Drawer } from '../components/Drawer'
import { Toolbar } from '../components/Toolbar/Toolbar'
import { createWorksheet, WorksheetProvider } from '../lib/worksheet'
import { BusEditorWindow } from '../windows/BusEditorWindow'
import { Canvas } from './canvas'

export const Layout: FC = () => {
    const [activeWorksheet, setActiveWorksheet] = useState(createWorksheet())
    const [busWindowVisible, setBusWindowVisible] = useState(false)

    const showBusesWindow = useCallback(() => {
        setBusWindowVisible(true)
    }, [])
    const hideBusesWindow = useCallback(() => {
        setBusWindowVisible(false)
    }, [])

    const windows: React.ReactNode[] = []
    if (busWindowVisible) {
        windows.push(<BusEditorWindow onClose={hideBusesWindow} />)
    }

    return (
        <WorksheetProvider value={activeWorksheet}>
            <div className='main-layout'>
                <Toolbar onBusesClick={showBusesWindow} />
                <div className='inner'>
                    <Drawer>
                        <ComponentTray />
                    </Drawer>
                    <Canvas />
                </div>
                {windows}
            </div>
        </WorksheetProvider>
    )
}
