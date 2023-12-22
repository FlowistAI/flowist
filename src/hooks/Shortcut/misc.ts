export interface ShortcutScope {
    addEventListener: (
        type: 'keydown',
        listener: (event: KeyboardEvent) => void,
    ) => void
    removeEventListener: (
        type: 'keydown',
        listener: (event: KeyboardEvent) => void,
    ) => void
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
