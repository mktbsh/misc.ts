export function throwError(message: string, options?: ErrorOptions): never;
export function throwError(error: Error): never;
export function throwError(
  messageOrError: string | Error,
  options?: ErrorOptions,
): never {
  if (messageOrError instanceof Error) throw messageOrError;
  throw new Error(messageOrError, options);
}
