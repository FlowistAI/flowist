import { exposeApiToGlobalWindow } from '../src/shared/ipcs'

exposeApiToGlobalWindow({
    exposeAll: true, // expose handlers, invokers and removers
})
