import {
  boolean,
  type FlattenedAccessorsOf,
  type FlattenedJsonValueToTypePathsOf,
  type FlattenedTypeDefsOf,
  type FlattenedValueTypesOf,
  type ReadonlyTypeDefOf,
  string,
  struct,
  type ValueTypeOf,
} from '@de/fine'
import { type JsonPathsOf } from '@de/fine/types/json_paths_of'
import { type FlattenedFormFieldsOf } from '@de/form-react'

export const petTypeDef = struct()
  .set('name', string)
  .set('alive', boolean)
  .narrow

export type MutablePet = ValueTypeOf<typeof petTypeDef>
export type Pet = ValueTypeOf<ReadonlyTypeDefOf<typeof petTypeDef>>
export type PetValuePaths = JsonPathsOf<typeof petTypeDef>
export type PetTypePaths = JsonPathsOf<typeof petTypeDef, '*'>
export type FlattenedPetJsonValueToTypePaths = FlattenedJsonValueToTypePathsOf<typeof petTypeDef>
type FlattenedPetTypeDefs = FlattenedTypeDefsOf<typeof petTypeDef, '*'>
export type FlattenedPetValueTypes = FlattenedValueTypesOf<FlattenedPetTypeDefs>
export type FlattenedPetAccessors = FlattenedAccessorsOf<FlattenedPetValueTypes>
export type PetFields = FlattenedFormFieldsOf<FlattenedPetTypeDefs, string>
