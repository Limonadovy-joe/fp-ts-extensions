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
  <A>({ compare, equals }: Ord<A>) =>
  (x: A, y: A) =>
    equals(x, y) || compare(x, y) <= 0 ? x : y;

/**
 * @category utils
 */
export const max =
  <A>({ compare, equals }: Ord<A>) =>
  (x: A, y: A) =>
    equals(x, y) || compare(x, y) === -1 ? y : x;

/**
 * @category utils
 */
export const tuple = <A extends ReadonlyArray<unknown>>(...ords: { [K in keyof A]: Ord<A[K]> }): Ord<Readonly<A>> => ({
  compare: (tupleA, tupleB) =>
    ords.reduce<Ordering>((acc, ord, index) => ord.compare(tupleA[index], tupleB[index]) || acc, 0),
  equals: (tupleA, tupleB) => ords.every(({ compare }, index) => compare(tupleA[index], tupleB[index]) === 0)
});

export const reverse = <A>(ord: Ord<A>): Ord<A> => ({
  compare: (x, y) => [ord.compare(x, y)].map((ordering) => (ordering !== 0 ? -ordering : 0))[0] as Ordering,
  equals: equalsDefault(ord.compare)
});

export const clamp = <A>(ord: Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const hightLimit = min(ord);
  const lowLimit = max(ord);
  const isOverLimit = gt(ord);

  return (low, hig) => (val) => isOverLimit(val, hig) ? hightLimit(val, hig) : lowLimit(val, low);
};

/**
 * Lower then
 * Tests whether x is lower then y
 * x < y
 */
export const lt =
  <A>({ compare }: Ord<A>) =>
  (x: A, y: A): boolean =>
    compare(x, y) === -1;

/**
 * Greater then
 * Tests whether x is greater then y
 * x > y
 */
export const gt =
  <A>({ compare }: Ord<A>) =>
  (x: A, y: A): boolean =>
    compare(x, y) === 1;

/**
 * Lower then equal
 * Tests whether x is lower then  equal y
 * x <= y
 */
export const leq =
  <A>(ord: Ord<A>) =>
  (x: A, y: A): boolean =>
    ord.compare(x, y) === 0 || lt(ord)(x, y);

/**
 * Greater then equal
 * Tests whether x is greater then equal y
 * x <= y
 */
export const geq =
  <A>(ord: Ord<A>) =>
  (x: A, y: A): boolean =>
    ord.compare(x, y) === 0 || gt(ord)(x, y);

/**
 * Tests whether val is between min and max inclusive
 */
export const between =
  <A>(ord: Ord<A>) =>
  (x: A, y: A) =>
  (val: A): boolean =>
    clamp(ord)(x, y)(val) === val;

export const contramap =
  <A, B>(map: (a: B) => A) =>
  ({ equals, compare }: Ord<A>): Ord<B> => ({
    equals: (x, y) => equals(map(x), map(y)),
    compare: (x, y) => compare(map(x), map(y))
  });
