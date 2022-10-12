/**
 * @category model
 */
export interface Magma<A> {
  readonly concate: (x: A, y: A) => A;
}
