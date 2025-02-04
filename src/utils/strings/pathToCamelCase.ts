export type CamelCase<S extends string> = S extends `${infer P1}/${infer P2}`
  ? `${Lowercase<P1>}${Capitalize<CamelCase<P2>>}`
  : Lowercase<S>;

export function pathToCamelCase<T extends string>(path: T): CamelCase<T> {
  const toLC = (v: string) => v.toLowerCase();
  const zero = 0;

  return path
    .split("/")
    .filter(Boolean)
    .map((part, i) => {
      return i === zero
        ? toLC(part)
        : part.charAt(zero).toUpperCase() + toLC(part.slice(1));
    })
    .join("") as CamelCase<T>;
}
