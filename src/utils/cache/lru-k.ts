type LruKCacheKey = string | number | symbol;

export interface LruKCache<V = unknown> {
  get: (key: LruKCacheKey) => V | undefined;
  set: (key: LruKCacheKey, value: V) => void;
  size: () => number;
  clear: () => void;
}

export function createLruKCache<V = unknown>(
  capacity: number,
  k: number,
): LruKCache<V> {
  if (capacity <= 0 || k <= 0) {
    throw new Error("Capacity and K must be greater than 0");
  }

  // クロージャで保持する状態
  const cache = new Map<LruKCacheKey, V>();
  const accessHistory = new Map<LruKCacheKey, number[]>();
  const lastAccess = new Map<LruKCacheKey, number>();

  // ヘルパー関数
  const updateAccessHistory = (key: LruKCacheKey, timestamp: number) => {
    const history = accessHistory.get(key) || [];
    const newHistory = [...history, timestamp].slice(-k);
    accessHistory.set(key, newHistory);
  };

  const groupCandidates = () => {
    const complete: LruKCacheKey[] = [];
    const incomplete: LruKCacheKey[] = [];

    cache.forEach((_, key) => {
      const history = accessHistory.get(key) || [];
      history.length >= k ? complete.push(key) : incomplete.push(key);
    });

    return { complete, incomplete };
  };

  const evict = () => {
    const now = Date.now();
    const { complete, incomplete } = groupCandidates();

    let targetKey: LruKCacheKey | null = null;
    let oldestTimestamp = Number.POSITIVE_INFINITY;

    // Incomplete group処理
    for (const key of incomplete) {
      const last = lastAccess.get(key) ?? 0;
      if (last < oldestTimestamp) {
        oldestTimestamp = last;
        targetKey = key;
      }
    }

    // Complete group処理
    if (!targetKey) {
      let maxDistance = Number.NEGATIVE_INFINITY;
      for (const key of complete) {
        const history = accessHistory.get(key);
        if (!history || history.length < k) continue;

        const distance = now - history[0];
        if (distance > maxDistance) {
          maxDistance = distance;
          targetKey = key;
        }
      }
    }

    if (targetKey) {
      cache.delete(targetKey);
      accessHistory.delete(targetKey);
      lastAccess.delete(targetKey);
    }
  };

  // 公開API
  return {
    get: (key) => {
      if (!cache.has(key)) return undefined;

      const now = Date.now();
      updateAccessHistory(key, now);
      lastAccess.set(key, now);
      return cache.get(key);
    },

    set: (key, value) => {
      if (cache.has(key)) {
        cache.set(key, value);
        updateAccessHistory(key, Date.now());
        return;
      }

      if (cache.size >= capacity) {
        evict();
      }

      const now = Date.now();
      cache.set(key, value);
      accessHistory.set(key, [now]);
      lastAccess.set(key, now);
    },

    size: () => cache.size,
    clear: () => {
      cache.clear();
      accessHistory.clear();
      lastAccess.clear();
    },
  };
}
