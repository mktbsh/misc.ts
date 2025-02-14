import { throwError } from "./error/throwError";

export interface RetryOptions {
  /**
   * Initial waiting time (in milliseconds)
   * Specifies the waiting time before the first retry
   */
  initialInterval: number;

  /**
   * Maximum waiting time (in milliseconds)
   * Ensures that the waiting time between retries does not exceed this value
   */
  maxInterval: number;

  /**
   * Multiplication factor for increasing waiting time
   * Used to calculate the waiting time after each retry
   * Example: If 2, the waiting time doubles after each retry
   */
  factor: number;

  /**
   * Maximum number of retry attempts
   * Retries will stop and throw an error if this number is exceeded
   */
  maxAttempts: number;
}

const DEFAULT_INITIAL_INTERVAL = 1_000;
const DEFAULT_MAX_INTERVAL = 30_000;

/**
 * Retries an asynchronous function using exponential backoff
 * @param operation The asynchronous function to retry
 * @param options Retry options
 * @returns The result of the operation
 */
export async function retryAsync<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const {
    initialInterval = DEFAULT_INITIAL_INTERVAL,
    maxInterval = DEFAULT_MAX_INTERVAL,
    factor = 2,
    maxAttempts = 10,
  } = options;

  let attempts = 0;
  let interval = initialInterval;

  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      interval = Math.min(interval * factor, maxInterval);
    }
  }

  throwError("Max attempts reached");
}
