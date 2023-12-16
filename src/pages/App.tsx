import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowInstance, XYPosition } from 'reactflow';
import 'reactflow/dist/style.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './App.css';
import { FloatingMenu } from '../components/FloatingMenu';
import { ContextMenu } from '../components/ContextMenu';
import { useGraph } from '../hooks/useGraph';
import { initNodes, initEdges } from '../constants/initData';
import { Optional } from '../types/types';
import { ChatBoxNode } from '../components/ChatBoxNode';

function App() {
  const { nodes, onNodesChange, edges, onEdgesChange, handleAddNode } = useGraph(initNodes, initEdges);
  const [ctxMenuPos, setCtxMenuPos] = useState<Optional<XYPosition>>(undefined);
  const [cvsCurPos, setCvsCurPos] = useState<Optional<XYPosition>>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactFlowInstance, setReactFlowInstance] = useState<Optional<ReactFlowInstance<any, any>>>(undefined);
  const nodeTypes = useMemo(() => ({ 'chat-box': ChatBoxNode }), []);

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

  const addNode = useCallback(() => {
    if (cvsCurPos) {
      handleAddNode(cvsCurPos);
      setCtxMenuPos(undefined);
    }
  }, [cvsCurPos, handleAddNode]);
  return (
    <div className='app' onContextMenu={onContextMenu} ref={reactFlowWrapper}>
      <FloatingMenu
      />
      {ctxMenuPos && (
        <ContextMenu position={ctxMenuPos} onAddNode={addNode} />
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(instance) => {
          console.log('flow instance:', instance);
          instance.zoomTo(1);
          setReactFlowInstance(instance);
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
        fitView
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
