import {
  copy,
  type Type,
  type UnionTypeDef,
  type ValueTypeOf,
  type ValueTypesOfDiscriminatedUnion,
} from '@de/fine'
import {
  type FieldConversion,
  FieldConversionResult,
  type TwoWayFieldConverterWithValueFactory,
} from 'types/field_converters'

export abstract class AbstractSelectValueTypeConverter<
  T extends Type,
  Values extends Readonly<Record<string, ValueTypeOf<T>>>,
  ValuePath extends string,
  Context,
> implements TwoWayFieldConverterWithValueFactory<ValueTypeOf<T>, keyof Values, never, ValuePath, Context> {
  constructor(
    protected readonly typeDef: T,
    protected readonly values: Values,
    private readonly defaultValueKey: keyof Values,
  ) {
  }

  revert(from: keyof Values): FieldConversion<ValueTypeOf<T>, never> {
    const prototype = this.values[from]
    const value = copy(this.typeDef, prototype)
    // TODO given we are dealing with strings, maybe we should have a check to make sure value is in the record
    // of values?
    return {
      type: FieldConversionResult.Success,
      value,
    }
  }

  abstract convert(to: ValueTypeOf<T>): keyof Values

  create(): ValueTypeOf<T> {
    return this.values[this.defaultValueKey]
  }
}

export class SelectDiscriminatedUnionConverter<
  U extends UnionTypeDef,
  ValuePath extends string,
  Context,
> extends AbstractSelectValueTypeConverter<Type<U>, ValueTypesOfDiscriminatedUnion<U>, ValuePath, Context> {
  constructor(
    typeDef: Type<U>,
    values: ValueTypesOfDiscriminatedUnion<U>,
    defaultValueKey: keyof U['unions'],
  ) {
    super(
      typeDef,
      values,
      defaultValueKey,
    )
  }

  override convert(to: ValueTypeOf<Type<U>>) {
    const {
      definition: {
        discriminator,
      },
    } = this.typeDef
    return to[discriminator!]
  }
}
