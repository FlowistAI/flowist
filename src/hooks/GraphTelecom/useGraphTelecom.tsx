import { atomFamily, useRecoilValue } from 'recoil'
import { GraphTelecom } from '../../libs/GraphTelecom/GraphTelecom'

const graphTelecomStateFamily = atomFamily({
    key: 'graphTelecomState',
    default: () => new GraphTelecom(),
})


export type GraphTelecomHookOptions = {
    workspaceId: string
}

export function useGraphTelecom({ workspaceId }: GraphTelecomHookOptions) {
    const graphTelecom = useRecoilValue(graphTelecomStateFamily(workspaceId))
    return graphTelecom
}

