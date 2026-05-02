import { describe, expect, test } from 'vitest';

import { PlainText } from '@linvo-core/store/reactive/text';

describe('PlainText', () => {
  test('supports insert delete replace and delta output', () => {
    const text = new PlainText('hello');

    text.insert(5, ' world');
    text.delete(5, 1);
    text.replace(5, 5, '-sdk');

    expect(text.toString()).toBe('hello-sdk');
    expect(text.toDelta()).toEqual([{ insert: 'hello-sdk' }]);
    expect(text.toJSON()).toEqual({
      text: 'hello-sdk',
      type: 'plain-text',
    });
  });

  test('notifies observers with local flag', () => {
    const text = new PlainText('a');
    const events: Array<{ local: boolean; text: string }> = [];

    const dispose = text.observe(event => {
      events.push(event);
    });

    text.set('b', false);
    dispose();
    text.set('c');

    expect(events).toEqual([{ local: false, text: 'b' }]);
  });
});
