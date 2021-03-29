import React, { FC, useState } from 'react'
import { ComponentTray } from '../components/ComponentTray'
import { Drawer } from '../components/Drawer'
import { Toolbar } from '../components/Toolbar/Toolbar'
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
        </div>
    )
}
