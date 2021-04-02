import React, { FC, useState } from 'react'
import { ComponentTray } from '../components/ComponentTray'
import { Drawer } from '../components/Drawer'
import { Toolbar } from '../components/Toolbar/Toolbar'
import { Window } from '../components/Window/Window'
import { Canvas } from './canvas'

export const Layout: FC = () => {
    return (
        <div className='main-layout'>
            <Toolbar />
            <div className='inner'>
                <Drawer>
                    <ComponentTray />
                </Drawer>
                <Canvas />
            </div>
            <Window initialX={100} initialY={300} initialWidth={250} initialHeight={250} title='Test window'>
                This is the body of the window
            </Window>
        </div>
    )
}
