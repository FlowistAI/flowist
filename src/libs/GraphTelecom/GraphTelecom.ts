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
            throw new Error(`No handlers for event ${String(eventName)}`);
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

type Message = any; // Define Message type as needed

interface CommunicationPort {
    id: string;
    nodeId: string; // Reference to the owning node's ID
    type: 'input' | 'output';
}

export class CommunicationNode {
    id: string;
    inputPorts: CommunicationPort[];
    outputPorts: CommunicationPort[];
    onMessage: (portId: string, message: Message) => void;
    _sendMessage: (outputPortId: string, message: Message) => void;

    constructor(id: string, onMessage: (portId: string, message: Message) => void) {
        this.id = id;
        this.inputPorts = [];
        this.outputPorts = [];
        this.onMessage = onMessage;
        this._sendMessage = () => { throw new Error('sendMessage not ready') };
    }

    setUp(sendMessage: (outputPortId: string, message: Message) => void) {
        this._sendMessage = sendMessage;
    }

    tearDown() {
        this._sendMessage = () => { throw new Error('sendMessage not ready') };
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

    sendMessage(outputPortId: string, message: Message): void {
        // Find the output port with the given ID
        const outputPort = this.outputPorts.find(port => port.id === outputPortId);
        if (outputPort) {
            // Emit a message event with the output port ID and message
            this._sendMessage(outputPort.id, message);
        } else {
            throw new Error(`Output port ${outputPortId} not found in node ${this.id}`);
        }
    }
}

type NodeId = string;
type PortId = string;
type NodePortId = string; // nodeId:portId
type CommunicateMsg = { from: NodePortId; to: NodePortId; message: Message };
type PortListener = (message: CommunicateMsg) => void;
type SourceTargetId = string; // sourceNodeId:sourcePortId-targetNodeId:targetPortId

export class GraphTelecom {
    private nodes: Map<NodeId, CommunicationNode>;
    private eventEmitter: EventEmitter<CommunicateMsg>;
    private portListeners: Map<SourceTargetId, PortListener> = new Map();

    constructor() {
        this.nodes = new Map();
        this.eventEmitter = new EventEmitter();
    }

    registerNode(node: CommunicationNode): void {
        this.nodes.set(node.id, node);
        node.setUp((outputPortId, message) => {
            const outputNodePortId = `${node.id}:${outputPortId}`;
            const connectionInfo = this.getConnectionInfo(node.id);
            Object.entries(connectionInfo.outgoing).forEach(([targetNodeId, targetPortId]) => {
                const inputNodePortId = `${targetNodeId}:${targetPortId}`;
                this.eventEmitter.emit('message', { from: outputNodePortId, to: inputNodePortId, message });
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
                this.eventEmitter.off('message', listener);
                this.portListeners.delete(listenerKey);
            }
        });

        node.outputPorts.forEach(port => {
            this.portListeners.forEach((listener, key) => {
                if (key.startsWith(`${nodeId}:${port.id}-`)) {
                    this.eventEmitter.off('message', listener);
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

        const listener: PortListener = ({ from, to, message }) => {
            if (!from || !to) {
                throw new Error(`Invalid message: ${JSON.stringify({ from, to, message })}`);
            }
            if (from === outputNodePortId && to === inputNodePortId) {
                inputNode.onMessage(inputPortId, message);
            }
        };

        this.portListeners.set(`${outputNodePortId}-${inputNodePortId}`, listener);
        this.eventEmitter.on('message', listener);
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
        this.eventEmitter.off('message', listener);
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
