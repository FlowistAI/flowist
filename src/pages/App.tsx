import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    NodeMouseHandler,
    XYPosition,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { FloatingMenu } from '../components/FloatingMenu'
import { Optional } from '../types/types'
import { COMPONENT_BY_NODE_TYPE } from '../constants/nodeTypes'
import { useNodeManager } from '../hooks/NodeManager'
import { useRecoilState } from 'recoil'
import { ReactFlowInstanceState } from '../states/react-flow'
import Toast from '../hooks/Toast/Toast'
import { ContextMenu } from '../components/ContextMenu'
import { createMenuItems } from './App.menu'
import { AsideMenu } from '../components/AsideMenu'
import PromptModal from '../hooks/Modal/PromptModal'

function App() {
    const [ctxMenuPos, setCtxMenuPos] =
        useState<Optional<XYPosition>>(undefined)
    const [cvsCurPos, setCvsCurPos] = useState<Optional<XYPosition>>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reactFlowInstance, setReactFlowInstance] = useRecoilState(
        ReactFlowInstanceState,
    )

    const onContextMenu = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault()

            if (!reactFlowInstance) {
                console.error('reactFlowInstance is undefined')

                return
            }

            const ctxMenuPos = {
                x: event.clientX,
                y: event.clientY,
            }
            setCtxMenuPos(ctxMenuPos)
            const cvsPos = reactFlowInstance.screenToFlowPosition(ctxMenuPos)
            setCvsCurPos(cvsPos)
        },
        [reactFlowInstance],
    )
    const reactFlowWrapper = useRef(null)

    const onNodeContextMenu = useCallback<NodeMouseHandler>((event, node) => {
        event.preventDefault()
        console.log('node:', node)
    }, [])

    const nodeManager = useNodeManager()
    const menuItems = createMenuItems({
        nodeManager: nodeManager,
        cursor: cvsCurPos,
    })


    return (
        <div className="app flex" ref={reactFlowWrapper}>
            <div className="border-r fixed left-0 top-0 z-50 flex h-screen w-18 flex-col items-center bg-white py-6 ">
                <Toast />
                <PromptModal />
                <FloatingMenu />
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
                    nodeTypes={COMPONENT_BY_NODE_TYPE}
                    nodes={nodeManager.nodes}
                    onNodesChange={nodeManager.onNodesChange}
                    edges={nodeManager.edges}
                    onEdgesChange={nodeManager.onEdgesChange}
                    onConnect={nodeManager.onConnect}
                    onKeyUp={(event) => {
                        //FIXME: event.target should be the child of the react-flow div
                        if (
                            event.target instanceof Element &&
                            event.target.classList.contains('react-flow__edge')
                        ) {
                            if (event.key === 'Delete') {
                                nodeManager.deleteSelectedEdges()
                            }
                        }
                    }}
                    onInit={(instance) => {
                        console.log('flow instance:', instance)
                        setReactFlowInstance(instance)
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
