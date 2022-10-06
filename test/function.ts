import { pipe, flow } from '../src/function';
import { deepStrictEqual } from './util';

describe('function', () => {
  const power = (base: number) => (exp: number) => base ** exp;
  const increment = (n: number) => n + 1;

  test('pipe', () => {
    const power2 = power(2);

    deepStrictEqual(pipe(0), 0);
    deepStrictEqual(pipe(0, power2), 1);
    deepStrictEqual(pipe(0, increment, power2), 2);
    deepStrictEqual(pipe(0, increment, increment, power2), 4);
    deepStrictEqual(
      pipe(
        0,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        increment,
        power2
      ),
      4096
    );
  });

  test('flow', () => {
    const doubleIncrement = flow(increment, increment);
    //  test functions where the fun has arity more than one
    const toStringWithAppend = (num: number, append = '') => `${num}${append}`;
    const toStringWithSeparatorAndAppend = (num: number, separator = '', append = '') => `${num}${separator}${append}`;

    deepStrictEqual(flow(doubleIncrement)(2), 4);
    deepStrictEqual(flow(doubleIncrement, doubleIncrement)(2), 6);
    deepStrictEqual(flow(toStringWithAppend)(1, '+'), '1+');
    deepStrictEqual(flow(toStringWithAppend, (str) => str.length >= 2)(1, '++'), true);
    deepStrictEqual(
      flow(
        toStringWithSeparatorAndAppend,
        (str) => str.length >= 3,
        (res) => (res ? 1 : 0)
      )(1, '-', '++'),
      1
    );
    // test maximum count of argument of flow
    deepStrictEqual(
      flow(
        toStringWithAppend,
        (str) => str.length >= 2,
        (res) => (res ? 1 : 0),
        increment,
        increment,
        increment,
        increment,
        increment,
        increment
      )(1, '++'),
      7
    );
  });
});
