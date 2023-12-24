import React, { useCallback, useMemo, useRef, useState } from 'react'
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
import { useMenuItems } from './App.menu'
import { AsideMenu } from '../components/AsideMenu'
import PromptModal from '../hooks/Modal/PromptModal'
import {
    ShortcutsHookOptions,
    useShortcuts,
} from '../hooks/Shortcut/useShortcut'
import { useDocument } from '../states/document.atom'
import { WidgetComponents } from '../states/widgets/widget.atom'

function App() {
    const [ctxMenuPos, setCtxMenuPos] =
        useState<Optional<XYPosition>>(undefined)
    const [cvsCurPos, setCvsCurPos] = useState<Optional<XYPosition>>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [flowInst, setFlowInst] =
        useState<Optional<ReactFlowInstance>>(undefined)

    const onContextMenu = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
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
            <div className="border-r fixed left-0 top-0 z-50 flex h-screen w-18 flex-col items-center bg-white py-6 ">
                <Toast />
                <PromptModal />
                {/* <FloatingMenu /> */}
                <ContextMenu
                    position={ctxMenuPos}
                    isOpen={ctxMenuPos !== undefined}
                    onClose={() => setCtxMenuPos(undefined)}
                    items={menuItems}
                />
                <AsideMenu />
            </div>
            <main className="flex-1 h-full">
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
