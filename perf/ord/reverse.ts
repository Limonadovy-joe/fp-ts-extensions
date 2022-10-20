import * as Benchmark from 'benchmark';
import { ord, number } from '../../src/index';

const suite = new Benchmark.Suite('Ord - reverse performance test');

export const reverse = <A>(O: ord.Ord<A>): ord.Ord<A> => ord.fromCompare((first, second) => O.compare(second, first));

const numberOrdReversedLib = reverse(number.ord);
const numberOrdReversedOwn = ord.reverse(number.ord);

suite
  .add('own - ord.reverse', () => {
    numberOrdReversedOwn.compare(1, 2);
  })
  .add('lib - ord.reverse', () => {
    numberOrdReversedLib.compare(1, 2);
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
