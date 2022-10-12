import { Eq } from './Eq';

/**
 * @category instancies
 */
export const eq: Eq<string> = {
  equals: (x, y) => x === y
};
