import { describe, it, expect } from "vitest";
import { loadImageAsync } from "./loadImageAsync";

describe("loadImageAsync", () => {
  it("should create an Image object with the given source", async () => {
    const source = "https://example.com/image.jpg";
    const image = await loadImageAsync(source);
    expect(image.src).toBe(source);
  });

  it("should return the Image object after successful decoding", async () => {
    const source = "https://example.com/image.jpg";
    const result = await loadImageAsync(source);

    expect(result).toBeInstanceOf(Image);
    expect(result.src).toBe(source);
  });
});
