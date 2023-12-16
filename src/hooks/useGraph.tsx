import { useNodesState, useEdgesState, Node, Edge, XYPosition } from 'reactflow';
import { generateId } from '../util/misc-util';

export const useGraph = (initialNodes: Node[], initialEdges: Edge[]) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const handleAddNode = (position: XYPosition) => {
        const newNode = {
            id: generateId(),
            type: 'chat-box',
            data: { label: 'New Node' },
            style: { width: 400, height: 400 },
            position: position
        };
        setNodes((nds) => [...nds, newNode]);
    }

    return {
        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
        handleAddNode
    };
};
