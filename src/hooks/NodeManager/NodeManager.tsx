/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from "react";
import { Node, NodeChange } from "reactflow";
import { AppNodeType, AppNodeTypes } from "../../constants/nodeTypes";

export type NodeAddHandler = (node: Node) => void;
type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export type SubManager<NodeType extends AppNodeType, NodeData = any, Preset = any> = {
    createNode: (options: AddNodeOptions<NodeType, NodeData, Preset>) => Node<NodeData, NodeType>;
    destroyNode: (nodeId: string) => void;
};

export type NodeManagerOptions<NodeType extends AppNodeType, NodeData = any> = {
    setNodes: Dispatch<SetStateAction<Node<NodeData>[]>>;
    onNodesChange: OnChange<NodeChange>;
    nodes: Node[];
    subManagers: Record<NodeType, SubManager<NodeType, NodeData>>;
};

export type AddNodeOptions<NodeType extends AppNodeType, NodeData = any, Preset = any> = {
    type: NodeType
    preset?: Preset
    data?: Partial<Node<NodeData, NodeType>>
}

export class NodeManager {
    private subManagers;
    private _addNode: NodeAddHandler;
    private _removeNode: (nodeId: string) => void;
    private nodeMap: Record<string, Node> = {};
    private _nodes: Node[];
    get nodes() {
        return this._nodes;
    }

    onNodesChange: OnChange<NodeChange>;

    private constructor(options: NodeManagerOptions<AppNodeTypes>) {
        this._addNode = (node: Node) => {
            options.setNodes((nodes) => nodes.concat(node));
        }
        this._removeNode = (nodeId: string) => {
            options.setNodes((nodes) => nodes.filter(node => node.id !== nodeId));
        }
        this._nodes = options.nodes;
        this.onNodesChange = options.onNodesChange;
        this.subManagers = options.subManagers;
        this.removeNode = this.removeNode.bind(this);
        this.addNode = this.addNode.bind(this);
    }

    static from(prev: NodeManager | undefined, options: NodeManagerOptions<AppNodeTypes>) {
        const manager = new NodeManager(options);
        if (!prev) {
            return manager;
        }
        if (!prev.nodeMap) {
            throw new Error('prev.nodeMap is undefined');
        }
        manager.nodeMap = prev.nodeMap;
        return manager;
    }


    addNode(options: AddNodeOptions<AppNodeTypes>) {
        if (options.type === undefined) {
            throw new Error('options.type is undefined');
        }
        const subManager = this.subManagers[options.type];
        if (!subManager) {
            throw new Error(`factory for node type ${options.type} not found`);
        }
        const node = subManager.createNode(options);
        this.nodeMap[node.id] = node;
        this._addNode(node);
    }

    removeNode(nodeId: string) {
        const node = this.nodeMap[nodeId];
        if (!node) {
            throw new Error(`node ${nodeId} not found`);
        }
        const type = node.type;
        if (type === undefined) {
            throw new Error(`node ${nodeId} has no type`);
        }
        const subManager = this.subManagers[type as AppNodeTypes];
        if (!subManager) {
            throw new Error(`factory for node type ${type} not found`);
        }
        subManager.destroyNode(nodeId);
        delete this.nodeMap[nodeId];
        this._removeNode(nodeId);
    }
}
