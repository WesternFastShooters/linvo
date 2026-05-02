import { describe, expect, test } from 'vitest';

import { ElementDataMap } from '@linvo-core/std/gfx';
import { PlainText } from '@linvo-core/store/reactive/text';

import { ConnectorElementModel } from '@linvo-core/content';
import { GroupElementModel } from '@linvo-core/content';
import { MindmapElementModel } from '@linvo-core/content';
import { ShapeElementModel } from '@linvo-core/content';
import { TextElementModel } from '@linvo-core/content';

describe('element runtime normalization', () => {
  test('shape and text propsToY should normalize string text to PlainText', () => {
    const shape = ShapeElementModel.propsToY({
      shapeType: 'rect',
      text: 'shape text',
    } as never);
    const text = TextElementModel.propsToY({
      text: 'plain text',
    });

    expect(shape.text).toBeInstanceOf(PlainText);
    expect(shape.text?.toString()).toBe('shape text');
    expect(text.text).toBeInstanceOf(PlainText);
    expect((text.text as PlainText).toString()).toBe('plain text');
  });

  test('connector propsToY should normalize label text to PlainText', () => {
    const connector = ConnectorElementModel.propsToY({
      text: 'label',
    } as never);

    expect(connector.text).toBeInstanceOf(PlainText);
    expect(connector.text?.toString()).toBe('label');
  });

  test('group propsToY should normalize title and children to local runtime types', () => {
    const group = GroupElementModel.propsToY({
      title: 'group title',
      children: {
        a: true,
        b: true,
      },
    });

    expect(group.title).toBeInstanceOf(PlainText);
    expect(group.title.toString()).toBe('group title');
    expect(group.children).toBeInstanceOf(ElementDataMap);
    expect(Array.from(group.children.keys())).toEqual(['a', 'b']);
    expect(group.children.get('a')).toBe(true);
  });

  test('mindmap propsToY should normalize serialized children records to ElementDataMap', () => {
    const mindmap = MindmapElementModel.propsToY({
      children: {
        root: {
          index: 'a0',
        },
        child: {
          index: 'a1',
          parent: 'root',
          collapsed: true,
        },
      },
    });

    expect(mindmap.children).toBeInstanceOf(ElementDataMap);
    expect(mindmap.children.get('root')).toEqual({
      index: 'a0',
      parent: undefined,
    });
    expect(mindmap.children.get('child')).toEqual({
      index: 'a1',
      parent: 'root',
    });
  });

  test('mindmap propsToY should preserve existing ElementDataMap instances', () => {
    const children = new ElementDataMap({
      root: {
        index: 'a0',
      },
    });
    const normalized = MindmapElementModel.propsToY({
      children,
    });

    expect(normalized.children).toBe(children);
  });
});
