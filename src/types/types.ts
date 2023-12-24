/* eslint-disable @typescript-eslint/no-explicit-any */
export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

export type HasId = { id: string }

export type OptionalId<T extends HasId> = Omit<T, 'id'> & { id?: T['id'] }
