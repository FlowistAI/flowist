import { Node } from "reactflow";

export const initNodes: Node[] = [
    {
        id: 'a',
        type: 'chat-box',
        data: { label: 'Node A' },
        position: { x: 250, y: 250 },
        style: { width: 400, height: 400 },
    },
    // {
    //     id: 'b',
    //     data: { label: 'Node B' },
    //     position: { x: 100, y: 100 },
    // },
];

export const initEdges = [
    // {
    //     id: 'a-b',
    //     source: 'a',
    //     target: 'b',
    // },
];
