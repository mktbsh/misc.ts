import { describe, it, expect } from "vitest";
import { toReadableStream } from "./toReadableStream";

describe("toReadableStream", () => {
  it("should throw TypeError for null, undefined, or symbol", async () => {
    expect(() => toReadableStream(null)).toThrow(TypeError);
    expect(() => toReadableStream(undefined)).toThrow(TypeError);
    expect(() => toReadableStream(Symbol("test"))).toThrow(TypeError);
  });

  it("should convert Blob to ReadableStream", async () => {
    const blob = new Blob(["test"]);
    const stream = toReadableStream(blob);
    expect(stream).toBeInstanceOf(ReadableStream);
    const reader = stream.getReader();
    const { value } = await reader.read();
    expect(new TextDecoder().decode(value)).toBe("test");
  });

  it("should convert Uint8Array to ReadableStream", async () => {
    const uint8Array = new TextEncoder().encode("test");
    const stream = toReadableStream(uint8Array);
    expect(stream).toBeInstanceOf(ReadableStream);
    const reader = stream.getReader();
    const { value } = await reader.read();
    expect(new TextDecoder().decode(value)).toBe("test");
  });

  it("should convert ArrayBuffer to ReadableStream", async () => {
    const arrayBuffer = new TextEncoder().encode("test").buffer;
    const stream = toReadableStream(arrayBuffer);
    expect(stream).toBeInstanceOf(ReadableStream);
    const reader = stream.getReader();
    const { value } = await reader.read();
    expect(new TextDecoder().decode(value)).toBe("test");
  });

  it("should convert other types to ReadableStream", async () => {
    const stream = toReadableStream("test");
    expect(stream).toBeInstanceOf(ReadableStream);
    const reader = stream.getReader();
    const { value } = await reader.read();
    expect(value).toBe("test");
  });
});
