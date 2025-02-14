import { describe, expect, it } from "vitest";
import { tryAsync } from "./tryAsync";

describe("tryAsync", () => {
  it("should return [data, null] when promise resolves", async () => {
    const promise = Promise.resolve("success");
    const [data, error] = await tryAsync(promise);

    expect(data).toBe("success");
    expect(error).toBeNull();
  });

  it("should return [null, Error] when promise rejects with Error", async () => {
    const error = new Error("test error");
    const promise = Promise.reject(error);
    const [data, catchedError] = await tryAsync(promise);

    expect(data).toBeNull();
    expect(catchedError).toBe(error);
  });

  it("should throw when promise rejects with non-Error value", async () => {
    const promise = Promise.reject("string error");

    await expect(tryAsync(promise)).rejects.toBe("string error");
  });

  it("should handle async operations correctly", async () => {
    const asyncOperation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "delayed success";
    };

    const [data, error] = await tryAsync(asyncOperation());

    expect(data).toBe("delayed success");
    expect(error).toBeNull();
  });

  it("should handle async errors correctly", async () => {
    const asyncOperation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      throw new Error("delayed error");
    };

    const [data, error] = await tryAsync(asyncOperation());

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("delayed error");
  });
});
