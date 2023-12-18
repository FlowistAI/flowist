import { Nullable } from "../../types/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Handler<T> = (value?: T) => void;

export class EventEmitter<T> {
    private eventNameToHandlers: { [event in keyof T]?: Set<Handler<T[event]>> }

    constructor() {
        this.eventNameToHandlers = {};
    }

    emit<K extends keyof T>(eventName: K, value?: T[K]): void {
        const handlers = this.eventNameToHandlers[eventName];
        if (!handlers) {
            // throw new Error(`No handlers for event ${String(eventName)}`);
            return
        }
        handlers.forEach(h => h(value));
    }

    on<K extends keyof T>(eventName: K, callback: Handler<T[K]>): void {
        let handlers = this.eventNameToHandlers[eventName];
        if (!handlers) {
            this.eventNameToHandlers[eventName] = handlers = new Set();
        }
        handlers.add(callback);
    }

    off<K extends keyof T>(eventName: K, callback: Handler<T[K]>): void {
        const handlers = this.eventNameToHandlers[eventName];
        if (!handlers) {
            throw new Error(`No handlers for event ${String(eventName)}`);
        }

        handlers.delete(callback);
        if (handlers.size === 0) {
            delete this.eventNameToHandlers[eventName];
        }
    }
}
/**
 * There are nodes in the graph, each nodes has ports including input and output ports.
 * A node can send event to its output ports, and receive event from its input ports, 
 * and it don't care who are the receivers or senders.
 * 
 * Node ID is unique in the graph. and port ID is unique in the node but not unique in the graph.
 * 
 * Channels are the connections between nodes, and they are one-way.
 */

type Signal = any; // Define Signal type as needed

interface CommunicationPort {
    id: string;
    nodeId: string; // Reference to the owning node's ID
    type: 'input' | 'output';
}

export type SignalHandler = (portId: string, signal: Signal) => void;

