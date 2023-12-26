import React, { useState, useEffect, useCallback, useRef } from 'react'

export type BoxProgressBarProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    min?: number
    max?: number
    value?: number
    onChange?: (value: number) => void
}

export const BoxProgressBar = ({
    min = 0,
    max = 100,
    value = 0,
    onChange,
    className,
    ...rest
}: BoxProgressBarProps) => {
    const [isDragging, setIsDragging] = useState(false)

    const percentage = ((value - min) * 100) / (max - min)

    const handleChange = useCallback(
        (clientX: number, rect: DOMRect) => {
            const offsetX = clientX - rect.left
            const newPercentage = (offsetX / rect.width) * 100
            const newValue = min + (newPercentage * (max - min)) / 100
            onChange?.(Math.min(Math.max(newValue, min), max))
        },
        [min, max, onChange],
    )

    const progressBarRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging) {
                return
            }

            const progressBar = progressBarRef.current
            if (!progressBar) {
                return
            }

            handleChange(event.clientX, progressBar.getBoundingClientRect())
        },
        [handleChange, isDragging],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (!isDragging) {
            return
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseMove, handleMouseUp, isDragging]) // Only re-run the effect if isDragging changes

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        const rect = event.currentTarget.getBoundingClientRect()
        handleChange(event.clientX, rect)
    }

    return (
        <div
            // id="progress-bar"
            ref={progressBarRef}
            className={'bg-gray-200 h-4 rounded cursor-pointer ' + className}
            onMouseDown={handleMouseDown}
            {...rest}
        >
            <div
                className="bg-blue-600 h-4 rounded"
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

export default BoxProgressBar
