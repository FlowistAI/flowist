export class IdGenerator {
    private index: number;

    constructor() {
        this.index = 0;
    }

    public next(): string {
        let id = this.index++;
        let ret = "";

        while (id >= 0) {
            const remainder = id % 26;
            ret = String.fromCharCode(65 + remainder) + ret;
            id = Math.floor(id / 26) - 1;
        }

        return ret;
    }
}

export const idGenerator = new IdGenerator();

export const generateId = () => idGenerator.next();
