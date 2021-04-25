import React, { FC, useCallback, useState } from 'react'
import { useClock } from '../../lib/clock'
import { useObservableValue } from '../../lib/observable'
import { Button, ButtonBar } from '../Topcoat'

export interface ToolbarProps {
    onNewClick?: () => void
    onBusesClick?: () => void
}
export const Toolbar: FC<ToolbarProps> = ({ onNewClick, onBusesClick }) => {
    const clock = useClock()
    const isClockRunning = useObservableValue(clock.isRunning)

    const doClockStop = useCallback(() => {
        clock.stop()
    }, [clock])
    const doClockStart = useCallback(() => {
        clock.run()
    }, [clock])
    const doClockStep = useCallback(() => {
        clock.step()
    }, [clock])

    return (
        <div className='toolbar'>
            <Button text='New' large onClick={onNewClick} />
            <Button text='Buses' large onClick={onBusesClick} />
            <ButtonBar large>
                <Button text={isClockRunning ? 'Stop' : 'Run'} onClick={isClockRunning ? doClockStop : doClockStart} />
                <Button text='Step' onClick={doClockStep} />
            </ButtonBar>
        </div>
    )
}
