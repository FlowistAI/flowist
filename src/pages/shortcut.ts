import { useCallback, useEffect } from 'react'

export type ShortcutsHookOptions = {
    bindings?: {
        [shortcutString: string]: (event: KeyboardEvent) => void
    }
}

export function parseShortcutString(shortcutString: string) {
    // ctrl+shift+alt+key/command+shift+option+key
    const alternative = shortcutString.split('/')
    const results = alternative.map((shortcut) => {
        const parts = shortcut.split('+')
        const key = parts.pop() as string

        return {
            key,
            ctrlKey: parts.includes('ctrl'),
            shiftKey: parts.includes('shift'),
            altKey: parts.includes('alt') || parts.includes('option'),
            metaKey: parts.includes('meta') || parts.includes('command'),
        }
    })

    return results
}

export function useShortcuts({ bindings }: ShortcutsHookOptions) {
    const parsedBindings = Object.entries(bindings ?? {}).map(
        ([shortcutString, handler]) => {
            const parsed = parseShortcutString(shortcutString)

            return {
                parsed,
                handler,
            }
        },
    )

    const locateBinding = useCallback(
        (event: KeyboardEvent) => {
            const binding = parsedBindings.find(({ parsed }) => {
                const { key, ctrlKey, shiftKey, altKey, metaKey } = parsed[0]

                return (
                    event.key === key &&
                    event.ctrlKey === ctrlKey &&
                    event.shiftKey === shiftKey &&
                    event.altKey === altKey &&
                    event.metaKey === metaKey
                )
            })

            return binding
        },
        [parsedBindings],
    )

    const globalShortcutHandler = useCallback(
        (event: KeyboardEvent) => {
            const binding = locateBinding(event)

            if (binding) {
                binding.handler(event)
            }
        },
        [locateBinding],
    )

    useEffect(() => {
        window.addEventListener('keydown', globalShortcutHandler)

        return () => {
            window.removeEventListener('keydown', globalShortcutHandler)
        }
    }, [globalShortcutHandler])
}
