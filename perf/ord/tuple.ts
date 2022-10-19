import * as Benchmark from 'benchmark';
import { ord, string, boolean, number } from '../../src/index';

const suite = new Benchmark.Suite('Ord - tuple performance test');

const tuple2 = <A extends ReadonlyArray<unknown>>(...ords: { [K in keyof A]: ord.Ord<A[K]> }): ord.Ord<Readonly<A>> =>
  ord.fromCompare((first, second) => {
    let i = 0;
    for (; i < ords.length - 1; i++) {
      const r = ords[i].compare(first[i], second[i]);
      if (r !== 0) {
        return r;
      }
    }
    return ords[i].compare(first[i], second[i]);
  });

const tupleSecond = tuple2(
  string.ord,
  number.ord,
  boolean.ord,
  string.ord,
  number.ord,
  boolean.ord,
  string.ord,
  number.ord,
  boolean.ord
);

const tupleFirst = ord.tuple(
  string.ord,
  number.ord,
  boolean.ord,
  string.ord,
  number.ord,
  boolean.ord,
  string.ord,
  number.ord,
  boolean.ord
);

type GetOrdType<O> = O extends ord.Ord<infer R> ? R : never;

let values1: GetOrdType<typeof tupleFirst> = ['a', 1, true, 'a', 1, true, 'a', 1, true];
let values2: GetOrdType<typeof tupleFirst> = ['b', 2, true, 'b', 2, true, 'b', 2, true];

for (let i = 0; i < 5; i++) {
  values1 = [...values1];
  values2 = [...values2];
}

suite
  .add('own - ord.tuple', () => {
    tupleFirst.compare(values1, values2);
  })
  .add('lib - ord.tuple', () => {
    tupleSecond.compare(values1, values2);
  })
  // @ts-ignore
  .on('cycle', ({ target }) => console.log(String(target)))
  // @ts-ignore
  .on('complete', (evt) => {
    const suite = evt.currentTarget;
    const fastestOption = suite.filter('fastest').map('name');
    // @ts-ignore
    console.log(`The fastest option is ${fastestOption}`);
  })
  .run({ async: true });