export type CommunicationNodeDefinition = {
    id: string;
    ports: {
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
};

export class CommunicationNode {
    id: string;
    inputPorts: CommunicationPort[];
    outputPorts: CommunicationPort[];
    onSignal: SignalHandler;
    eventEmitter: EventEmitter<any> = new EventEmitter(); // todo: use generic type
    _sendSignal: (outputPortId: string, signal: Signal) => void;

    constructor(id: string) {
        this.id = id;
        this.inputPorts = [];
        this.outputPorts = [];
        this.onSignal = (port, data) => {
            this.eventEmitter.emit(port, data);
        }
        this._sendSignal = () => { throw new Error('sendSignal not ready') };
    }

    setHandler(port: string, handler: (data: any) => void) {
        this.eventEmitter.on(port, handler);
    }

    resethandler(port: string, handler: (data: any) => void) {
        this.eventEmitter.off(port, handler);
    }

    static fromDefinition(definition: CommunicationNodeDefinition): CommunicationNode {
        const node = new CommunicationNode(definition.id);
        Object.entries(definition.ports.input).forEach(([portId]) => {
            node.addInputPort(portId);
        });
        Object.entries(definition.ports.output).forEach(([portId]) => {
            node.addOutputPort(portId);
        });
        return node;
    }

    setUp(sendSignal: (outputPortId: string, signal: Signal) => void) {
        this._sendSignal = sendSignal;
    }

    tearDown() {
        this._sendSignal = () => { throw new Error('sendSignal not ready') };
    }

    addInputPort(portId: string): void {
        const port: CommunicationPort = {
            id: portId,
            nodeId: this.id,
            type: 'input',
        };
        this.inputPorts.push(port);
    }

    addOutputPort(portId: string): void {
        const port: CommunicationPort = {
            id: portId,
            nodeId: this.id,
            type: 'output',
        };
        this.outputPorts.push(port);
    }

    signal(outputPortId: string, signal: Signal): void {
        // Find the output port with the given ID
        const outputPort = this.outputPorts.find(port => port.id === outputPortId);
        if (outputPort) {
            // Emit a signal event with the output port ID and signal
            this._sendSignal(outputPort.id, signal);
        } else {
            throw new Error(`Output port ${outputPortId} not found in node ${this.id}`);
        }
    }
}

type NodeId = string;
type PortId = string;
type NodePortId = string; // nodeId:portId
type CommunicateMsg = { from: NodePortId; to: NodePortId; signal: Signal };
type PortListener = (signal: CommunicateMsg) => void;
type SourceTargetId = string; // sourceNodeId:sourcePortId-targetNodeId:targetPortId
export type ParsedSourceTargetId = [NodeId, PortId, NodeId, PortId];

export function createSourceTargetId(
    sourceNodeId?: Nullable<string>, sourcePortId?: Nullable<string>,
    targetNodeId?: Nullable<string>, targetPortId?: Nullable<string>
): SourceTargetId {
    return `${sourceNodeId ?? ''}:${sourcePortId ?? ''}-${targetNodeId ?? ''}:${targetPortId ?? ''}`;
}

export function parseSourceTargetId(sourceTargetId: SourceTargetId) {
    const r = sourceTargetId.split('-').map(s => s.split(':')).flat()
    if (r.length !== 4) {
        throw new Error(`Invalid length of sourceTargetId: ${sourceTargetId}`);
    }

    if (r.some(s => s === '')) {
        throw new Error(`Invalid partial empty sourceTargetId: ${sourceTargetId}`);
    }

    return r as [string, string, string, string];

}

export class GraphTelecom {
    private nodes: Map<NodeId, CommunicationNode>;
    private eventEmitter: EventEmitter<CommunicateMsg>;
    private portListeners: Map<SourceTargetId, PortListener> = new Map();

    constructor() {
        this.nodes = new Map();
        this.eventEmitter = new EventEmitter();
    }

    getNode(nodeId: string): CommunicationNode {
        const node = this.nodes.get(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found in the graph`);
        }
        return node;
    }

    registerNode(node: CommunicationNode): void {
        this.nodes.set(node.id, node);

        // setup a listener for each input port, will be called when a signal is sent to the port
        node.setUp((outputPortId, signal) => {
            const outputNodePortId = `${node.id}:${outputPortId}`;
            const connectionInfo = this.getConnectionInfo(node.id);
            Object.entries(connectionInfo.outgoing).forEach(([targetNodeId, targetPortId]) => {
                const inputNodePortId = `${targetNodeId}:${targetPortId}`;
                this.eventEmitter.emit('signal', { from: outputNodePortId, to: inputNodePortId, signal });
            });
        });
    }

    unregisterNode(nodeId: string): void {
        const node = this.nodes.get(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found in the graph`);
        }

        node.inputPorts.forEach(port => {
            const listenerKey = `${nodeId}:${port.id}`;
            const listener = this.portListeners.get(listenerKey);
            if (listener) {
                this.eventEmitter.off('signal', listener);
                this.portListeners.delete(listenerKey);
            }
        });

        node.outputPorts.forEach(port => {
            this.portListeners.forEach((listener, key) => {
                if (key.startsWith(`${nodeId}:${port.id}-`)) {
                    this.eventEmitter.off('signal', listener);
                    this.portListeners.delete(key);
                }
            });
        });

        node.tearDown();
        this.nodes.delete(nodeId);
    }

    connect(outputNodeId: string, outputPortId: string, inputNodeId: string, inputPortId: string): void {
        const outputNode = this.nodes.get(outputNodeId);
        const inputNode = this.nodes.get(inputNodeId);

        if (!outputNode || !inputNode) {
            throw new Error(`Output node ${outputNodeId} or input node ${inputNodeId} not found in the graph`);
        }

        const outputNodePortId = `${outputNodeId}:${outputPortId}`;
        const inputNodePortId = `${inputNodeId}:${inputPortId}`;

        const listener: PortListener = ({ from, to, signal }) => {
            if (!from || !to) {
                throw new Error(`Invalid signal: ${JSON.stringify({ from, to, signal })}`);
            }
            if (from === outputNodePortId && to === inputNodePortId) {
                inputNode.onSignal(inputPortId, signal);
            }
        };

        this.portListeners.set(`${outputNodePortId}-${inputNodePortId}`, listener);
        this.eventEmitter.on('signal', listener);
    }

    disconnect(outputNodeId: string, outputPortId: string, inputNodeId: string, inputPortId: string): void {
        const outputNode = this.nodes.get(outputNodeId);
        const inputNode = this.nodes.get(inputNodeId);

        if (!outputNode || !inputNode) {
            throw new Error(`Output node ${outputNodeId} or input node ${inputNodeId} not found in the graph`);
        }

        const outputNodePortId = `${outputNodeId}:${outputPortId}`;
        const inputNodePortId = `${inputNodeId}:${inputPortId}`;

        const listener = this.portListeners.get(`${outputNodePortId}-${inputNodePortId}`);
        if (!listener) {
            throw new Error(`No listener for output port ${outputNodePortId} and input port ${inputNodePortId}`);
        }
        this.eventEmitter.off('signal', listener);
        this.portListeners.delete(`${outputNodePortId}-${inputNodePortId}`);
    }

    getConnectionInfo(nodeId: string) {
        const connectionInfo: {
            incoming: Record<NodeId, PortId>
            outgoing: Record<NodeId, PortId>
        } = {
            incoming: {},
            outgoing: {},
        };
        this.portListeners.forEach((_, key) => {
            // outgoing connections
            const [fromNode, fromPort, toNode, toPort] = key.split('-').map(s => s.split(':')).flat();
            if (fromNode === nodeId) {
                connectionInfo.outgoing[toNode] = toPort;
            }
            // incoming connections
            if (toNode === nodeId) {
                connectionInfo.incoming[fromNode] = fromPort;
            }

        })
        return connectionInfo;
    }

    isSendingToNode(nodeId: string, targetNodeId: string) {
        const connectionInfo = this.getConnectionInfo(nodeId);
        return targetNodeId in connectionInfo.outgoing;
    }

    isReceivingFromNode(nodeId: string, sourceNodeId: string) {
        const connectionInfo = this.getConnectionInfo(nodeId);
        return sourceNodeId in connectionInfo.incoming;
    }

    isSendingToPort(nodeId: string, targetNodeId: string, targetPortId: string) {
        const connectionInfo = this.getConnectionInfo(nodeId);
        return connectionInfo.outgoing[targetNodeId] === targetPortId;
    }

    isReceivingFromPort(nodeId: string, sourceNodeId: string, sourcePortId: string) {
        const connectionInfo = this.getConnectionInfo(nodeId);
        return connectionInfo.incoming[sourceNodeId] === sourcePortId;
    }

}
