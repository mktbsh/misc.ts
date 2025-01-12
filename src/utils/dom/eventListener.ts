export type CleanupFn = VoidFunction;

// biome-ignore lint/suspicious/noExplicitAny: allow any
type UnknownFn = (...args: any[]) => any;

/**
 * Infers the event type from an EventTarget-like object.
 */
type InferEventType<T> = T extends {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  addEventListener(type: infer P, ...args: any): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  addEventListener(type: infer P2, ...args: any): void;
}
  ? P & string
  : never;

/**
 * Infers the event object type based on the event target and event name.
 */
type InferEvent<
  T extends EventTarget,
  K extends string,
> = `on${K}` extends keyof T
  ? Parameters<Extract<T[`on${K}`], UnknownFn>>[0]
  : Event;

/**
 * Represents an object with a handleEvent method for event listening.
 */
interface ListenerObject<T extends Event> {
  handleEvent(this: ListenerObject<T>, event: T): void;
}

/**
 * Represents a listener function or object for a specific event target and event type.
 */
type Listener<T extends EventTarget, K extends string> =
  | ListenerObject<InferEvent<T, K>>
  | ((this: T, ev: InferEvent<T, K>) => void);

/**
 * Represents the binding configuration for an event listener.
 */
interface Binding<
  T extends EventTarget = EventTarget,
  K extends string = string,
> {
  type: K;
  listener: Listener<T, K>;
  options?: boolean | AddEventListenerOptions;
}

/**
 * Binds an event listener to a target and returns a cleanup function.
 * @param target The event target to bind the listener to.
 * @param binding The binding configuration.
 * @returns A cleanup function to remove the event listener.
 */
export function bind<
  T extends EventTarget,
  K extends InferEventType<T> | (string & {}),
>(target: T, { type, listener, options }: Binding<T, K>): CleanupFn {
  target.addEventListener(type, listener, options);

  return function cleanup() {
    target.removeEventListener(type, listener, options);
  };
}

/**
 * Binds multiple event listeners to a target and returns a cleanup function for all.
 * @param target The event target to bind the listeners to.
 * @param bindings An array of binding configurations.
 * @param sharedOptions Optional shared options for all bindings.
 * @returns A cleanup function to remove all event listeners.
 */
export function bindAll<
  T extends EventTarget,
  Types extends ReadonlyArray<InferEventType<T> | (string & {})>,
>(
  target: T,
  bindings: [
    ...{
      [K in keyof Types]: {
        type: Types[K];
        listener: Listener<T, Types[K] & string>;
        options?: boolean | AddEventListenerOptions;
      };
    },
  ],
  sharedOptions?: boolean | AddEventListenerOptions,
): CleanupFn {
  const unbinds: CleanupFn[] = bindings.map((original) =>
    bind(target, getBinding(original as never, sharedOptions)),
  );

  return function cleanupAll() {
    for (const fn of unbinds) {
      fn();
    }
  };
}

/**
 * Converts a boolean or AddEventListenerOptions to AddEventListenerOptions.
 * @param value The input value to convert.
 * @returns The converted AddEventListenerOptions or undefined.
 */
function toOptions(
  value?: boolean | AddEventListenerOptions,
): AddEventListenerOptions | undefined {
  if (typeof value === "undefined") return;
  if (typeof value === "boolean") {
    return {
      capture: value,
    };
  }

  return value;
}

/**
 * Merges the original binding with shared options.
 * @param original The original binding configuration.
 * @param sharedOptions The shared options to merge.
 * @returns The merged binding configuration.
 */
function getBinding(
  original: Binding,
  sharedOptions?: boolean | AddEventListenerOptions,
): Binding {
  if (sharedOptions == null) return original;

  return {
    ...original,
    options: {
      ...toOptions(sharedOptions),
      ...toOptions(original.options),
    },
  };
}
