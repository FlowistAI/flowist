import localforage from 'localforage'

export async function persistData<T>(key: string, value: T) {
    return await localforage.setItem(key, value)
}

export async function retrieveData<T>(key: string) {
    return await localforage.getItem<T>(key)
}
