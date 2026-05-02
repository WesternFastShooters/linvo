import { describe, expect, test } from 'vitest';

import { LocalStore } from '@linvo-core/store/compat';

describe('LocalStore', () => {
  test('tracks undo redo through recorded mutations', () => {
    const store = new LocalStore();
    let value = 0;

    store.transact(() => {
      const before = value;
      value = 1;
      store.recordMutation({
        redo: () => {
          value = 1;
        },
        undo: () => {
          value = before;
        },
      });
    });

    expect(value).toBe(1);
    expect(store.canUndo).toBe(true);
    expect(store.canRedo).toBe(false);

    store.undo();
    expect(value).toBe(0);
    expect(store.canRedo).toBe(true);

    store.redo();
    expect(value).toBe(1);
    expect(store.canUndo).toBe(true);
  });

  test('supports nested transactions without double history entries', () => {
    const store = new LocalStore();
    let value = 0;

    store.transact(() => {
      store.transact(() => {
        const before = value;
        value = 2;
        store.recordMutation({
          redo: () => {
            value = 2;
          },
          undo: () => {
            value = before;
          },
        });
      });
    });

    expect(store.history.stats.undoDepth).toBe(1);
    store.undo();
    expect(value).toBe(0);
  });
});
