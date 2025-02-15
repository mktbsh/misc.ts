import { isError } from "./error/isError";

type Ok<T> = [T, null];
type Failure = [null, Error];

export async function tryAsync<T>(
  promise: Promise<T>,
): Promise<Ok<T> | Failure> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    if (isError(err)) return [null, err];

    throw err;
  }
}
