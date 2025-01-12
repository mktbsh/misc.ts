/**
 * A generic interface representing a reusable value.
 * The value is lazily initialized and cached after the first access.
 *
 * @template T - The type of the value.
 */
export interface Reusable<T> {
  value: T;
}

/**
 * Creates a reusable object that lazily initializes its value on first access.
 * The value is cached after initialization for subsequent accesses.
 *
 * @template T - The type of the value.
 * @param {() => T} init - A function that initializes and returns the value.
 * @returns {Reusable<T>} A reusable object containing the lazily initialized value.
 */
export function reusable<T>(init: () => T): Reusable<T> {
  return {
    get value() {
      const value = init();
      Object.defineProperty(this, "value", { value });
      return value;
    },
  };
}
