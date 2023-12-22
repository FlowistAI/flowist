import { exposeApiToGlobalWindow } from '../src/shared/ipcs'

const { key, api } = exposeApiToGlobalWindow({
    exposeAll: true, // expose handlers, invokers and removers
})

declare global {
    interface Window {
        [key]: typeof api
    }
}
