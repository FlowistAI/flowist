import { CommunicationNode, GraphTelecom } from './GraphTelecom';

describe('CommunicationNode', () => {
    let node: CommunicationNode;
    let onMessageMock: jest.Mock;

    beforeEach(() => {
        onMessageMock = jest.fn();
        node = new CommunicationNode('node1', onMessageMock);
    });

    test('addInputPort should add a new input port', () => {
        node.addInputPort('input1');
        expect(node.inputPorts).toEqual([{ id: 'input1', nodeId: 'node1', type: 'input' }]);
    });

    test('addOutputPort should add a new output port', () => {
        node.addOutputPort('output1');
        expect(node.outputPorts).toEqual([{ id: 'output1', nodeId: 'node1', type: 'output' }]);
    });

    test('sendMessage should throw an error if the output port is not found', () => {
        expect(() => {
            node.sendMessage('output1', { text: 'Hello' });
        }).toThrowError('Output port output1 not found in node node1');
    });
});

describe('Telecommunicator', () => {
    let telecommunicator: GraphTelecom;
    let node1: CommunicationNode;
    let node2: CommunicationNode;

    beforeEach(() => {
        telecommunicator = new GraphTelecom();
        node1 = new CommunicationNode('node1', jest.fn());
        node2 = new CommunicationNode('node2', jest.fn());
        telecommunicator.registerNode(node1);
        telecommunicator.registerNode(node2);
    });

    test('addNode should add a new node', () => {
        const node3 = new CommunicationNode('node3', jest.fn());
        telecommunicator.registerNode(node3);
        expect(telecommunicator['nodes'].size).toBe(3);
    });

    test('connect should connect output port of one node to the input port of another node', () => {
        node1.addOutputPort('output1');
        node2.addInputPort('input1');
        telecommunicator.connect('node1', 'output1', 'node2', 'input1');
        expect(telecommunicator.isReceivingFromPort('node2', 'node1', 'output1')).toBe(true);
        expect(telecommunicator.isSendingToPort('node1', 'node2', 'input1')).toBe(true);
    });

    test('connect should throw an error if the output or input node is not found', () => {
        expect(() => {
            telecommunicator.connect('node1', 'output1', 'node3', 'input1');
        }).toThrow('Output node node1 or input node node3 not found in the graph');
    });

    test('removeNode should remove a node and disconnect its ports', () => {
        node1.addOutputPort('output1');
        node2.addInputPort('input1');
        telecommunicator.connect('node1', 'output1', 'node2', 'input1');
        telecommunicator.unregisterNode('node1');
        expect(telecommunicator['nodes'].size).toBe(1);
        expect(telecommunicator.isReceivingFromPort('node2', 'node1', 'output1')).toBe(false);
        expect(telecommunicator.isSendingToPort('node1', 'node2', 'input1')).toBe(false);
    });

    test('removeNode should throw an error if the node is not found', () => {
        expect(() => {
            telecommunicator.unregisterNode('node3');
        }).toThrow('Node node3 not found in the graph');
    });

    test('should send a message from one node to another', () => {
        node1.addOutputPort('output1');
        node2.addInputPort('input1');
        telecommunicator.connect('node1', 'output1', 'node2', 'input1');
        const message = { text: 'Hello' };
        node1.sendMessage('output1', message);
        expect(node2.onMessage).toHaveBeenCalledWith('input1', message);
        expect(node2.onMessage).toHaveBeenCalledTimes(1);
        expect(node1.onMessage).toHaveBeenCalledTimes(0);

        // remove connection, should not send message
        telecommunicator.disconnect('node1', 'output1', 'node2', 'input1');
        node1.sendMessage('output1', message);
        expect(node2.onMessage).toHaveBeenCalledTimes(1);
    })

    test('should not disconnect non-existing connection', () => {
        expect(() => {
            telecommunicator.disconnect('node1', 'output1', 'node2', 'input1');
        }).toThrow('No listener for output port node1:output1 and input port node2:input1');
    })
});
