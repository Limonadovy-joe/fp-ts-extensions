import { Eq } from './Eq';

/**
 * @category instancies
 */
export const eq: Eq<number> = {
  equals: (x, y) => x === y
};
