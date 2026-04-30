import { beforeEach, describe, expect, test } from 'vitest';

import {
  releaseSurfaceWebPreviewLease,
  requestSurfaceWebPreviewLease,
  resetSurfaceWebPreviewLeasesForTest,
} from '../../../blocks/embed/src/embed-iframe-block/surface-web-preview-state';

describe('surface web preview lease state', () => {
  beforeEach(() => {
    resetSurfaceWebPreviewLeasesForTest();
  });

  test('keeps existing leases when capacity is full and priority is unchanged', () => {
    expect(requestSurfaceWebPreviewLease('a', 1, 2)).toBe(true);
    expect(requestSurfaceWebPreviewLease('b', 1, 2)).toBe(true);
    expect(requestSurfaceWebPreviewLease('c', 1, 2)).toBe(false);
  });

  test('allows selected previews to preempt normal previews', () => {
    expect(requestSurfaceWebPreviewLease('a', 1, 1)).toBe(true);
    expect(requestSurfaceWebPreviewLease('b', 2, 1)).toBe(true);
    expect(requestSurfaceWebPreviewLease('a', 1, 1)).toBe(false);
    expect(requestSurfaceWebPreviewLease('b', 2, 1)).toBe(true);
  });

  test('releases capacity for the next preview', () => {
    expect(requestSurfaceWebPreviewLease('a', 1, 1)).toBe(true);
    releaseSurfaceWebPreviewLease('a');
    expect(requestSurfaceWebPreviewLease('b', 1, 1)).toBe(true);
  });
});
