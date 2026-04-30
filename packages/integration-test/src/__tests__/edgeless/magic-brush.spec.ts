import type { EdgelessRootBlockComponent } from '@linvo/linvo/blocks/root';
import type { ConnectorElementModel, ShapeElementModel } from '@linvo/linvo/model';
import { MagicBrushTool } from '@linvo/linvo/gfx/brush';
import { beforeEach, describe, expect, test } from 'vitest';

import {
  pointerdown,
  pointermove,
  pointerup,
  wait,
} from '../utils/common.js';
import { getDocRootBlock } from '../utils/edgeless.js';
import { setupEditor } from '../utils/setup.js';

function drawStroke(target: HTMLElement, points: { x: number; y: number }[]) {
  pointerdown(target, points[0]);
  for (const point of points) {
    pointermove(target, point);
  }
  pointerup(target, points[points.length - 1]);
}

describe('magic brush', () => {
  let edgeless!: EdgelessRootBlockComponent;
  let service!: EdgelessRootBlockComponent['service'];
  let center!: { x: number; y: number };

  beforeEach(async () => {
    const cleanup = await setupEditor('edgeless');

    edgeless = getDocRootBlock(doc, editor, 'edgeless');
    service = edgeless.service;

    service.viewport.setViewport(1, [
      service.viewport.width / 2,
      service.viewport.height / 2,
    ]);
    await wait();

    center = {
      x: service.viewport.width / 2,
      y: service.viewport.height / 2,
    };

    edgeless.gfx.tool.setTool(MagicBrushTool);

    return cleanup;
  });

  test('converts a rectangle gesture into a shape', async () => {
    drawStroke(edgeless.host, [
      { x: center.x - 80, y: center.y - 50 },
      { x: center.x + 80, y: center.y - 50 },
      { x: center.x + 80, y: center.y + 50 },
      { x: center.x - 80, y: center.y + 50 },
      { x: center.x - 80, y: center.y - 50 },
    ]);

    await wait(650);

    const shapes = service.crud.getElementsByType('shape') as ShapeElementModel[];
    const temporaryHighlighters = service.crud.getElementsByType('highlighter');

    expect(temporaryHighlighters).toHaveLength(0);
    expect(shapes).toHaveLength(1);
    expect(shapes[0].shapeType).toBe('rect');
  });

  test('supports multi-stroke right arrows', async () => {
    drawStroke(edgeless.host, [
      { x: center.x - 90, y: center.y },
      { x: center.x + 80, y: center.y },
    ]);
    await wait(120);
    drawStroke(edgeless.host, [
      { x: center.x + 20, y: center.y - 40 },
      { x: center.x + 80, y: center.y },
      { x: center.x + 20, y: center.y + 40 },
    ]);

    await wait(650);

    const connectors = service.crud.getElementsByType(
      'connector'
    ) as ConnectorElementModel[];

    expect(service.crud.getElementsByType('highlighter')).toHaveLength(0);
    expect(connectors).toHaveLength(1);
    expect(connectors[0].source.position?.[0]).toBeLessThan(
      connectors[0].target.position?.[0] ?? 0
    );
  });

  test('removes temporary trails when recognition fails', async () => {
    drawStroke(edgeless.host, [
      { x: center.x - 70, y: center.y - 20 },
      { x: center.x - 30, y: center.y + 40 },
      { x: center.x + 10, y: center.y - 10 },
      { x: center.x + 50, y: center.y + 55 },
      { x: center.x + 90, y: center.y - 15 },
    ]);

    await wait(650);

    expect(service.crud.getElementsByType('highlighter')).toHaveLength(0);
    expect(service.crud.getElementsByType('shape')).toHaveLength(0);
    expect(service.crud.getElementsByType('connector')).toHaveLength(0);
  });
});
