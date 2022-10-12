import { Eq } from './Eq';
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
