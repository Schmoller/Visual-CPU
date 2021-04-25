import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from './Button'

export interface MenuItem {
    id: string
    value: ReactNode
}

export interface DropdownButtonProps {
    value: ReactNode
    items: MenuItem[]
    onSelect?: (id: string) => void
}

export const DropdownButton: FC<DropdownButtonProps> = ({ value, items, onSelect }) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false)
    const dropdownArea = useRef<HTMLDivElement>(null)

    const showMenu = useCallback(() => {
        setMenuVisible(true)
    }, [])

    useEffect(() => {
        if (!menuVisible) {
            return
        }
        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuVisible(false)
            }
        }
        const onClick = (event: MouseEvent) => {
            if (!dropdownArea.current) {
                return
            }

            if (event.target instanceof Node) {
                if (dropdownArea.current.contains(event.target)) {
                    return
                }
            }
            setMenuVisible(false)
        }

        document.addEventListener('keyup', onKeyUp)
        document.addEventListener('mousedown', onClick)

        return () => {
            document.removeEventListener('keyup', onKeyUp)
            document.removeEventListener('mousedown', onClick)
        }
    })

    const menuEntries: ReactNode[] = items.map(item => {
        const onClick = () => {
            if (onSelect) {
                onSelect(item.id)
            }
            setMenuVisible(false)
        }

        return (
            <div onClick={onClick} className='drop-down-menu-item' key={item.id}>
                {item.value}
            </div>
        )
    })

    return (
        <>
            <Button text={value} onClick={showMenu} />
            {menuVisible && (
                <div className='drop-down' ref={dropdownArea}>
                    {menuEntries}
                </div>
            )}
        </>
    )
}
