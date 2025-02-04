import { beforeEach, describe, expect, test, vi } from "vitest";
import { type LruKCache, createLruKCache } from "./lru-k";

describe("LruKCache", () => {
  let cache: LruKCache<string>;

  beforeEach(() => {
    cache = createLruKCache<string>(3, 2);
  });

  test("基本的なset/get操作", () => {
    cache.set("a", "apple");
    expect(cache.get("a")).toBe("apple");
    expect(cache.size()).toBe(1);
  });

  test("容量制限を超えた時のエビクション", () => {
    cache.set("a", "apple");
    cache.set("b", "banana");
    cache.set("c", "cherry");
    cache.set("d", "date"); // エビクション発生

    expect(cache.size()).toBe(3);
    expect(cache.get("a")).toBeUndefined();
  });

  test("K回未満のアクセスではLRUを使用", () => {
    vi.useFakeTimers();
    const now = Date.now();

    // 最初の3エントリを異なる時間で挿入
    vi.setSystemTime(now);
    cache.set("a", "apple");

    vi.setSystemTime(now + 100);
    cache.set("b", "banana");

    vi.setSystemTime(now + 200);
    cache.set("c", "cherry");

    // aを新しい時間でアクセス（LRU更新）
    vi.setSystemTime(now + 300);
    cache.get("a"); // アクセス回数2 → Complete Groupへ

    vi.setSystemTime(now + 400);
    cache.set("d", "date"); // エビクション発生

    expect(cache.get("b")).toBeUndefined(); // 最も古いアクセス
    expect(cache.get("d")).toBe("date");

    vi.useRealTimers();
  });
});
