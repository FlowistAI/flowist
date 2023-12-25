/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Typography } from '@mui/joy'
import { XIcon } from '@primer/octicons-react'
import { useAtom } from 'jotai'
import { useDrag } from 'react-dnd'
import { PresetData } from '../states/widgets/widget.atom'
import { showPresetsSidebarAtom, usePresets } from '../states/preset.atom'
import { useEffect, useMemo, useState } from 'react'

export const Presets = () => {
    const [show, setShow] = useAtom(showPresetsSidebarAtom)
    const { select } = usePresets()
    const [query, setQuery] = useState('')
    const presetData = useMemo(() => select.list(query), [select, query])

    const [sidebarClass, setSidebarClass] = useState('')

    useEffect(() => {
        if (show) {
            setSidebarClass('sidebar-enter')
        } else {
            setSidebarClass('sidebar-exit')
        }
    }, [show])

    const onTransitionEnd = () => {
        if (!show) {
            setSidebarClass('')
        }
    }

    return (
        <div
            className={`border-r py-6 h-full w-72 flex px-4 flex-col sidebar ${sidebarClass}`}
            onTransitionEnd={onTransitionEnd}
        >
            <div className="flex w-full headline">
                <div className="flex-1">
                    <Typography level="h4">All Presets</Typography>
                </div>
                <div
                    className="icon-circle-button"
                    onClick={() => setShow(false)}
                >
                    <XIcon />
                </div>
            </div>
            <div className="flex mt-4">
                <div className="flex-1">
                    <Input
                        value={query}
                        onChange={(e) => {
                            console.log('update search')
                            setQuery(e.target.value)
                        }}
                        placeholder="Search"
                        fullWidth
                    />
                </div>
            </div>
            <div className="flex mt-4 w-full flex-col overflow-y-auto gap-2">
                {presetData.map((preset) => (
                    <DraggableItem presetData={preset} key={preset.id}>
                        <img
                            className="w-12 h-12 cursor-default select-none pointer-events-none"
                            src={preset.icon || 'robot.png'}
                        />
                        <div className="ml-2">
                            <div className="text-md">{preset.name}</div>
                            <div className="text-gray-500">
                                {preset.description}
                            </div>
                        </div>
                    </DraggableItem>
                ))}
            </div>
        </div>
    )
}

type DraggableItemProps = {
    presetData: PresetData
    children: React.ReactNode
}

export type PresetDropItem = {
    type: 'preset-item'
    data: PresetData
}

function DraggableItem({ presetData, children }: DraggableItemProps) {
    const [{ isDragging }, drag] = useDrag({
        type: 'item',
        item: {
            type: 'preset-item',
            data: presetData,
        } as PresetDropItem,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    return (
        <div
            className="item border border-gray-200 p-2 flex w-full rounded-sm cursor-pointer"
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {children}
        </div>
    )
}
