import { eq } from '../src/index';
import { pipe } from '../src/function';
import * as N from '../src/number';
import * as S from '../src/string';
import * as B from '../src/boolean';
import { deepStrictEqual } from './util';

describe('Eq', () => {
  interface Person {
    name: string;
    age: number;
  }

  const personA: Person = { name: 'joe', age: 10 };
  const personB: Person = { name: 'susan', age: 10 };
  const personC: Person = { ...personA, age: 11 };

  test('fromEquals', () => {
    const personEq = eq.fromEquals<Person>(
      (personA, personB) => personA.name === personB.name && personA.age === personB.age
    );

    deepStrictEqual(personEq.equals(personA, personA), true);
    deepStrictEqual(personEq.equals(personA, personB), false);
  });

  test('struct', () => {
    const personEq = eq.struct<Person>({ name: { equals: (x, y) => x === y }, age: { equals: (x, y) => x === y } });

    deepStrictEqual(personEq.equals(personA, personA), true);
    deepStrictEqual(personEq.equals(personA, personB), false);
    deepStrictEqual(personEq.equals(personA, personC), false);
  });

  test('tuple', () => {
    const tuple = eq.tuple<[string, number, boolean]>(S.eq, N.eq, B.eq);

    const personAdult = { ...personA, isAdult: true };
    const personNonAdult: typeof personAdult = { ...personA, isAdult: false };

    deepStrictEqual(
      tuple.equals(
        [personAdult['name'], personAdult['age'], personAdult['isAdult']],
        [personAdult['name'], personAdult['age'], personAdult['isAdult']]
      ),
      true
    );
    deepStrictEqual(
      tuple.equals(
        [personAdult['name'], personAdult['age'], personAdult['isAdult']],
        [personNonAdult['name'], personNonAdult['age'], personNonAdult['isAdult']]
      ),
      false
    );
  });

  test('contramap', () => {
    const eqPersonByName = eq.contramap((p: Person) => p.name)(S.eq);
    const eqPersonByAge = pipe(
      N.eq,
      eq.contramap((p: Person) => p.age)
    );

    deepStrictEqual(eqPersonByName.equals(personA, personA), true);
    deepStrictEqual(eqPersonByName.equals(personA, personB), false);

    deepStrictEqual(eqPersonByAge.equals(personA, personA), true);
    deepStrictEqual(eqPersonByAge.equals(personA, personB), true);
    deepStrictEqual(eqPersonByAge.equals(personA, personC), false);
  });
});
