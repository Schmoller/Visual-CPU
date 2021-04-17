import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { ColorResult } from 'react-color'
import { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap'
import { ColorPicker } from './ColorPicker'

import { IconButton } from './IconButton'

export interface ColorButtonProps {
    color: string
    readOnly?: boolean

    onChange?: (color: string) => void
}

export const ColorButton: FC<ColorButtonProps> = ({ color, readOnly, onChange }) => {
    const [showingPicker, setShowingPicker] = useState<boolean>(false)

    const togglePicker = useCallback(() => {
        if (!readOnly) {
            setShowingPicker(value => !value)
        }
    }, [])

    const hidePicker = useCallback(() => {
        setShowingPicker(false)
    }, [])

    const onChangeColor = useCallback(
        (color: ColorResult) => {
            if (onChange) {
                onChange(color.hex)
            }
        },
        [onChange],
    )

    return (
        <>
            <IconButton
                icon={<span className='topcoat-icon' style={{ backgroundColor: color }}></span>}
                onClick={togglePicker}
            />
            <ColorPickerPopover color={color} onChange={onChangeColor} show={showingPicker} onHide={hidePicker} />
        </>
    )
}

interface ColorPickerPopoverProps extends ExportedColorProps {
    show: boolean
    onHide: () => void
}

const ColorPickerPopover: FC<ColorPickerPopoverProps> = ({ show, onHide, color, onChange }) => {
    const pickerElement = useRef<HTMLDivElement>(null)

    const onKeypress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onHide()
            }
        },
        [onHide],
    )

    const onClick = useCallback(
        (event: MouseEvent) => {
            if (
                pickerElement.current &&
                event.target instanceof Node &&
                event.target &&
                !(pickerElement.current === event.target || pickerElement.current.contains(event.target))
            ) {
                onHide()
            }
        },
        [onHide],
    )

    useEffect(() => {
        if (show) {
            document.addEventListener('keyup', onKeypress)
            document.addEventListener('mousedown', onClick)

            return () => {
                document.removeEventListener('keyup', onKeypress)
                document.removeEventListener('mousedown', onClick)
            }
        }
    }, [show, onKeypress, onClick])

    if (!show) {
        return null
    }
    return (
        <div className='popover color-picker-popover' ref={pickerElement}>
            <ColorPicker color={color} onChange={onChange} />
        </div>
    )
}
