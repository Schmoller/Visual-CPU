import React, { FC, useCallback } from 'react'

import { ColorResult, CustomPicker } from 'react-color'
import { Hue, Saturation } from 'react-color/lib/components/common'

export const ColorPicker = CustomPicker(props => {
    const handleChange = useCallback(
        (color: ColorResult) => {
            if (props.onChange) {
                props.onChange(color)
            }
        },
        [props.onChange],
    )

    return (
        <div className='color-picker'>
            <div className='saturation'>
                <Saturation onChange={handleChange} {...props} />
            </div>
            <div className='hue'>
                <Hue onChange={handleChange} {...props} />
            </div>
        </div>
    )
})
