import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeMouseHandler, XYPosition } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import { FloatingMenu } from '../components/FloatingMenu';
import { ContextMenu } from '../components/ContextMenu';
import { Optional } from '../types/types';
import { AppNodeType, appNodeTypeComponents } from '../constants/nodeTypes';
import { useNodeManager } from '../hooks/NodeManager';
import { useRecoilState } from 'recoil';
import { ReactFlowInstanceState } from '../states/react-flow';

function App() {
  const [ctxMenuPos, setCtxMenuPos] = useState<Optional<XYPosition>>(undefined);
  const [cvsCurPos, setCvsCurPos] = useState<Optional<XYPosition>>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactFlowInstance, setReactFlowInstance] = useRecoilState(ReactFlowInstanceState);

  const onContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!reactFlowInstance) {
      console.error('reactFlowInstance is undefined');
      return
    }
    const ctxMenuPos = {
      x: event.clientX,
      y: event.clientY,
    }
    setCtxMenuPos(ctxMenuPos);
    const cvsPos = reactFlowInstance.screenToFlowPosition(ctxMenuPos);
    setCvsCurPos(cvsPos);
    // 显示上下文菜单
  }, [reactFlowInstance]);
  const reactFlowWrapper = useRef(null);

  const addNode = (nodeType: AppNodeType) => {
    if (cvsCurPos) {
      // handleAddNode(nodeType, cvsCurPos);
      setCtxMenuPos(undefined);
    }
  }

  const onNodeContextMenu = useCallback<NodeMouseHandler>((event, node) => {
    event.preventDefault();
    console.log('node:', node);
    // 显示上下文菜单
  }, []);

  const { nodes, onNodesChange } = useNodeManager();

  return (
    <div className='app' ref={reactFlowWrapper}>
      <FloatingMenu
      />
      {
        <ContextMenu
          position={ctxMenuPos}
          isOpen={ctxMenuPos !== undefined}
          onClose={() => setCtxMenuPos(undefined)}
        />
      }
      <ReactFlow
        onContextMenu={onContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        nodes={nodes}
        // edges={edges}
        nodeTypes={appNodeTypeComponents}
        onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        onInit={(instance) => {
          console.log('flow instance:', instance);
          setReactFlowInstance(instance);
          console.log(instance.getZoom());

        }}
        onClick={
          () => {
            setCtxMenuPos(undefined);
          }
        }
        onDrag={
          () => {
            setCtxMenuPos(undefined);
          }
        }
        onMove={
          () => {
            setCtxMenuPos(undefined);
          }
        }
      >
        <Background />
        <Controls />
        <MiniMap
          pannable
        />

      </ReactFlow>

    </div>
  );
}

export default App;
