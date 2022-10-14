import { Eq } from './Eq';
import { Ord } from './Ord';
/**
 * @category instancies
 */
export const eq: Eq<string> = {
  equals: (x, y) => x === y
};

/**
 * @category instancies
 */
export const ord: Ord<string> = {
  equals: eq.equals,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
};
