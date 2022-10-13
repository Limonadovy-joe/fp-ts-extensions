import { getObjectEntries } from './internal';
/**
 * @category model
 */
type EqualsFun<A> = (x: A, y: A) => boolean;

/**
 * @category model
 */
export interface Eq<A> {
  equals: EqualsFun<A>;
}

/**
 * @category constructors
 */
export const fromEquals = <A>(equals: Eq<A>['equals']): Eq<A> => ({ equals: (x, y) => x === y || equals(x, y) });

/**
 * @category instancies
 */
export const eqStrict: Eq<unknown> = { equals: (x, y) => x === y };

/**
 * @category combinators
 */
// const struct = <A extends Record<string, unknown>>(struct: Record<string, Eq<A>>): Eq<A> => ({
//   equals: (x, y) => {
//     const props = Object.keys(struct);
//     return props.every((prop) => struct[prop].equals(x[prop], y[prop]));
//   }
// });

// const struct = <A extends { [K in keyof A]: A[K] }>(struct: { [K in keyof A]: Eq<A[K]> }): Eq<A> => ({
//   equals: <K extends keyof A>(x: A, y: A) => {
//     const props = Object.keys(struct) as K[];
//     return props.every((prop) => struct[prop].equals(x[prop], y[prop]));
//   }
// });

// export const struct = <A extends { [K in keyof A]: A[K] }>(struct: { [K in keyof A]: Eq<A[K]> }): Eq<A> => ({
//   equals: <K extends keyof A>(x: A, y: A) => {
//     const props = Object.keys(struct) as K[];
//     return props
//       .map((key) => [key, x[key], y[key]] as [K, A[K], A[K]])
//       .every(([key, valueA, valueB]) => struct[key].equals(valueA, valueB));
//   }
// });

/**
 * @category combinators
 */
export const struct = <A extends { [K in keyof A]: A[K] }>(struct: { [K in keyof A]: Eq<A[K]> }): Eq<A> => ({
  equals: (x, y) =>
    getObjectEntries(struct)
      .map(([key, eqFun]) => [eqFun.equals, x[key], y[key]] as const)
      .every(([equals, ...params]) => equals(...params))
});

/**
 * @category combinators
 */
export const tuple = <A extends ReadonlyArray<unknown>>(...tuple: { [K in keyof A]: Eq<A[K]> }): Eq<Readonly<A>> => ({
  equals: (x, y) =>
    tuple
      .map((eqFun, index) => [eqFun.equals, x[index], y[index]] as const)
      .every(([equals, ...params]) => equals(...params))
});

/**
 * @category combinators
 */
export const contramap =
  <B, A>(map: (b: B) => A) =>
  ({ equals }: Eq<A>): Eq<B> => ({
    equals: (x, y) => equals(map(x), map(y))
  });
