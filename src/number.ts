import { Eq } from './Eq';
import { Ord } from './Ord';
import { Magma } from './Magma';
import { Semigroup } from './Semigroup';

/**
 * @category instancies
 */
export const eq: Eq<number> = {
  equals: (x, y) => x === y
};

/**
 * @category instancies
 */
export const MagmaSub: Magma<number> = {
  concate: (fst, snd) => fst - snd
};

/**
 * @category instancies
 */
export const SemigroupSum: Semigroup<number> = {
  concate: (fst, snd) => fst + snd
};

/**
 * @category instancies
 */
export const SemigroupProduct: Semigroup<number> = {
  concate: (fst, snd) => fst * snd
};

/**
 * @category instancies
 */
export const ord: Ord<number> = {
  equals: eq.equals,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
};
