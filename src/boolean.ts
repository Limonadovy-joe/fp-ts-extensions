import { Eq } from './Eq';

/**
 * @category instancies
 */
export const eq: Eq<boolean> = {
  equals: (x, y) => x === y
};
