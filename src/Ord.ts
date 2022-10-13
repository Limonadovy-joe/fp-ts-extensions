import { Eq } from './Eq';
import { Ordering } from './Ordering';

/**
 * @category model
 */
export interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering;
}

/**
 * @category defaults
 */
export const equalsDefault =
  <A>(compare: Ord<A>['compare']): Eq<A>['equals'] =>
  (x, y) =>
    x === y || compare(x, y) === 0;

/**
 * @category constructors
 */
export const fromCompare = <A>(compare: Ord<A>['compare']): Ord<A> => ({
  equals: equalsDefault(compare),
  compare: (x, y) => (x == y ? 0 : compare(x, y))
});

/**
 * @category utils
 */
export const min =
  <A>({ compare }: Ord<A>) =>
  (x: A, y: A) =>
    compare(x, y) === -1 ? x : compare(x, y) === 1 ? y : x;

// export const min =
//   <A>({ compare, equals }: Ord<A>) =>
//   (x: A, y: A) =>
//     equals(x, y) || compare(x, y) <= 0 ? x : y;
