/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactFlowInstance } from 'reactflow';
import { atom } from 'recoil';

export const ReactFlowInstanceState = atom<ReactFlowInstance<any, any>>({
    key: 'reactFlowInstanceState',
    default: undefined,
});
