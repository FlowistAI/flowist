/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    NodeMouseHandler,
    ReactFlowInstance,
    XYPosition,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { Optional } from '../types/types'
import Toast from '../hooks/Toast/Toast'
import { ContextMenu } from '../components/ContextMenu'
import { useMenuItems } from './App.context-menu'
import { AsideMenu } from './App.nav-menu'
import PromptModal from '../hooks/Modal/PromptModal'
import {
    ShortcutsHookOptions,
    useShortcuts,
} from '../hooks/Shortcut/useShortcut'
import { useDocument } from '../states/document.atom'
import { WidgetComponents } from '../states/widgets/widget.atom'
import { PresetDropItem, Presets } from './App.presets-sidebar'
import { SettingsModal } from './setting/useSettingsModal'

function App() {
    const [ctxMenuPos, setCtxMenuPos] =
        useState<Optional<XYPosition>>(undefined)
    const [cvsCurPos, setCvsCurPos] = useState<Optional<XYPosition>>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [flowInst, setFlowInst] =
        useState<Optional<ReactFlowInstance>>(undefined)

    const onContextMenu = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const className = (event.target as HTMLDivElement)?.className
            console.log(className)

            if (
                typeof className != 'string' ||
                className !== 'react-flow__pane'
            ) {
                console.log('ignore')

                return
            }

            event.preventDefault()

            if (!flowInst) {
                console.error('reactFlowInstance is undefined')

                return
            }

            const ctxMenuPos = {
                x: event.clientX,
                y: event.clientY,
            }
            setCtxMenuPos(ctxMenuPos)
            const cvsPos = flowInst.screenToFlowPosition(ctxMenuPos)
            setCvsCurPos(cvsPos)
        },
        [flowInst],
    )
    const appWrapperRef = useRef<HTMLDivElement>(null)

    const onNodeContextMenu = useCallback<NodeMouseHandler>((event, node) => {
        event.preventDefault()
        console.log('node:', node)
    }, [])

    const menuItems = useMenuItems({
        cursor: cvsCurPos,
    })

    const [, drop] = useDrop({
        accept: 'item',
        drop: (item: PresetDropItem, monitor) => {
            if (!flowInst) {
                return
            }

            const pos = monitor.getClientOffset()
            if (!pos) {
                return
            }

            const canvasPos = flowInst.screenToFlowPosition(pos)
            const preset = item.data
            console.log('preset', preset)

            setDocument({
                type: 'add-widget',
                options: {
                    type: item.data.type,
                    data: { position: canvasPos },
                    preset,
                },
            })
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const { state: document, dispatch: setDocument } = useDocument()

    useShortcuts(
        useMemo<ShortcutsHookOptions>(
            () => ({
                scope: window ?? undefined,
                bindings: {
                    'ctrl+s': () => setDocument({ type: 'save' }),
                    'ctrl+o': () => setDocument({ type: 'load' }),
                },
            }),
            [setDocument],
        ),
    )

    const nodes = document.nodes
    const edges = document.edges

    return (
        <div className="app flex" ref={appWrapperRef}>
            <div className="fixed left-0 top-0 z-50 h-screen w-0 flex items-center ">
                <Toast />
                <PromptModal />
                {/* <FloatingMenu /> */}
                <SettingsModal />
                <ContextMenu
                    position={ctxMenuPos}
                    isOpen={ctxMenuPos !== undefined}
                    onClose={() => setCtxMenuPos(undefined)}
                    items={menuItems}
                />
                <div className="bg-white border-r py-6 h-full">
                    <AsideMenu />
                </div>
                <Presets />
            </div>
            <main className="flex-1 h-full" ref={drop}>
                <ReactFlow
                    onContextMenu={onContextMenu}
                    onNodeContextMenu={onNodeContextMenu}
                    nodeTypes={WidgetComponents}
                    nodes={nodes}
                    onNodesChange={(changes) => {
                        setDocument({
                            type: 'flow-change',
                            nodeChanges: changes,
                        })
                    }}
                    edges={edges}
                    onEdgesChange={(changes) => {
                        setDocument({
                            type: 'flow-change',
                            edgeChanges: changes,
                        })
                    }}
                    onConnect={(params) => {
                        setDocument({ type: 'connect', connection: params })
                    }}
                    onKeyUp={(event) => {
                        //FIXME: event.target should be the child of the react-flow div
                        if (
                            event.target instanceof Element &&
                            event.target.classList.contains('react-flow__edge')
                        ) {
                            if (event.key === 'Delete') {
                                setDocument({ type: 'disconnectSelection' })
                            }
                        }
                    }}
                    onInit={(instance) => {
                        console.log('flow instance:', instance)
                        setFlowInst(instance)
                    }}
                    onClick={() => {
                        setCtxMenuPos(undefined)
                    }}
                    onDrag={() => {
                        setCtxMenuPos(undefined)
                    }}
                    onMove={() => {
                        setCtxMenuPos(undefined)
                    }}
                >
                    <Background />
                    <Controls />
                    <MiniMap pannable />
                </ReactFlow>
            </main>
        </div>
    )
}

export default App
