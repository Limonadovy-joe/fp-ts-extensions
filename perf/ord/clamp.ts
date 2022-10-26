import * as Benchmark from 'benchmark';
import { ord as Ord, number } from '../../src/index';

const suite = new Benchmark.Suite('Ord - clamp performance test');

export const clamp = <A>(O: Ord.Ord<A>): ((low: A, hi: A) => (a: A) => A) => {
  const minO = Ord.min(O);
  const maxO = Ord.max(O);
  return (low, hi) => (a) => maxO(minO(a, hi), low);
};

const clamp1 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const min = Ord.min(ord);
  const max = Ord.max(ord);

  return (low, hig) => (val) => {
    const lowLimit = min(val, low);
    const highLimit = max(val, hig);

    return val === lowLimit ? low : val === highLimit ? hig : val;
  };
};

const clamp2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const isValueUnderLimit = Ord.lt(ord);
  const isValueOverLimit = Ord.gt(ord);

  return (low, hig) => (val) => {
    let res = val;

    if (isValueUnderLimit(val, low)) res = low;
    if (isValueOverLimit(val, hig)) res = hig;

    return res;
  };
};

const clamp3 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const isValueUnderLimit = Ord.lt(ord);
  const isValueOverLimit = Ord.gt(ord);

  // @ts-ignore
  return (low, hig) => (val) => {
    if (!isValueUnderLimit(val, low) && !isValueOverLimit(val, hig)) return val;
    if (isValueUnderLimit(val, low)) return low;
    if (isValueOverLimit(val, hig)) return hig;
  };
};

const clamp4 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => A) => {
  const hightLimit = Ord.min(ord);
  const lowLimit = Ord.max(ord);
  const isOverLimit = Ord.gt(ord);

  return (low, hig) => (val) => isOverLimit(val, hig) ? hightLimit(val, hig) : lowLimit(val, low);
};

const clampLib = clamp(number.ord);
const clampOwn1 = clamp1(number.ord);
const clampOwn2 = clamp2(number.ord);
const clampOwn3 = clamp3(number.ord);
const clampOwn4 = clamp4(number.ord);

suite
  .add('own implementation - ord.clamp - variant 1', () => {
    clampOwn1(1, 10)(15);
  })
  .add('own implementation - ord.clamp - variant 2', () => {
    clampOwn2(1, 10)(15);
  })
  .add('own implementation - ord.clamp - variant 3', () => {
    clampOwn3(1, 10)(15);
  })
  .add('own implementation - ord.clamp - variant 4', () => {
    clampOwn4(1, 10)(15);
  })
  .add('lib implementation - ord.clamp', () => {
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
