/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
    useState,
    useCallback,
    useEffect,
    ReactNode,
    useRef,
} from 'react'
import Menu from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'

interface ContextMenuProps {
    renderContextMenu: ReactNode
}

export function useContextMenu(): ContextMenuProps {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const [target, setTarget] = useState<
        null | HTMLInputElement | HTMLTextAreaElement
    >(null)

    const handleContextMenu = useCallback((event: Event) => {
        event.preventDefault()
        const targetElement = event.target as
            | HTMLInputElement
            | HTMLTextAreaElement
        if (
            ['TEXTAREA', 'INPUT'].includes(targetElement.tagName) &&
            (targetElement.type === 'text' || targetElement.type === undefined)
        ) {
            setAnchorEl(targetElement as HTMLElement)
            setTarget(targetElement)
        }
    }, [])

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleClickOutside = useCallback(
        (event: Event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                handleClose()
            }
        },
        [handleClose],
    )
    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('click', handleClickOutside)
        }
    }, [handleClickOutside, handleContextMenu])

    const dispatchInputEvent = (
        element: HTMLInputElement | HTMLTextAreaElement,
        newValue: string,
    ) => {
        console.log(element)

        const event = new Event('input', { bubbles: true })
        Object.defineProperty(event, 'target', {
            writable: false,
            value: element,
        })
        element.value = newValue
        reactTriggerChange(element)

    }

    const handleMenuAction = useCallback(
        async (action: string) => {
            if (target) {
                target.focus()
                const targetValue = target.value
                const selectionStart = target.selectionStart!
                const selectionEnd = target.selectionEnd!

                switch (action) {
                    case 'copy':
                        if (selectionStart !== selectionEnd) {
                            // 复制选中文本
                            await navigator.clipboard.writeText(
                                targetValue.slice(selectionStart, selectionEnd),
                            )
                        } else {
                            // 复制全部文本
                            await navigator.clipboard.writeText(targetValue)
                        }

                        break
                    case 'cut':
                        if (selectionStart !== selectionEnd) {
                            // 剪切选中文本
                            await navigator.clipboard.writeText(
                                targetValue.slice(selectionStart, selectionEnd),
                            )
                            target.value =
                                targetValue.slice(0, selectionStart) +
                                targetValue.slice(selectionEnd)
                            dispatchInputEvent(target, target.value)
                        } else {
                            // 剪切全部文本
                            await navigator.clipboard.writeText(targetValue)
                            target.value = ''
                            dispatchInputEvent(target, target.value)
                        }

                        break
                    case 'paste':
                        try {
                            const text = await navigator.clipboard.readText()
                            // 粘贴文本到当前光标位置或选中区域
                            const value =
                                target.value.slice(0, selectionStart) +
                                text +
                                target.value.slice(selectionEnd)
                            dispatchInputEvent(target, value)
                            // target.setRangeText(
                            //     text,
                            //     selectionStart,
                            //     selectionEnd,
                            //     'end',
                            // )
                            // dispatchInputEvent
                        } catch (error) {
                            console.error('Paste failed', error)
                        }

                        break
                    case 'selectAll':
                        target.select()
                        break
                    case 'undo':
                        if (typeof (target as any).undo === 'function') {
                            (target as any).undo()
                        }

                        break
                    case 'redo':
                        if (typeof (target as any).redo === 'function') {
                            (target as any).redo()
                        }

                        break
                    default:
                        break
                }
            }

            handleClose()
        },
        [target, handleClose],
    )

    const renderContextMenu = (
        <Menu
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorEl={anchorEl}
            placement="bottom-start"
            ref={menuRef}
        >
            <MenuItem onClick={() => handleMenuAction('copy')}>复制</MenuItem>
            <MenuItem onClick={() => handleMenuAction('cut')}>剪切</MenuItem>
            <MenuItem onClick={() => handleMenuAction('paste')}>粘贴</MenuItem>
            <MenuItem onClick={() => handleMenuAction('selectAll')}>
                全选
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction('undo')}>撤销</MenuItem>
            <MenuItem onClick={() => handleMenuAction('redo')}>重做</MenuItem>
        </Menu>
    )

    return {
        renderContextMenu,
    }
}
