/**
 * Abstractions for a mechanism to perform actions repetitively until successful
 */

export interface RetryStatus {
  readonly iterNumber: number;
  readonly previousDelay?: number;
}

export const startStatus: RetryStatus = {
  iterNumber: 0,
  previousDelay: undefined
};

/**
 * model
 */

export interface RetryPolicy {
  (status: RetryStatus): number | undefined;
}

/**
 * primitives
 */
export const constantDelay =
  (delay: number): RetryPolicy =>
  () =>
    delay;

export const limitRetries =
  (i: number): RetryPolicy =>
  (status) =>
    status.iterNumber >= i ? undefined : 0;

export const exponentialBackoff =
  (delay: number): RetryPolicy =>
  (status) =>
    delay * Math.pow(2, status.iterNumber);
