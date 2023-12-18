/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from "react";
import { Connection, Edge, EdgeChange, MarkerType, Node, NodeChange } from "reactflow";
import { AppNodeType, AppNodeTypes } from "../../constants/nodeTypes";
import { SubManager } from "./SubManager";
import { CommunicationNode, GraphTelecom, ParsedSourceTargetId, SignalHandler, createSourceTargetId, parseSourceTargetId } from "../../libs/GraphTelecom/GraphTelecom";
import { NodeIdGenerator } from "../../util/id-generator";

export type NodeAddHandler = (node: Node) => void;
export type EdgeAddHandler = (edge: Edge) => void;
type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export type PortDefinition = {
    input: {
        [key: string]: {
            id: string
        }
    },
    output: {
        [key: string]: {
            id: string
        }
    }
}

export type NodeManagerOptions<NodeType extends AppNodeType, NodeData = any> = {
    // node
    nodes: Node[];
    setNodes: Dispatch<SetStateAction<Node<NodeData>[]>>;
    onNodesChange: OnChange<NodeChange>;
    // edge
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    onEdgesChange: OnChange<EdgeChange>;
    // misc
    subManagers: Record<NodeType, SubManager<NodeType, NodeData>>;
    telecom: GraphTelecom
    portDefs: Record<NodeType, PortDefinition>
    idGeneratorGetter: () => NodeIdGenerator
    idGeneratorSetter: (setter: (prev: NodeIdGenerator) => NodeIdGenerator) => void

};

export type AddNodeOptions<NodeType extends AppNodeType, NodeData = any, Preset = any> = {
    type: NodeType
    preset?: Preset
    data?: Partial<Node<NodeData, NodeType>>
    onSignal?: SignalHandler
}

export type NodeManagerSnapshot = ReturnType<NodeManager['snapshot']>;

export class NodeManager {
    private subManagers;
    private telecom;
    private portDefs;

    private nodeTypes: Record<string, AppNodeType> = {};
    private edgeTypes: Record<string, string> = {};

    // add a raw node to the original node list
    private _addNodeToFlow: NodeAddHandler;
    // remove a raw node from the original node list
    private _removeNodeFromFlow: (nodeId: string) => void;

    private _nodes: Node[];
    get nodes() {
        return this._nodes;
    }

    private _addEdge: EdgeAddHandler;
    private _removeEdge: (edgeId: string) => void;
    private _edges: Edge[];
    get edges() {
        return this._edges;
    }

    public readonly onNodesChange: OnChange<NodeChange>;
    public readonly onEdgesChange: OnChange<EdgeChange>;

    private idGeneratorGetter: () => NodeIdGenerator;
    private idGeneratorSetter: (setter: (prev: NodeIdGenerator) => NodeIdGenerator) => void;

    private constructor(options: NodeManagerOptions<AppNodeTypes>) {
        this.subManagers = options.subManagers;
        this.telecom = options.telecom;
        this.portDefs = options.portDefs;
        this.idGeneratorGetter = options.idGeneratorGetter;
        this.idGeneratorSetter = options.idGeneratorSetter;


        this._addNodeToFlow = (node: Node) => {
            options.setNodes((nodes) => nodes.concat(node));
        }

        this._removeNodeFromFlow = (nodeId: string) => {
            options.setNodes((nodes) => nodes.filter(node => node.id !== nodeId));
        }

        this._nodes = options.nodes;
        this.onNodesChange = options.onNodesChange;
        this.removeNode = this.removeNode.bind(this);
        this.addNode = this.addNode.bind(this);

        this._addEdge = (edge: Edge) => {
            options.setEdges((edges) => edges.concat(edge));
        }

        this._removeEdge = (edgeId: string) => {
            options.setEdges((edges) => edges.filter(edge => edge.id !== edgeId));
        }

        this._edges = options.edges;
        this.onEdgesChange = options.onEdgesChange;
        this.removeEdge = this.removeEdge.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.createEdge = this.createEdge.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.getCommunicationNode = this.getCommunicationNode.bind(this);
        this.snapshot = this.snapshot.bind(this);
        this.restore = this.restore.bind(this);

    }

    static from(prev: NodeManager | undefined, options: NodeManagerOptions<AppNodeTypes>) {
        const manager = new NodeManager(options);
        if (!prev) {
            return manager;
        }

        if (!prev.nodeTypes) {
            throw new Error('prev.nodeMap is undefined');
        }

        manager.nodeTypes = prev.nodeTypes;
        manager.edgeTypes = prev.edgeTypes;
        return manager;
    }

    snapshot() {
        console.log('idgen snapshot', this.idGeneratorGetter().index);
        return {
            idGenerator: { index: this.idGeneratorGetter().index },
            nodeMap: Object.fromEntries(this.nodes.map(node => [node.id, node])),
            edgeMap: Object.fromEntries(this.edges.map(edge => [edge.id, edge])),
            partitions: {
                ...Object.fromEntries(Object.entries(this.subManagers).map(([type, subManager]) => {
                    return [type, subManager.snapshot()];
                }))
            }
        };
    }

