import { afterEach, describe, expect, it, vi } from "vitest";
import { sleep } from "./sleep";

/**
 * Test suite for the sleep utility function
 */
describe("sleep", () => {
  /**
   * Tests that sleep resolves after the specified time
   */
  it("should wait for the specified time", async () => {
    const startTime = Date.now();
    const waitTime = 100;

    vi.useFakeTimers();
    const sleepPromise = sleep(waitTime);
    vi.advanceTimersByTime(waitTime);
    await sleepPromise;

    expect(vi.getTimerCount()).toBe(0);
  });

  /**
   * Tests that sleep rejects for negative time values
   */
  it("should work with zero milliseconds", async () => {
    vi.useFakeTimers();
    const sleepPromise = sleep(0);
    vi.advanceTimersByTime(0);
    await sleepPromise;

    expect(vi.getTimerCount()).toBe(0);
  });

  /**
   * Tests multiple consecutive sleep calls
   */
  it("should handle multiple consecutive calls", async () => {
    vi.useFakeTimers();

    const sleep1 = sleep(100);
    const sleep2 = sleep(200);

    vi.advanceTimersByTime(100);
    await sleep1;

    vi.advanceTimersByTime(200);
    await sleep2;

    expect(vi.getTimerCount()).toBe(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
