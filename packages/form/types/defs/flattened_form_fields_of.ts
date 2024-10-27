import {
  type InternalValueTypeOf,
  type TypeDef,
} from '@tscriptors/core'
import { type ReadonlyRecord } from '@tscriptors/core/util/record'

export type FlattenedFormFieldsOf<R extends ReadonlyRecord<string, TypeDef>, E> = {
  [K in keyof R]: {
    value: InternalValueTypeOf<R[K]>,
    error: E,
  }
}

export type FlattenedFormValuesOf<R extends ReadonlyRecord<string, TypeDef>> = {
  [K in keyof R]: {
    value: InternalValueTypeOf<R[K]>,
  }
}