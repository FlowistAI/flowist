import { atom } from 'recoil'
import { QuerySession } from '../types/query-node-types'

export const querySessionsState = atom<QuerySession[]>({
    key: 'querySessionsState',
    default: [],
})
