import { describe, it, expect, vi } from "vitest";
import { retryAsync } from "./retryAsync";

describe("retryAsync", () => {
  it("should resolve immediately if the operation succeeds on the first try", async () => {
    const operation = vi.fn().mockResolvedValue("success");
    const result = await retryAsync(operation);
    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("should retry until success", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValue("success");

    const result = await retryAsync(operation, {
      maxAttempts: 3,
      initialInterval: 10,
    });
    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("should throw an error if max attempts are reached", async () => {
    const operation = vi.fn().mockRejectedValue(new Error("Always fail"));

    await expect(
      retryAsync(operation, { maxAttempts: 3, initialInterval: 10 }),
    ).rejects.toThrow("Always fail");
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("should respect the maxInterval option", async () => {
    vi.useFakeTimers();
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValue("success");

    const retryPromise = retryAsync(operation, {
      maxAttempts: 3,
      initialInterval: 100,
      maxInterval: 200,
      factor: 2,
    });

    // First attempt
    await vi.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt (after 100ms)
    await vi.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt (after 200ms, not 200ms because of maxInterval)
    await vi.advanceTimersByTimeAsync(200);
    expect(operation).toHaveBeenCalledTimes(3);

    await retryPromise;
    expect(await retryPromise).toBe("success");

    vi.useRealTimers();
  });
});
