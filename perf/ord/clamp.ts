import * as Benchmark from 'benchmark';
import { ord, number } from '../../src/index';

const suite = new Benchmark.Suite('Ord - clamp performance test');

export const clamp = <A>(O: ord.Ord<A>): ((low: A, hi: A) => (a: A) => A) => {
  const minO = ord.min(O);
  const maxO = ord.max(O);
  return (low, hi) => (a) => maxO(minO(a, hi), low);
};

const clampLib = clamp(number.ord);
const clampOwn = ord.clamp(number.ord);

suite
  .add('own - ord.clamp', () => {
    clampOwn(1, 10)(15);
  })
  .add('lib - ord.clamp', () => {
    clampLib(1, 10)(15);
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
