import React, { FC, useCallback, useState } from 'react'
import { Button, ColorButton, Textbox } from '../../components/Topcoat'
import { Window } from '../../components/Window/Window'
import { Bus } from '../../lib/bus'
import { MaxBusSize, MinBusSize } from '../../lib/config'
import { useObservableArray } from '../../lib/observable'
import { useActiveWorksheet } from '../../lib/worksheet'
import { BusRow } from './BusRow'

export interface BusEditorWindowProps {
    onClose?: () => void
}

export const BusEditorWindow: FC<BusEditorWindowProps> = ({ onClose }) => {
    const worksheet = useActiveWorksheet()

    const [addColor, setAddColor] = useState<string>('red')
    const [addName, setAddName] = useState<string>('')
    const [addSize, setAddSize] = useState<number>(8)
    const [addRawSize, setAddRawSize] = useState<string>('8')

    const buses = useObservableArray(worksheet.definedBuses)

    const doAdd = useCallback(() => {
        const trimmedName = addName.trim()
        if (trimmedName.length === 0) {
            return
        }

        const bus = new Bus(addSize, trimmedName, addColor)
        worksheet.definedBuses.push(bus)

        setAddName('')
        setAddSize(8)
        setAddRawSize('8')
        setAddColor('red')
    }, [addSize, addName, addColor, worksheet])

    const doDelete = useCallback(
        (bus: Bus) => {
            const index = worksheet.definedBuses.indexOf(bus)
            if (index >= 0) {
                worksheet.definedBuses.splice(index, 1)
            }
        },
        [worksheet],
    )

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAddName(event.currentTarget.value)
    }, [])

    const handleSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value
        if (value.match(/^[0-9]*$/)) {
            setAddRawSize(value)
        }
    }, [])

    const handleSizeBlur = useCallback(() => {
        if (addRawSize.match(/^[0-9]+$/)) {
            let value = parseInt(addRawSize)
            value = Math.max(value, MinBusSize)
            value = Math.min(value, MaxBusSize)

            setAddSize(value)
            setAddRawSize(value.toFixed(0))
        } else {
            setAddRawSize(addSize.toFixed(0))
        }
    }, [addRawSize, addSize])

    return (
        <Window title='Bus Editor' initialX={100} initialY={100} initialWidth={'auto'} initialHeight='auto' allowResize>
            <table className='table'>
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Size</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <ColorButton color={addColor} onChange={setAddColor} />
                        </td>
                        <td>
                            <Textbox value={addName} onValueChange={handleNameChange} />
                        </td>
                        <td>
                            <Textbox onValueChange={handleSizeChange} onBlur={handleSizeBlur} value={addRawSize} />
                        </td>
                        <td className='text-right'>
                            <Button text='Add' variant='cta' onClick={doAdd} />
                        </td>
                    </tr>
                    {buses.map(bus => (
                        <BusRow key={bus.name} bus={bus} onDelete={() => doDelete(bus)} />
                    ))}
                </tbody>
            </table>
            <div className='window-controls'>
                <Button text='Close' onClick={onClose} />
            </div>
        </Window>
    )
}
