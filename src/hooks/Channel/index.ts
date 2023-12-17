import * as yup from 'yup';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Receiver {
    onMessage: (data: any) => void;
}

interface Channel {
    sourceNodeId: string;
    targetNodeId: string;
    dataSchema: yup.Schema<any>;
}

interface BusContextValue {
    registerNode: (nodeId: string) => void;
    unregisterNode: (nodeId: string) => void;
    registerChannel: (sourceNodeId: string, targetNodeId: string, dataSchema: yup.Schema<any>) => void;
    sendMessage: (sourceNodeId: string, targetNodeId: string, data: any) => void;
    unregisterChannel: (sourceNodeId: string, targetNodeId: string) => void;
}

const BusContext = createContext<BusContextValue | undefined>(undefined);

interface BusProviderProps {
    children: ReactNode;
}

const BusProvider = ({ children }: BusProviderProps) => {
    const [nodes, setNodes] = useState<{ [nodeId: string]: Receiver }>({});
    const [channels, setChannels] = useState<{ [channelKey: string]: Channel }>({});

    const registerNode = (nodeId: string) => {

    };

    const unregisterNode = (nodeId: string) => {
        setNodes((prevNodes) => {
            const newNodes = { ...prevNodes };
            delete newNodes[nodeId];
            return newNodes;
        });
    };

    const unregisterChannel = (sourceNodeId: string, targetNodeId: string) => {
        const channelKey = `${sourceNodeId}-${targetNodeId}`;
        setChannels((prevChannels) => {
            const newChannels = { ...prevChannels };
            delete newChannels[channelKey];
            return newChannels;
        });
    };

    const registerChannel = (sourceNodeId: string, targetNodeId: string, dataSchema: yup.Schema<any>) => {
        const channelKey = `${sourceNodeId}-${targetNodeId}`;
        setChannels((prevChannels) => ({
            ...prevChannels,
            [channelKey]: { sourceNodeId, targetNodeId, dataSchema },
        }));
    };

    const sendMessage = (sourceNodeId: string, targetNodeId: string, data: any) => {
        const channelKey = `${sourceNodeId}-${targetNodeId}`;
        const channel = channels[channelKey];
        if (channel && nodes[sourceNodeId] && nodes[targetNodeId]) {
            try {
                const validData = channel.dataSchema.validateSync(data);
                nodes[targetNodeId].onMessage(validData);
            } catch (error) {
                console.error("Data validation failed:", error);
            }
        } else {
            console.error("Cannot send message, channel or nodes not ready");
        }
    };

    const contextValue: BusContextValue = {
        registerNode,
        unregisterNode,
        registerChannel,
        sendMessage,
        unregisterChannel,
    };

    return <BusContext.Provider value={ contextValue }> { children } < /BusContext.Provider>;
};

const useCommunicationBus = (nodeId: string) => {
    const bus = useContext(BusContext);

    useEffect(() => {
        if (bus) {
            bus.registerNode(nodeId);
            return () => {
                bus.unregisterNode(nodeId);
            };
        }
    }, [nodeId, bus]);

    const registerChannel = (sourceNodeId: string, targetNodeId: string, dataSchema: yup.Schema<any>) => {
        if (bus) {
            bus.registerChannel(sourceNodeId, targetNodeId, dataSchema);
            return () => {
                bus.unregisterChannel(sourceNodeId, targetNodeId);
            };
        }
    };

    return {
        registerChannel,
        sendMessage: bus?.sendMessage,
    };
};

export { BusProvider, useCommunicationBus };

export const Example(){
    const { registerChannel, sendMessage } = useCommunicationBus('nodeId');

    useEffect(() => {
        const unregisterChannel = registerChannel('sourceNodeId', 'targetNodeId', yup.object().shape({
            message: yup.string().required(),
        }));

        return () => {
            unregisterChannel();
        };
    }, [registerChannel]);

    const handleClick = () => {
        sendMessage('sourceNodeId', 'targetNodeId', { message: 'Hello World' });
    };

    return <button onClick={ handleClick }> Send Message < /button>;
}
