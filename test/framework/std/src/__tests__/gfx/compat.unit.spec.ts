import { describe, expect, test } from 'vitest';
import { PlainText } from '@linvo-core/store/reactive/text';

import {
  createElementDataMap,
  deserializeSurfaceValue,
  ElementDataMap,
  serializeElementRecord,
  serializeSurfaceValue,
  SURFACE_TEXT_UNIQ_IDENTIFIER,
  SURFACE_YMAP_UNIQ_IDENTIFIER,
} from '@linvo-core/std/gfx';

describe('surface compat', () => {
  test('serializeSurfaceValue should preserve nested local text and maps', () => {
    const nested = new ElementDataMap({
      child: true,
    });
    const value = {
      children: nested,
      text: new PlainText('hello'),
    };

    const serialized = serializeSurfaceValue(value) as Record<string, unknown>;
    const serializedText = serialized.text as Record<string, unknown>;
    const serializedChildren = serialized.children as Record<string, unknown>;

    expect(serializedText).toEqual({
      type: 'plain-text',
      text: 'hello',
    });
    expect(serializedChildren[SURFACE_YMAP_UNIQ_IDENTIFIER]).toBe(true);
    expect(serializedChildren.json).toEqual({
      child: true,
    });
  });

  test('deserializeSurfaceValue should rebuild PlainText and ElementDataMap', () => {
    const value = {
      children: {
        [SURFACE_YMAP_UNIQ_IDENTIFIER]: true,
        json: {
          child: {
            [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
            delta: [{ insert: 'nested' }],
          },
        },
      },
      text: {
        [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
        delta: [{ insert: 'hello' }],
      },
    };

    const deserialized = deserializeSurfaceValue(value) as Record<string, unknown>;
    const text = deserialized.text as PlainText;
    const children = deserialized.children as ElementDataMap;
    const childText = children.get('child') as PlainText;

    expect(text).toBeInstanceOf(PlainText);
    expect(text.toString()).toBe('hello');
    expect(children).toBeInstanceOf(ElementDataMap);
    expect(childText).toBeInstanceOf(PlainText);
    expect(childText.toString()).toBe('nested');
  });

  test('createElementDataMap and serializeElementRecord should round-trip element records', () => {
    const record = {
      children: {
        [SURFACE_YMAP_UNIQ_IDENTIFIER]: true,
        json: {
          a: {
            [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
            delta: [{ insert: 'node-a' }],
          },
        },
      },
      title: {
        [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
        delta: [{ insert: 'group-title' }],
      },
    };

    const map = createElementDataMap(record);
    const roundTripped = serializeElementRecord(map.toJSON());

    const title = map.get('title') as PlainText;
    const children = map.get('children') as ElementDataMap;

    expect(title.toString()).toBe('group-title');
    expect(children).toBeInstanceOf(ElementDataMap);
    expect(children.get('a')).toBeInstanceOf(PlainText);
    expect((children.get('a') as PlainText).toString()).toBe('node-a');
    expect(roundTripped).toEqual({
      children: {
        [SURFACE_YMAP_UNIQ_IDENTIFIER]: true,
        json: {
          a: {
            type: 'plain-text',
            text: 'node-a',
          },
        },
      },
      title: {
        type: 'plain-text',
        text: 'group-title',
      },
    });
  });
});
