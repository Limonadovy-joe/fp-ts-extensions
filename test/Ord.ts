import { ord as Ord } from '../src/index';
import { Ordering } from '../src/Ordering';
import * as N from '../src/number';
import * as S from '../src/string';
import * as B from '../src/boolean';
import { flow } from '../src/function';
import { deepStrictEqual } from './util';

describe('Ord', () => {
  interface Person {
    name: string;
    age: number;
  }

  const personA: Person = { name: 'joe', age: 10 };
  const personC: Person = { ...personA, age: 11 };

  test('equalsDefault', () => {
    const personOrd = Ord.equalsDefault<Person>(({ age: ageA }, { age: ageB }) => N.ord.compare(ageA, ageB));

    deepStrictEqual(personOrd(personA, personA), true);
    deepStrictEqual(personOrd(personA, personC), false);
  });

  test('fromCompare', () => {
    const personOrd = Ord.fromCompare<Person>(({ age: ageA }, { age: ageB }) => N.ord.compare(ageA, ageB));

    deepStrictEqual(personOrd.equals(personA, personA), true);
    deepStrictEqual(personOrd.compare(personA, personA), 0);
    deepStrictEqual(personOrd.compare(personA, personC), -1);
  });

  test('min', () => {
    deepStrictEqual(Ord.min(N.ord)(222, 666), 222);
    deepStrictEqual(Ord.min(N.ord)(3, 2), 2);
  });

  test('max', () => {
    deepStrictEqual(Ord.max(N.ord)(222, 666), 666);
    deepStrictEqual(Ord.max(N.ord)(3, 2), 3);
  });

  test('tuple', () => {
    const tupleAOrd = Ord.tuple(S.ord, N.ord);
    const tupleBOrd = Ord.tuple(S.ord, N.ord, B.ord);

    deepStrictEqual(tupleAOrd.compare(['a', 1], ['b', 2]), -1);
    deepStrictEqual(tupleBOrd.compare(['a', 1, true], ['b', 2, true]), -1);
    deepStrictEqual(tupleBOrd.compare(['a', 2, true], ['b', 2, true]), -1);
    deepStrictEqual(tupleBOrd.compare(['b', 2, true], ['a', 2, true]), 1);
    deepStrictEqual(tupleBOrd.compare(['a', 2, true], ['a', 2, true]), 0);
    deepStrictEqual(tupleBOrd.compare(['a', 2, true], ['a', 2, false]), 1);
    deepStrictEqual(tupleBOrd.compare(['a', 3, true], ['b', 2, true]), 1);
    deepStrictEqual(tupleBOrd.compare(['a', 3, false], ['b', 2, true]), -1);
  });

  test('reverse', () => {
    const tupleAOrd = Ord.reverse(N.ord);

    deepStrictEqual(tupleAOrd.compare(10, 20), 1);
    deepStrictEqual(tupleAOrd.compare(20, 10), -1);
    deepStrictEqual(tupleAOrd.compare(20, 20), 0);
  });

  test('clamp', () => {
    const clampNumber = Ord.clamp(N.ord);

    deepStrictEqual(clampNumber(1, 10)(0), 1);
    deepStrictEqual(clampNumber(1, 10)(2), 2);
    deepStrictEqual(clampNumber(1, 10)(1), 1);
    deepStrictEqual(clampNumber(1, 10)(10), 10);
    deepStrictEqual(clampNumber(1, 10)(-10), 1);
    deepStrictEqual(clampNumber(1, 10)(20), 10);
  });

  test('lt - lower then', () => {
    const lt = Ord.lt(N.ord);

    deepStrictEqual(lt(1, 10), true);
    deepStrictEqual(lt(10, 1), false);
  });

  test('gt - greater then', () => {
    const gt = Ord.gt(N.ord);

    deepStrictEqual(gt(10, 1), true);
    deepStrictEqual(gt(1, 10), false);
  });

  test('leq - lower then equal', () => {
    const leq = Ord.leq(N.ord);

    deepStrictEqual(leq(0, 1), true);
    deepStrictEqual(leq(1, 1), true);
    deepStrictEqual(leq(2, 1), false);
  });

  test('geq - lower then equal', () => {
    const geq = Ord.geq(N.ord);

    deepStrictEqual(geq(0, 1), false);
    deepStrictEqual(geq(1, 1), true);
    deepStrictEqual(geq(2, 1), true);
  });

  test('between - ', () => {
    // const between3 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (val: A) => boolean) => {
    //   const geqO = Ord.geq(ord);
    //   const leqO = Ord.leq(ord);

    //   return (low, hig) => (val) => geqO(val, low) && leqO(val, hig);
    // };

    //  const between2 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (a: A) => boolean) => {
    //   const lt = Ord.lt(ord);
    //   const gt = Ord.gt(ord);

    //   return (low, hig) => (a) => lt(a, low) || gt(a, hig) ? false : true;
    // };

    const between1 = <A>(ord: Ord.Ord<A>): ((low: A, hig: A) => (a: A) => boolean) => {
      const min = Ord.min(ord);
      const max = Ord.max(ord);

      return (low, hig) => (a) => low === min(low, a) && hig === max(hig, a);
    };

    const between = between1(N.ord);

    deepStrictEqual(between(1, 10)(2), true);
    deepStrictEqual(between(1, 10)(10), true);
    deepStrictEqual(between(1, 10)(20), false);
    deepStrictEqual(between(1, 10)(1), true);
    deepStrictEqual(between(1, 10)(-10), false);
  });

  test('cotramap - min, max ', () => {
    const getPersonBy = <A, P extends Person>(map: (p: P) => A) => Ord.contramap(map);

    const byAge = getPersonBy((p) => p.age);
    const getYoungerPerson = Ord.min(byAge(N.ord));

    const getOlderPerson = flow(byAge, Ord.reverse, Ord.min)(N.ord);

    // const getOlderPerson1 = flow(byAge, ())(N.ord);
    // const getOlderPerson2 = pipe(byAge(N.ord), ())(N.ord);

    deepStrictEqual(getYoungerPerson(personA, personC), personA);
    deepStrictEqual(getOlderPerson({ name: 'joe', age: 25 }, { name: 'susan', age: 22 }), { name: 'joe', age: 25 });
    deepStrictEqual(getOlderPerson(personA, personC), personC);
  });

  test('Ord - Quiz - rock-paper-scissor ', () => {
    // Quiz
    // Question 1
    // Is it possible to define an Ord instance for the game Rock-Paper-Scissor
    // where move1 <= move2 if move2 beats move1?

    type ROCK = 'ROCK';
    type PAPER = 'PAPER';
    type SCISSOR = 'SCISSOR';

    type ROCKPAPERSCISSOR = ROCK | PAPER | SCISSOR;

    const rockPaperScissorOrdering: Record<ROCKPAPERSCISSOR, Record<ROCKPAPERSCISSOR, Ordering>> = {
      PAPER: {
        PAPER: 0,
        ROCK: 1,
        SCISSOR: -1
      },
      ROCK: {
        ROCK: 0,
        SCISSOR: 1,
        PAPER: -1
      },
      SCISSOR: {
        SCISSOR: 0,
        PAPER: 1,
        ROCK: -1
      }
    };

    const rockPaperScissorO: Ord.Ord<ROCKPAPERSCISSOR> = {
      equals: S.eq.equals,
      compare: (x, y) => rockPaperScissorOrdering[x][y]
    };

    deepStrictEqual(rockPaperScissorO.compare('ROCK', 'SCISSOR'), 1);
    deepStrictEqual(rockPaperScissorO.compare('ROCK', 'ROCK'), 0);
    deepStrictEqual(rockPaperScissorO.compare('SCISSOR', 'ROCK'), -1);
    deepStrictEqual(rockPaperScissorO.compare('PAPER', 'ROCK'), 1);
  });
});
