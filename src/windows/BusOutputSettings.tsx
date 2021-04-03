import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Button, ButtonBar, Textbox } from '../components/Topcoat'
import { Window } from '../components/Window/Window'
import { NodeSettingsProps } from '../lib/node'
import { BusOutputNode } from '../lib/nodes'

export type DisplayType = 'decimal' | 'hex' | 'oct'

export interface BusOutputSettingsProps {
    value: number
    display?: DisplayType

    onValueChange: (newValue: number) => void
    onDisplayChange: (display: DisplayType) => void
}

export const BusOutputSettings: FC<BusOutputSettingsProps> = ({
    value,
    display = 'hex',
    onValueChange,
    onDisplayChange,
}) => {
    const [inputText, setInputText] = useState<string>(convertValue(value, display))
    const [editing, setEditing] = useState<boolean>(false)
    const [error, setError] = useState<boolean>()

    useEffect(() => {
        if (!editing) {
            setInputText(convertValue(value, display))
        }
    }, [value, editing, display])

    const onInputTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.currentTarget.value)
    }, [])
    const onInputFocus = useCallback(() => {
        setEditing(true)
    }, [])
    const onInputFocusLostOrSubmit = useCallback(() => {
        setEditing(false)
        let newValue: number
        switch (display) {
            case 'decimal':
                newValue = parseInt(inputText)
                break
            case 'oct':
                newValue = parseInt(inputText, 8)
                break
            case 'hex':
                newValue = parseInt(inputText, 16)
                break
        }
        if (isFinite(newValue)) {
            onValueChange(newValue)
        } else {
            setError(true)
            setTimeout(() => setError(false), 3000)
        }
    }, [display, inputText, onValueChange])

    return (
        <div className='form'>
            <Textbox
                value={inputText}
                onFocus={onInputFocus}
                onBlur={onInputFocusLostOrSubmit}
                onSubmit={onInputFocusLostOrSubmit}
                onValueChange={onInputTextChange}
            />
            <ButtonBar>
                <Button text='Dec' onClick={() => onDisplayChange('decimal')} />
                <Button text='Hex' onClick={() => onDisplayChange('hex')} />
                <Button text='Oct' onClick={() => onDisplayChange('oct')} />
            </ButtonBar>
            <div>Placeholder for binary display</div>
        </div>
    )
}
export interface BusOutputSettingsWindowProps extends NodeSettingsProps<BusOutputNode> {}

export const BusOutputSettingsWindow: FC<BusOutputSettingsWindowProps> = ({ node, onClose }) => {
    const [value, setValue] = useState<number>(node.value)
    const [display, setDisplay] = useState<DisplayType>('decimal')

    const closeWindow = useCallback(() => {
        node.value = value
        onClose()
    }, [value, onClose])

    return (
        <Window title='Bus Output' initialX={0} initialY={0} initialWidth={135} initialHeight={165}>
            <BusOutputSettings value={value} display={display} onValueChange={setValue} onDisplayChange={setDisplay} />
            <div className='space-above'>
                <Button text='Close' onClick={closeWindow} />
            </div>
        </Window>
    )
}

function convertValue(value: number, display: DisplayType): string {
    if (display === 'decimal') {
        return value.toFixed(0)
    } else if (display === 'hex') {
        return value.toString(16)
    } else if (display === 'oct') {
        return value.toString(8)
    } else {
        throw Error('Invalid display type')
    }
}
