import { describe, expect, test } from 'vitest';

import {
  createClipboardSnapshot,
  pasteClipboardSnapshot,
} from '@linvo-core/block-root/edgeless/clipboard';
import {
  importLegacySurfaceSnapshot,
  LEGACY_SURFACE_TEXT_UNIQ_IDENTIFIER,
} from '@linvo-core/block-root/edgeless/clipboard';
import {
  OfflineGroupElementModel,
  LocalElementModel,
  LocalSurfaceModel,
  registerDefaultElementModels,
} from '@linvo-core/content';
import { PlainText } from '@linvo-core/store/reactive/text';

class ShapeElement extends LocalElementModel {
  get text() {
    return this.get('text') as PlainText | undefined;
  }
}

describe('LocalSurfaceModel', () => {
  test('adds updates deletes and restores elements via history', () => {
    const surface = new LocalSurfaceModel();
    surface.registerElementModel('shape', (nextSurface, state) => {
      return new ShapeElement(nextSurface, state);
    });

    const id = surface.addElement({
      fill: 'red',
      text: new PlainText('hello'),
      type: 'shape',
    });

    const added = surface.getElementById<ShapeElement>(id);
    expect(added?.text?.toString()).toBe('hello');

    surface.updateElement(id, {
      fill: 'blue',
    });

    expect(surface.getElementSnapshot(id)?.fill).toBe('blue');

    surface.undo();
    expect(surface.getElementSnapshot(id)?.fill).toBe('red');

    surface.redo();
    expect(surface.getElementSnapshot(id)?.fill).toBe('blue');

    surface.deleteElement(id);
    expect(surface.hasElementById(id)).toBe(false);

    surface.undo();
    expect(surface.hasElementById(id)).toBe(true);
    expect(surface.getElementById<ShapeElement>(id)?.text?.toString()).toBe(
      'hello'
    );
  });

  test('supports middleware reorder and snapshot import export', () => {
    const surface = new LocalSurfaceModel();
    surface.applyMiddlewares([
      context => {
        if (context.payload.props.type === 'shape') {
          context.payload.props.fill = 'green';
        }
      },
    ]);

    const first = surface.addElement({
      type: 'shape',
    });
    const second = surface.addElement({
      type: 'shape',
    });

    expect(surface.getElementSnapshot(first)?.fill).toBe('green');

    surface.reorderElement(second, {
      before: first,
    });

    expect(surface.elementIds).toEqual([second, first]);

    const snapshot = surface.exportSnapshot();
    const imported = new LocalSurfaceModel();
    imported.importSnapshot(snapshot);

    expect(imported.elementIds).toEqual([second, first]);
    expect(imported.getElementSnapshot(first)?.fill).toBe('green');
  });

  test('supports default group elements clipboard and legacy import', () => {
    const surface = new LocalSurfaceModel();
    registerDefaultElementModels(surface);

    const groupId = surface.addElement({
      children: {},
      title: new PlainText('Group A'),
      type: 'group',
      xywh: '[0,0,100,100]',
    });
    const shapeId = surface.addElement({
      text: new PlainText('shape'),
      type: 'shape',
      xywh: '[0,0,100,100]',
    });

    const group = surface.getElementById<OfflineGroupElementModel>(groupId)!;
    group.addChild(shapeId);

    expect(group.childIds).toEqual([shapeId]);

    const clipboard = createClipboardSnapshot(surface, [groupId, shapeId]);
    const pasted = pasteClipboardSnapshot(surface, clipboard);

    expect(pasted.elementOrder).toHaveLength(2);
    expect(surface.size).toBe(4);

    const legacy = importLegacySurfaceSnapshot({
      elements: {
        old_1: {
          id: 'old_1',
          index: 'a0',
          seed: 1,
          text: {
            [LEGACY_SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
            delta: [{ insert: 'legacy' }],
          },
          type: 'text',
          xywh: '[0,0,100,20]',
        },
      },
    });

    expect(legacy.elementOrder).toEqual(['old_1']);
    expect((legacy.elements.old_1.text as { text: string }).text).toBe('legacy');
  });
});
