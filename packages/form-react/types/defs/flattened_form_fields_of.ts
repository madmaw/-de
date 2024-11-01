import { type ReadonlyRecord } from '@de/base'
import {
  type InternalValueTypeOf,
  type TypeDef,
} from '@de/fine'

export type FlattenedFormFieldsOf<R extends ReadonlyRecord<string, TypeDef>, E> = {
  [K in keyof R]: {
    value: InternalValueTypeOf<R[K], {}>,
    error?: E,
    disabled: boolean,
  }
}

export type FlattenedFormValuesOf<R extends ReadonlyRecord<string, TypeDef>> = {
  [K in keyof R]: {
    value: InternalValueTypeOf<R[K], {}>,
  }
}
