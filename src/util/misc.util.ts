export function replacePrompt(prompt: string, input: string) {
    if (!prompt.includes('{{input}}')) {
        return prompt + input
    }
    return prompt.replace('{{input}}', input)
}
