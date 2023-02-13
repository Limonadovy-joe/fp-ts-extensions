import { tupleOf } from '../src/Tuple';
import { deepStrictEqual } from './util';

describe('Tuple', () => {
  test('tupleOf', () => {
    deepStrictEqual(tupleOf(1, 2), [1, 2] as const);
    deepStrictEqual(tupleOf(1)(2), [1, 2] as const);
    deepStrictEqual(tupleOf([1, 2] as const, [3, 4] as const), [
      [1, 2],
      [3, 4]
    ] as const);
  });
});
