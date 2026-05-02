import { describe, expect, test, vi } from 'vitest';

import { BoundPlainText, ObservableRecordMap } from '@linvo-core/store/reactive/text';

describe('BoundPlainText', () => {
  test('supports local editing operations and observer notifications', () => {
    const applied = vi.fn();
    const text = new BoundPlainText('hello', applied);
    const observer = vi.fn();

    text.observe(observer);
    text.insert(5, ' world');
    text.delete(0, 1);

    expect(text.toString()).toBe('ello world');
    expect(text.toDelta()).toEqual([{ insert: 'ello world' }]);
    expect(applied).toHaveBeenLastCalledWith('ello world', true);
    expect(observer).toHaveBeenCalledTimes(2);
  });

  test('supports external sync without reapplying mutation callback', () => {
    const applied = vi.fn();
    const text = new BoundPlainText('hello', applied);

    text.sync('remote', false);

    expect(text.toString()).toBe('remote');
    expect(applied).not.toHaveBeenCalled();
  });
});

describe('ObservableRecordMap', () => {
  test('supports add update delete with observer events', () => {
    const applied = vi.fn();
    const map = new ObservableRecordMap<{ value: number }>({}, applied);
    const observer = vi.fn();

    map.observe(observer);
    map.set('a', { value: 1 });
    map.set('a', { value: 2 });
    map.delete('a');

    expect(map.toJSON()).toEqual({});
    expect(applied).toHaveBeenCalledTimes(3);
    expect(observer).toHaveBeenCalledTimes(3);
    expect(observer.mock.calls[0][0].changes.keys.get('a')).toMatchObject({
      action: 'add',
    });
    expect(observer.mock.calls[1][0].changes.keys.get('a')).toMatchObject({
      action: 'update',
      oldValue: { value: 1 },
    });
    expect(observer.mock.calls[2][0].changes.keys.get('a')).toMatchObject({
      action: 'delete',
      oldValue: { value: 2 },
    });
  });

  test('supports external sync and clear', () => {
    const map = new ObservableRecordMap({
      a: 1,
    });
    const observer = vi.fn();

    map.observe(observer);
    map.sync({ a: 2, b: 3 }, false);
    map.clear();

    expect(map.toJSON()).toEqual({});
    expect(observer).toHaveBeenCalledTimes(2);
    expect(observer.mock.calls[0][1]).toBe(false);
  });
});
