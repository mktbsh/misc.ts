import { describe, expect, it } from "vitest";
import { isError } from "./isError";

describe("isError", () => {
  it("should return true for Error instance", () => {
    expect(isError(new Error())).toBe(true);
  });

  it("should return true for custom Error classes", () => {
    class CustomError extends Error {}
    expect(isError(new CustomError())).toBe(true);
  });

  it("should return true for built-in Error subclasses", () => {
    expect(isError(new TypeError())).toBe(true);
    expect(isError(new ReferenceError())).toBe(true);
    expect(isError(new SyntaxError())).toBe(true);
  });

  it("should return false for non-Error values", () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError("error message")).toBe(false);
    expect(isError(123)).toBe(false);
    expect(isError({})).toBe(false);
    expect(isError([])).toBe(false);
    expect(isError(() => {})).toBe(false);
  });

  it("should return false for Error-like objects", () => {
    const errorLike = {
      name: "Error",
      message: "test",
      stack: "test stack",
    };
    expect(isError(errorLike)).toBe(false);
  });

  it("should work with try-catch blocks", () => {
    try {
      throw new Error("test error");
    } catch (e) {
      expect(isError(e)).toBe(true);
    }
  });
});
