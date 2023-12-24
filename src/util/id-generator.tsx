import { v4 as uuidv4 } from 'uuid'

/**
 * A simple id generator, which generates id in the form of
 *  A, B, C, ..., Z, AA, AB, AC, ..., AZ, BA, BB, BC, ... like Excel
 *
 */
export class NodeIdGenerator {
    private _index: number

    get index() {
        return this._index
    }

    private set index(value: number) {
        this._index = value
    }

    constructor(initialIndex?: number) {
        this._index = initialIndex ?? 0
    }

    public next(): string {
        let id = this.index++
        let ret = ''

        while (id >= 0) {
            const remainder = id % 26
            ret = String.fromCharCode(65 + remainder) + ret
            id = Math.floor(id / 26) - 1
        }

        return ret
    }
}

// for business realated id
export const generateUUID = () => uuidv4()

export type UUID = string
