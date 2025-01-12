import { describe, it, expect } from "vitest";
import { reusable } from "./reusable";

describe("reusable", () => {
  it("should lazily initialize the value", () => {
    let initialized = false;
    const init = () => {
      initialized = true;
      return 42;
    };

    const instance = reusable(init);
    expect(initialized).toBe(false);
    expect(instance.value).toBe(42);
    expect(initialized).toBe(true);
  });

  it("should cache the value after initialization", () => {
    let callCount = 0;
    const init = () => {
      callCount++;
      return 42;
    };

    const instance = reusable(init);
    expect(callCount).toBe(0);
    expect(instance.value).toBe(42);
    expect(callCount).toBe(1);
    expect(instance.value).toBe(42);
    expect(callCount).toBe(1);
  });
});
