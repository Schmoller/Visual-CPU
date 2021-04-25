import React, { FC, useCallback, useState } from 'react'
import { Button, ColorButton, Textbox } from '../../components/Topcoat'
import { Bus } from '../../lib/bus'
import { useUpdateOnChange } from '../../lib/react_util'
export interface BusRowProps {
    bus: Bus

    onDelete?: () => void
}

export const BusRow: FC<BusRowProps> = ({ bus, onDelete }) => {
    useUpdateOnChange(bus)
    const [isEditingName, setEditingName] = useState<boolean>(false)
    const [editName, setEditName] = useState<string>(bus.name)

    const startEditingName = useCallback(() => {
        setEditingName(true)
    }, [])
    const endEditingName = useCallback(() => {
        setEditingName(false)
        if (editName.length > 0) {
            bus.name = editName
        }
    }, [editName, bus])

    const onNameEdit = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(event.currentTarget.value)
    }, [])

    const handleChangeColor = useCallback(
        (color: string) => {
            bus.color = color
        },
        [bus],
    )

    let nameField: React.ReactNode
    if (isEditingName) {
        nameField = (
            <td>
                <Textbox value={editName} onBlur={endEditingName} onValueChange={onNameEdit} autoFocus />
            </td>
        )
    } else {
        nameField = <td onClick={startEditingName}>{bus.name}</td>
    }

    return (
        <tr>
            <td>
                <ColorButton color={bus.color} onChange={handleChangeColor} />
            </td>
            {nameField}
            <td>{bus.size}</td>
            <td className='text-right'>
                <Button text='X' variant='quiet' onClick={onDelete} />
            </td>
        </tr>
    )
}
