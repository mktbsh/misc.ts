export type StreamResource<T> = T extends Blob
  ? Uint8Array<ArrayBufferLike>
  : T extends Uint8Array | ArrayBuffer
    ? Uint8Array<ArrayBufferLike>
    : T extends undefined | null | symbol
      ? never
      : T;

const MSG_TYPE_ERROR =
  "Could not convert undefined, null, or symbol to ReadableStream";

export function toReadableStream<T>(
  value: T,
): ReadableStream<StreamResource<T>> {
  if (value == null || typeof value === "symbol") {
    throw new TypeError(MSG_TYPE_ERROR);
  }

  if (value instanceof Blob) {
    return <ReadableStream<StreamResource<T>>>value.stream();
  }

  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(value);
    return <ReadableStream<StreamResource<T>>>new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(uint8Array);
        controller.close();
      },
    });
  }

  return new ReadableStream<StreamResource<T>>({
    start(controller) {
      controller.enqueue(value as StreamResource<T>);
      controller.close();
    },
  });
}
