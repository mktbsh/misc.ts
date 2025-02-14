import { describe, expect, it } from "vitest";
import { throwError } from "./throwError";

describe("throwError", () => {
  it("should throw Error with message when string is provided", () => {
    const message = "test error message";

    expect(() => throwError(message)).toThrow(Error);
    expect(() => throwError(message)).toThrow(message);
  });

  it("should throw Error with message and options when both are provided", () => {
    const message = "test error message";
    const options = { cause: "test cause" };

    try {
      throwError(message, options);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.cause).toBe(options.cause);
    }
  });

  it("should throw the provided Error instance directly", () => {
    const error = new Error("test error");

    expect(() => throwError(error)).toThrow(error);
  });

  it("should preserve Error properties when throwing Error instance", () => {
    const originalError = new Error("test error");
    originalError.cause = "original cause";

    try {
      throwError(originalError);
    } catch (error) {
      expect(error).toBe(originalError);
      expect(error.message).toBe("test error");
      expect(error.cause).toBe("original cause");
    }
  });

  it("should throw TypeError with message", () => {
    const message = "type error message";
    const error = new TypeError(message);

    expect(() => throwError(error)).toThrow(TypeError);
    expect(() => throwError(error)).toThrow(message);
  });

  it("should handle Error with undefined cause", () => {
    const message = "test message";
    const options = { cause: undefined };

    try {
      throwError(message, options);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.cause).toBeUndefined();
    }
  });
});
