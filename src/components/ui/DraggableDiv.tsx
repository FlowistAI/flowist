import React, { useState, useEffect, useCallback } from 'react'

export type DraggableDivProps = {
    initialWidtdh?: number
    minWidth?: number
} & React.HTMLAttributes<HTMLDivElement>

const DraggableDiv: React.FC<DraggableDivProps> = ({
    children,
    initialWidtdh = 300,
    minWidth = 200,
    ...rest
}) => {
    const [width, setWidth] = useState<number>(initialWidtdh) // 初始宽度为 300px
    const [dragging, setDragging] = useState<boolean>(false)

    const handleMouseDown = useCallback(() => {
        setDragging(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setDragging(false)
    }, [])

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (dragging) {
                const newWidth = event.clientX
                if (newWidth >= minWidth) {
                    setWidth(newWidth)
                } else {
                    setWidth(minWidth)
                }
            }
        },
        [dragging, minWidth],
    )

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging, handleMouseMove, handleMouseUp])

    return (
        <div
            className={'draggable-div ' + rest.className}
            {...rest}
            style={{ width: `${width}px` }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    )
}

export default DraggableDiv
