import { type TypeDefHolder } from './definitions'
import { type FlattenedValueTypesOf } from './flattened_value_types_of'

export type Accessor<T> = {
  readonly value: T,
  set(v: T): void,
}

export type FlattenedAccessorsOf<
  T extends TypeDefHolder,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Flattened extends Readonly<Record<string, Accessor<any>>> = FlattenedValueTypesOf<T>,
> = {
  readonly [K in keyof Flattened]: Accessor<Flattened[K]>
}
