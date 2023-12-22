import { useCallback, useEffect, useMemo } from 'react'
import { ShortcutScope, parseShortcutString } from './misc'

export type ShortcutsHookOptions = {
    scope?: ShortcutScope
    bindings?: {
        [shortcutString: string]: (event: KeyboardEvent) => void
    }
}

export function useShortcuts({
    scope = window,
    bindings,
}: ShortcutsHookOptions) {
    const normalizedBindings = useMemo(() => {
        // normalized means key has no /s and is lowercase
        const normalized: ShortcutsHookOptions['bindings'] = {}

        Object.entries(bindings ?? {}).forEach(([shortcutString, handler]) => {
            const parsed = parseShortcutString(shortcutString)
            parsed.forEach(({ key, ctrlKey, shiftKey, altKey, metaKey }) => {
                const normalizedKey = key.toLowerCase().replace(/\//g, '')
                const shorcut = [
                    ctrlKey ? 'ctrl+' : '',
                    shiftKey ? 'shift+' : '',
                    altKey ? 'alt+' : '',
                    metaKey ? 'meta+' : '',
                    normalizedKey,
                ].join('')

                if (normalized[shorcut]) {
                    throw new Error(
                        `Shortcut ${shorcut} is already defined. Please use a different shortcut`,
                    )
                }

                console.log('register shortcut', shorcut)

                normalized[shorcut] = handler
            }, {})
        })

        return normalized
    }, [bindings])

    const locateBinding = useCallback(
        (event: KeyboardEvent) => {
            const { key, ctrlKey, shiftKey, altKey, metaKey } = event
            const normalizedKey = key.toLowerCase().replace(/\//g, '')
            const shorcut = [
                ctrlKey ? 'ctrl+' : '',
                shiftKey ? 'shift+' : '',
                altKey ? 'alt+' : '',
                metaKey ? 'meta+' : '',
                normalizedKey,
            ].join('')

            const handler = normalizedBindings[shorcut]
            if (!handler) {
                return undefined
            }

            return {
                handler,
            }
        },
        [normalizedBindings],
    )

    const handleEvent = useCallback(
        (event: KeyboardEvent) => {
            const binding = locateBinding(event)
            if (!binding) {
                return
            }

            binding.handler(event)
            event.preventDefault()
        },
        [locateBinding],
    )

    useEffect(() => {
        scope.addEventListener('keydown', handleEvent)

        return () => {
            scope.removeEventListener('keydown', handleEvent)
        }
    }, [handleEvent, scope])
}
