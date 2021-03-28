import React, { FC, useState } from 'react'
import { Toolbar } from '../components/Toolbar/Toolbar'
import { Canvas } from './canvas'

export const Layout: FC = () => {
    return (
        <div className='main-layout'>
            <Toolbar />
            <Canvas />
        </div>
    )
}
