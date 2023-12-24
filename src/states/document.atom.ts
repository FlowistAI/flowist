/* eslint-disable @typescript-eslint/no-explicit-any */
import { Getter, Setter, atom, useAtomValue, useSetAtom } from 'jotai'
import {
    Connection,
    Edge,
    EdgeChange,
    MarkerType,
    Node,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from 'reactflow'
import {
    CommunicationNode,
    GraphTelecom,
    ParsedSourceTargetId,
    createSourceTargetId,
    parseSourceTargetId,
} from '../libs/GraphTelecom/GraphTelecom'
import { IFileService } from '../services/file-service/file.service'
import { NodeIdGenerator } from '../util/id-generator'
import { JotaiContext } from './index.type'
import {
    PORT_DEFINITIONS,
    WidgetData,
    WidgetType,
    widgetHandlersAtom,
    widgetsDataAtom,
} from './widgets/widget.atom'
import { Optional } from '../types/types'
import { createFileService } from '../services/file-service/factory'
import { useMemo } from 'react'
import { produce } from 'immer'

export type Document = {
    name: string
    index: number
    nodes: Node[]
    edges: Edge[]
    widgetsData: WidgetData
}

export type AddWidgetOptions<T extends WidgetType, NodeData = any> = {
    type: T
    data?: Partial<Node<NodeData, T>>
    preset?: any
}

export const useDocument = () => ({
    state: useAtomValue(documentAtom),
    dispatch: useSetAtom(documentAtom),
})

export const useCommunicate = (id: string) => {
    const { handleSignal, signal } =
        useAtomValue(graphTelecomAtom).getNode(id) ?? {}

    return useMemo(() => ({ handleSignal, signal }), [handleSignal, signal])
}

const documentNameAtom = atom('Untitled')

const nodesAtom = atom<Node[]>([])

const edgesAtom = atom<Edge[]>([])

const nodeIdGeneratorAtom = atom(new NodeIdGenerator())

const nodeTypeMapAtom = atom<Record<string, WidgetType>>({})

const graphTelecomAtom = atom(new GraphTelecom())

const fileServiceAtom = atom<Optional<IFileService>>(undefined)

export type DocumentAction<T extends WidgetType> =
    | { type: 'add-widget'; options: AddWidgetOptions<T> }
    | { type: 'remove-widget'; id: string }
    | { type: 'connect'; connection: Connection }
    | { type: 'disconnect'; connection: Connection }
    | { type: 'disconnectSelection' }
    | { type: 'restore'; document: Document }
    | { type: 'save' }
    | { type: 'load' }
    | {
          type: 'flow-change'
          edgeChanges?: EdgeChange[]
          nodeChanges?: NodeChange[]
      }

export const documentAtom = atom((get): Document => {
    return {
        name: get(documentNameAtom),
        index: get(nodeIdGeneratorAtom).index,
        nodes: get(nodesAtom),
        edges: get(edgesAtom),
        widgetsData: get(widgetsDataAtom) as any,
    }
}, handleAction)

function handleAction<T extends DocumentAction<WidgetType>>(
    get: Getter,
    set: Setter,
    action: T,
): ActionResultMapping[T['type']] {
    // (get, set, action: DocumentAction<WidgetType>) => {
    const ctx = { get, set }
    if (action.type !== 'flow-change') {
        console.log('document action', action)
    }

    switch (action.type) {
        case 'add-widget':
            return handleAddWidget(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'remove-widget':
            return handleRemoveWidget(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'connect':
            return handleConnect(ctx, action) as ActionResultMapping[T['type']]
        case 'disconnect':
            return handleDisconnect(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'disconnectSelection':
            return handleDisconnectSelection(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'restore':
            return handleRestore(ctx, action) as ActionResultMapping[T['type']]
        case 'save':
            return handleSaveAsync(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'load':
            return handleLoadAsync(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
        case 'flow-change':
            return handleFlowChange(
                ctx,
                action,
            ) as ActionResultMapping[T['type']]
    }
}

type ActionResultMapping = {
    'add-widget': ReturnType<typeof handleAddWidget>
    'remove-widget': ReturnType<typeof handleRemoveWidget>
    connect: ReturnType<typeof handleConnect>
    disconnect: ReturnType<typeof handleDisconnect>
    disconnectSelection: ReturnType<typeof handleDisconnectSelection>
    restore: ReturnType<typeof handleRestore>
    save: ReturnType<typeof handleSaveAsync>
    load: ReturnType<typeof handleLoadAsync>
    'flow-change': ReturnType<typeof handleFlowChange>
}

function handleAddWidget(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'add-widget' },
) {
    const { get } = ctx
    const { options } = action
    const { type } = options

    const id = options.data?.id ?? get(nodeIdGeneratorAtom).next()
    if (get(nodeTypeMapAtom)[id]) {
        throw new Error('node id already exists')
    }

    const node = get(widgetHandlersAtom)[type].create(ctx, id, options)

    console.assert(node.id)

    addNodeToTypeMap(ctx, id, type)

    get(graphTelecomAtom).registerNode(
        CommunicationNode.fromDefinition({
            id: id,
            ports: PORT_DEFINITIONS[type],
        }),
    )

    addRawNodeToFlow(ctx, node)
}

function handleRemoveWidget(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'remove-widget' },
) {
    const { get } = ctx
    const { id } = action

    const type = get(nodeTypeMapAtom)[id]
    if (!type) {
        throw new Error('node id does not exist')
    }

    get(widgetHandlersAtom)[type].destroy(ctx, id)
    get(graphTelecomAtom).unregisterNode(id)

    removeAttachedEdge(ctx, id)
    removeRawNodeFromFlow(ctx, id)
    removeNodeFromTypeMap(ctx, id)
}

function removeAttachedEdge({ set }: JotaiContext, wid: string) {
    set(edgesAtom, (prev) =>
        prev.filter((edge) => edge.source !== wid && edge.target !== wid),
    )
}

function removeRawNodeFromFlow({ set }: JotaiContext, id: string) {
    set(nodesAtom, (prev) => prev.filter((node) => node.id !== id))
}

function addRawNodeToFlow({ set }: JotaiContext, node: Node) {
    set(nodesAtom, (prev) => [...prev, node])
}

function removeNodeFromTypeMap({ set }: JotaiContext, id: string) {
    set(nodeTypeMapAtom, (prev) => {
        const next = { ...prev }
        delete next[id]

        return next
    })
}

function addNodeToTypeMap({ set }: JotaiContext, id: string, type: WidgetType) {
    set(nodeTypeMapAtom, (prev) => ({ ...prev, [id]: type }))
}

function handleConnect(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'connect' },
) {
    const { get } = ctx
    const { connection } = action

    const edge = createEdge(connection)
    if (!edge) {
        return
    }

    get(graphTelecomAtom).connect(
        edge.source,
        edge.sourceHandle!,
        edge.target,
        edge.targetHandle!,
    ) // it throws
    addRawEdgeToFlow(ctx, edge)
}

function handleDisconnect(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'disconnect' },
) {
    const { get } = ctx
    const { connection } = action

    const edge = createEdge(connection)
    if (!edge) {
        return
    }

    get(graphTelecomAtom).disconnect(
        edge.source,
        edge.sourceHandle!,
        edge.target,
        edge.targetHandle!,
    ) // it throws
    removeRawEdgeFromFlow(ctx, edge.id)
}

function handleDisconnectSelection(
    ctx: JotaiContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: DocumentAction<WidgetType> & { type: 'disconnectSelection' },
) {
    const { get } = ctx

    const selectedEdges = get(edgesAtom).filter((edge) => edge.selected)
    selectedEdges.forEach((edge) => {
        handleDisconnect(ctx, {
            type: 'disconnect',
            connection: {
                source: edge.source,
                sourceHandle: edge.sourceHandle!,
                target: edge.target,
                targetHandle: edge.targetHandle!,
            },
        })
    })
}

function addRawEdgeToFlow({ set }: JotaiContext, edge: Edge) {
    set(edgesAtom, (prev) => [...prev, edge])
}

function removeRawEdgeFromFlow({ set }: JotaiContext, id: string) {
    set(edgesAtom, (prev) => prev.filter((edge) => edge.id !== id))
}

function createEdge(connection: Connection): Edge | undefined {
    const id = createSourceTargetId(
        connection.source,
        connection.sourceHandle,
        connection.target,
        connection.targetHandle,
    )
    let parsed: ParsedSourceTargetId

    try {
        parsed = parseSourceTargetId(id)
    } catch (error) {
        console.warn(error)

        return undefined
    }

    const [source, sourceHandle, target, targetHandle] = parsed

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
    }
}

function handleRestore(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'restore' },
) {
    const { get, set } = ctx
    const { document } = action

    set(documentNameAtom, document.name)

    Object.entries(document.widgetsData).forEach(([wigetType, data]) => {
        get(widgetHandlersAtom)[wigetType as WidgetType].restore(
            ctx,
            data as any,
        )
    })

    set(nodeIdGeneratorAtom, new NodeIdGenerator(document.index))
    set(nodesAtom, document.nodes)
    set(edgesAtom, document.edges)
}

async function handleSaveAsync(
    ctx: JotaiContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: Extract<DocumentAction<WidgetType>, { type: 'save' }>,
) {
    const { get, set } = ctx
    let fileService = get(fileServiceAtom)

    if (!fileService) {
        console.log('create new file service')

        fileService = await createFileService()
        set(fileServiceAtom, fileService)
    }

    if (!fileService) {
        throw new Error('file service is undefined')
    }

    const snapshot = get(documentAtom)
    if (!fileService.isSelected()) {
        await fileService.selectSavePath('')
    }

    if (fileService.isSelected()) {
        fileService.saveFile(JSON.stringify(snapshot))
    }
}

async function handleLoadAsync(
    ctx: JotaiContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _action: DocumentAction<WidgetType> & { type: 'load' },
) {
    const { get, set } = ctx

    let fileService = get(fileServiceAtom)

    if (!fileService) {
        console.log('create new file service')
        fileService = await createFileService()
        set(fileServiceAtom, fileService)
    }

    if (!fileService) {
        throw new Error('file service is undefined')
    }

    if (!fileService.isSelected()) {
        await fileService.selectOpenPath()
    }

    if (fileService.isSelected()) {
        const snapshot = JSON.parse(await fileService.readFile())
        handleRestore(ctx, { type: 'restore', document: snapshot })
    }
}

function handleFlowChange(
    ctx: JotaiContext,
    action: DocumentAction<WidgetType> & { type: 'flow-change' },
) {
    const { edgeChanges, nodeChanges } = action

    if (edgeChanges) {
        onEdgesChange(ctx, edgeChanges)
    }

    if (nodeChanges) {
        onNodesChange(ctx, nodeChanges)
    }
}

function onEdgesChange(ctx: JotaiContext, changes: EdgeChange[]) {
    // TODO: should not handle edge style here
    return ctx.set(edgesAtom, (eds) => {
        const newEdges = produce(eds, (draft) => {
            for (const edge of draft) {
                const change = changes.find(
                    (change) =>
                        change.type === 'select' && change.id === edge.id,
                )

                if (!(change && change.type === 'select' && edge.style)) {
                    continue
                }

                if (change.selected) {
                    edge.style.strokeWidth =
                        parseFloat(
                            edge.style.strokeWidth as unknown as string,
                        ) * 1.2
                } else {
                    edge.style.strokeWidth =
                        parseFloat(
                            edge.style.strokeWidth as unknown as string,
                        ) / 1.2
                }
            }
        })

        return applyEdgeChanges(changes, newEdges)
    })
}

function onNodesChange(ctx: JotaiContext, changes: NodeChange[]) {
    return ctx.set(nodesAtom, (nds) => {
        return applyNodeChanges(changes, nds)
    })
}
