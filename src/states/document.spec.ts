/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useAtom } from 'jotai'
import { documentAtom } from './document.atom'

test('useCounter should increment and decrement count correctly', () => {
    // const graph = renderHook(() => useRawGraph())
    // const setChatSessions = renderHook(() =>
    //     useSetAtom(sessionsAtomFamily('chat-bot')),
    // )

    // act(() => {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     setChatSessions.result.current((prev: any) => [...prev, { id: 'new' }])

    //     graph.result.current.addNode({
    //         id: '1',
    //         type: 'input',
    //         position: { x: 0, y: 0 },
    //         data: { label: 'Node 1' },
    //     })
    // })

    const x = renderHook(() => useAtom(documentAtom))
    let r

    act(() => {
        x.result.current[1]({
            type: 'add-widget',
            options: {
                type: 'chat-bot',
                data: {},
            },
        })
    })

    act(() => {
        r = x.result.current[0]
    })

    console.log(r)
})
