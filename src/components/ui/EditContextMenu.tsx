import React, { useRef, useState } from 'react'
import Menu from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'

export type ContextMenuProps = {
    anchorPoint?: {
        x: number
        y: number
    }
    setAnchorPoint: (anchorPoint?: { x: number; y: number }) => void
    targetRef: React.RefObject<HTMLInputElement>
}

export const EditContextMenu = ({
    anchorPoint,
    setAnchorPoint,
    targetRef,
}: ContextMenuProps) => {
    const isVisible = Boolean(anchorPoint)

    const handleClose = () => {
        setAnchorPoint(undefined)
    }

    const handleMenuAction = (action: string) => {
        handleClose()
        if (!targetRef.current) {
            return
        }

        switch (action) {
            case 'copy':
                navigator.clipboard.writeText(targetRef.current.value)
                break
            case 'cut':
                navigator.clipboard.writeText(targetRef.current.value)
                document.execCommand('cut')
                break
            case 'paste':
                navigator.clipboard.readText().then((clipText) => {
                    document.execCommand('insertText', false, clipText)
                })
                break
            case 'selectAll':
                targetRef.current.select()
                break
            case 'undo':
                document.execCommand('undo')
                break
            case 'redo':
                document.execCommand('redo')
                break
            default:
                break
        }
    }

    return (
        <Menu
            open={isVisible}
            onClose={handleClose}
            anchorEl={targetRef.current}
            // anchorPosition={
            //     isVisible
            //         ? { top: anchorPoint.y, left: anchorPoint.x }
            //         : undefined
            // }
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
}

export const withContextMenu = (WrappedComponent: React.ComponentType) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props: any) => {
        const [anchorPoint, setAnchorPoint] = useState<{
            x: number
            y: number
        }>()
        const ref = useRef<HTMLInputElement>(null)

        const handleContextMenu = (event: React.MouseEvent) => {
            event.preventDefault()
            setAnchorPoint({ x: event.pageX, y: event.pageY })
        }

        return (
            <>
                <WrappedComponent
                    ref={ref}
                    onContextMenu={handleContextMenu}
                    {...props}
                />
                <EditContextMenu
                    anchorPoint={anchorPoint}
                    setAnchorPoint={setAnchorPoint}
                    targetRef={ref}
                />
            </>
        )
    }
}

export default withContextMenu
