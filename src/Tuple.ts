//  TODO
//  refactor tupleOf fun to use conditional type instead of overloads functions - Done
//  use this as map and chain operations to demonstrate  monad`s features
// export function tupleOf<A>(fst: A): <B>(snd: B) => readonly [A, B];
// export function tupleOf<A, B>(fst: A, snd: B): readonly [A, B];
// export function tupleOf<A, B>(fst: A, snd?: B): readonly [A, B] | (<B>(snd: B) => readonly [A, B]) {
//   if (snd === undefined) {
//     return (snd) => [fst, snd] as const;
//   } else {
//     return [fst, snd] as const;
//   }
// }

type TupleExtractParameter<B extends unknown[]> = B['length'] extends 1 ? B : never;
type TupleReturnType<A, B extends unknown[]> = TupleExtractParameter<B> extends never
  ? <B>(a: B) => readonly [A, B]
  : readonly [A, B[number]];

export const tupleOf = <A, B extends unknown[]>(fst: A, ...snd: TupleExtractParameter<B>): TupleReturnType<A, B> => {
  if (snd.length === 0) {
    //@ts-ignore
    return (snd) => [fst, snd] as const as TupleReturnType<A, B>;
  } else if (snd.length === 1) {
    const p = [fst, snd[0]] as const as TupleReturnType<A, B>;
    return p;
  } else {
    return undefined as any;
  }
};
