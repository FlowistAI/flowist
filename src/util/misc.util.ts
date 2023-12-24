export function replacePrompt(prompt: string, input: string) {
    if (!prompt.includes('{{input}}')) {
        return prompt + input
    }

    return prompt.replace('{{input}}', input)
}

export function joinUrl(...parts: string[]) {
    return parts
        .map((part) => {
            if (part.startsWith('/')) {
                return part.slice(1)
            }

            if (part.endsWith('/')) {
                return part.slice(0, -1)
            }

            return part
        }, '')
        .join('/')
}
