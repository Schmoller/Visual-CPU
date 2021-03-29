import React, { FC, useCallback, useRef, useState } from 'react'
import { Textbox } from '../Topcoat'
import { Item } from './Item'
import './style.css'

export const ComponentTray: FC = () => {
    const [searchText, setSearchText] = useState('')

    const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value)
    }, [])

    return (
        <div className='component-tray'>
            <Textbox value={searchText} onValueChange={onSearch} />
            <div className='tray'>
                <Item title='Text'></Item>
            </div>
        </div>
    )
}
