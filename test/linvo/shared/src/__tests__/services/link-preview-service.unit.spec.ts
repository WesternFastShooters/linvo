import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  LinkPreviewService,
  type LinkPreviewCacheProvider,
} from '@linvo-core/shared/services';

const createCache = (): LinkPreviewCacheProvider => {
  const cache = new Map<string, Record<string, unknown>>();
  const pendingRequests = new Map<string, Promise<Record<string, unknown>>>();

  return {
    get: url => cache.get(url),
    set: (url, data) => {
      cache.set(url, data);
    },
    getPendingRequest: url => pendingRequests.get(url),
    setPendingRequest: (url, promise) => {
      pendingRequests.set(url, promise);
    },
    deletePendingRequest: url => {
      pendingRequests.delete(url);
    },
    clear: () => {
      cache.clear();
      pendingRequests.clear();
    },
  };
};

describe('LinkPreviewService fallback behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns fallback metadata when the preview worker responds with an error', async () => {
    const cache = createCache();
    const service = new LinkPreviewService(cache);
    const url = 'https://www.baidu.com/s?wd=linvo';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'upstream failed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    await expect(service.query(url)).resolves.toEqual({
      title: 'baidu.com',
    });
    expect(cache.get(url)).toEqual({
      title: 'baidu.com',
    });
  });
});
