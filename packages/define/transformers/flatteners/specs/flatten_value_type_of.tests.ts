import { flattenValueTypeOf } from 'transformers/flatteners/flatten_value_type_of'
import {
  boolean,
  list,
  number,
  struct,
} from 'types/builders'

describe('flattenValueOf', function () {
  // note that we already have tests for the type and the function that this calls, so
  // this is only a sanity check
  it('flattens', function () {
    const flattened = flattenValueTypeOf(
      struct()
        .set('a', list(number))
        .set('b', boolean),
      {
        a: [
          1,
          2,
          4,
        ],
        b: false,
      },
    )
    expect(flattened).toEqual({
      $: {
        a: [
          1,
          2,
          4,
        ],
        b: false,
      },
      '$.a': [
        1,
        2,
        4,
      ],
      '$.a[0]': 1,
      '$.a[1]': 2,
      '$.a[2]': 4,
      '$.b': false,
    })
  })
})