    restore(snapshot: NodeManagerSnapshot) {
        console.log('idgen restore', snapshot.idGenerator.index);

        this.idGeneratorSetter(() => new NodeIdGenerator(snapshot.idGenerator.index));
        console.log('NodeManagerrestore', snapshot);
        if (this.nodes.length > 0) {
            throw new Error('already initialized');
        }

        Object.entries(snapshot.partitions).forEach(([type, partition]) => {
            const subManager = this.subManagers[type as AppNodeTypes];
            if (!subManager) {
                throw new Error(`factory for node type ${type} not found`);
            }

            subManager.restore(partition);
        });

        const { nodeMap, edgeMap } = snapshot;

        Object.values(nodeMap).forEach((node) => {
            if (!node.type) {
                throw new Error('node.type is undefined');
            }

            if (!(Object.values(AppNodeTypes).includes(node.type as AppNodeTypes))) {
                throw new Error(`node.type ${node.type} is not a valid AppNodeTypes`);
            }

            const type = node.type as AppNodeTypes;
            this._addNodeToTypeMap(node.id, type);
            this._addNodeToTeleGraph(node.id, type);
            this._addNodeToFlow(node);
        });

        Object.values(edgeMap).forEach((edge) => {
            this._addEdge(edge);
        });
    }

    public addNode(options: AddNodeOptions<AppNodeTypes>) {
        if (options.type === undefined) {
            throw new Error('options.type is undefined');
        }
        const subManager = this.subManagers[options.type];
        if (!subManager) {
            throw new Error(`factory for node type ${options.type} not found`);
        }
        const node = subManager.createNode(options);
        this._addNodeToTypeMap(node.id, options.type);
        this._addNodeToTeleGraph(node.id, options.type);
        this._addNodeToFlow(node);
    }

    private _addNodeToTeleGraph(id: string, type: AppNodeType) {
        this.telecom.registerNode(CommunicationNode.fromDefinition({
            id: id,
            ports: { ...this.portDefs[type] }
        }))
    }

    private _addNodeToTypeMap(id: string, type: AppNodeType) {
        this.nodeTypes[id] = type;
    }

    private _removeNodeFromTypeMap(id: string) {
        delete this.nodeTypes[id];
    }

    public removeNode(nodeId: string) {
        const type = this.nodeTypes[nodeId];
        if (type === undefined) {
            throw new Error(`node ${nodeId} has no type`);
        }
        const subManager = this.subManagers[type as AppNodeTypes];
        if (!subManager) {
            throw new Error(`factory for node type ${type} not found`);
        }
        subManager.destroyNode(nodeId);
        this._removeNodeFromTypeMap(nodeId);
        this._removeNodeFromTeleGraph(nodeId);
        this._removeNodeFromFlow(nodeId);
    }

    private _removeNodeFromTeleGraph(id: string) {
        this.telecom.unregisterNode(id)
    }

    private addEdge(edge: Edge) {
        if (edge.type === undefined) {
            throw new Error('edge.type is undefined');
        }
        this.edgeTypes[edge.id] = edge.type;
        this._addEdge(edge);
    }

    private removeEdge(edgeId: string) {
        const edge = this.edgeTypes[edgeId];
        if (!edge) {
            throw new Error(`edge ${edgeId} not found`);
        }
        delete this.edgeTypes[edgeId];
        this._removeEdge(edgeId);
    }

    onConnect(connection: Connection) {
        console.log('onConnect', connection);
        const edge = this.createEdge(connection);
        console.log('edge', edge);

        if (!edge) {
            return;
        }
        this.telecom.connect(edge.source, edge.sourceHandle!, edge.target, edge.targetHandle!); // it throws
        this.addEdge(edge);
    }

    onDisconnect(id: string) {
        const edge = this.edges.find(edge => edge.id === id);
        if (!edge) {
            throw new Error(`edge ${id} not found`);
        }
        this.telecom.disconnect(edge.source, edge.sourceHandle!, edge.target, edge.targetHandle!); // it throws
        this.removeEdge(id);
    }

    getCommunicationNode(id: string) {
        return this.telecom.getNode(id);
    }

    private createEdge(connection: Connection): Edge | undefined {
        const id = createSourceTargetId(connection.source, connection.sourceHandle, connection.target, connection.targetHandle);
        let parsed: ParsedSourceTargetId
        try {
            parsed = parseSourceTargetId(id);
        } catch (error) {
            console.warn(error);
            return undefined;
        }
        const [source, sourceHandle, target, targetHandle] = parsed;

        return {
            id,
            source,
            target,
            sourceHandle,
            targetHandle,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#4776dd',
            },
            style: {
                strokeWidth: 1.2,
                stroke: '#4776dd',
            },
        };
    }
}
