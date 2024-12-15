import {
  chainFieldConverter,
  chainSafeFieldConverter,
} from 'field_converters/chain_field_converter'
import {
  identityConverter,
  safeIdentityConverter,
} from 'field_converters/identity_converter'
import { listConverter } from 'field_converters/list_converter'
import { MaybeIdentityConverter } from 'field_converters/maybe_identity_converter'
import {
  validatingConverter,
} from 'field_converters/validating_converter'
import { prototypingFieldValueFactory } from 'field_value_factories/prototyping_field_value_factory'
import {
  type FieldConverter,
  type FieldValueFactory,
  type SafeFieldConverter,
  type TwoWayFieldConverter,
  type TwoWayFieldConverterWithValueFactory,
} from 'types/field_converters'
import { type FieldValidator } from 'types/field_validator'

class FieldAdapterBuilder<
  From,
  To,
  E,
  ValuePath extends string,
> {
  constructor(
    readonly convert: SafeFieldConverter<From, To, ValuePath>,
    readonly create: FieldValueFactory<From, ValuePath>,
    readonly revert?: FieldConverter<To, From, E, ValuePath>,
  ) {
  }

  validateFrom<
    E2,
  >(...validators: readonly FieldValidator<From, E2, ValuePath>[]): FieldAdapterBuilder<From, To, E | E2, ValuePath> {
    return new FieldAdapterBuilder(
      this.convert,
      this.create,
      this.revert && chainFieldConverter(
        this.revert,
        validatingConverter(validators),
      ),
    )
  }

  validateTo<
    E2,
  >(...validators: readonly FieldValidator<To, E2, ValuePath>[]): FieldAdapterBuilder<From, To, E | E2, ValuePath> {
    return new FieldAdapterBuilder(
      this.convert,
      this.create,
      this.revert && chainFieldConverter(
        validatingConverter(validators),
        this.revert,
      ),
    )
  }

  chain<To2, E2 = E>(
    converter: SafeFieldConverter<To, To2, ValuePath>,
    reverter?: FieldConverter<To2, To, E2, ValuePath>,
  ): FieldAdapterBuilder<From, To2, E | E2, ValuePath> {
    return new FieldAdapterBuilder(
      chainSafeFieldConverter<
        From,
        To,
        To2,
        ValuePath
      >(
        this.convert,
        converter,
      ),
      this.create,
      this.revert && reverter && chainFieldConverter<
        To2,
        To,
        From,
        E2,
        E,
        ValuePath
      >(
        reverter,
        this.revert,
      ),
    )
  }

  withReverter(reverter: FieldConverter<To, From, E, ValuePath>): FieldAdapterBuilder<From, To, E, ValuePath> {
    return new FieldAdapterBuilder(
      this.convert,
      this.create,
      reverter,
    )
  }

  withIdentity(isFrom: (from: To | From) => from is From): FieldAdapterBuilder<From, To | From, E, ValuePath> {
    const identityConverter = new MaybeIdentityConverter<From, To, E, ValuePath>({
      convert: this.convert,
      // should never get called if null
      revert: this.revert!,
    }, isFrom)
    return new FieldAdapterBuilder(
      identityConverter.convert.bind(identityConverter),
      this.create,
      this.revert && identityConverter.revert.bind(identityConverter),
    )
  }
}

export function adapter<
  From,
  To,
  ValuePath extends string,
>(
  converter: SafeFieldConverter<From, To, ValuePath>,
  valueFactory: FieldValueFactory<From, ValuePath>,
): FieldAdapterBuilder<From, To, never, ValuePath>
export function adapter<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: SafeFieldConverter<From, To, ValuePath>,
  valueFactory: FieldValueFactory<From, ValuePath>,
  reverter: FieldConverter<To, From, E, ValuePath>,
): FieldAdapterBuilder<From, To, E, ValuePath>
export function adapter<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: SafeFieldConverter<From, To, ValuePath>,
  valueFactory: FieldValueFactory<From, ValuePath>,
  reverter?: FieldConverter<To, From, E, ValuePath>,
): FieldAdapterBuilder<From, To, E, ValuePath> {
  return new FieldAdapterBuilder(converter, valueFactory, reverter)
}

export function adapterFromTwoWayConverter<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: TwoWayFieldConverter<From, To, E, ValuePath>,
  valueFactory: FieldValueFactory<From, ValuePath>,
): FieldAdapterBuilder<From, To, E, ValuePath>
export function adapterFromTwoWayConverter<
  From,
  To,
  E,
  ValuePath extends string,
>(converter: TwoWayFieldConverterWithValueFactory<From, To, E, ValuePath>): FieldAdapterBuilder<From, To, E, ValuePath>
export function adapterFromTwoWayConverter<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: TwoWayFieldConverter<From, To, E, ValuePath> | TwoWayFieldConverterWithValueFactory<From, To, E,
    ValuePath>,
  valueFactory: FieldValueFactory<From, ValuePath> =
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (converter as TwoWayFieldConverterWithValueFactory<From, To, E, ValuePath>).create.bind(converter),
): FieldAdapterBuilder<From, To, E, ValuePath> {
  return new FieldAdapterBuilder(
    converter.convert.bind(converter),
    valueFactory,
    converter.revert.bind(converter),
  )
}

export function adapterFromPrototype<
  From,
  To,
  ValuePath extends string,
>(
  converter: SafeFieldConverter<From, To, ValuePath>,
  prototype: From,
): FieldAdapterBuilder<From, To, never, ValuePath>
export function adapterFromPrototype<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: TwoWayFieldConverter<From, To, E, ValuePath>,
  prototype: From,
): FieldAdapterBuilder<From, To, E, ValuePath>
export function adapterFromPrototype<
  From,
  To,
  E,
  ValuePath extends string,
>(
  converter: SafeFieldConverter<From, To, ValuePath> | TwoWayFieldConverter<From, To, E, ValuePath>,
  prototype: From,
): FieldAdapterBuilder<From, To, E, ValuePath> {
  const factory = prototypingFieldValueFactory<From, ValuePath>(prototype)
  return typeof converter === 'function'
    ? new FieldAdapterBuilder(converter, factory)
    : new FieldAdapterBuilder(converter.convert.bind(converter), factory, converter.revert.bind(converter))
}

export function identityAdapter<
  V,
  ValuePath extends string,
>(prototype: V) {
  return new FieldAdapterBuilder(
    safeIdentityConverter<V, ValuePath>(),
    prototypingFieldValueFactory(prototype),
    identityConverter<V, ValuePath>(),
  )
}

export function listAdapter<
  E,
  K extends string,
  ValuePath extends string,
>() {
  return new FieldAdapterBuilder<readonly E[], readonly K[], never, ValuePath>(
    listConverter<E, K, ValuePath>(),
    prototypingFieldValueFactory<readonly E[], ValuePath>([]),
  )
}
