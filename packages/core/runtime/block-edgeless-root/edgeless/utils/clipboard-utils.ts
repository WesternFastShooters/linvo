import { isFrameBlock } from '@linvo-primitives/frame';
import { getSurfaceComponent } from '@linvo-core/block-surface';
import type {
  EmbedSyncedDocModel,
  FrameBlockModel,
  ImageBlockModel,
  ShapeElementModel,
} from '@linvo-core/content';
import { getElementsWithoutGroup } from '@linvo-core/shared/utils';
import { getCommonBoundWithRotation } from '@linvo-core/global/gfx';
import type { BlockComponent } from '@linvo-core/std';
import { GfxControllerIdentifier, type GfxModel } from '@linvo-core/std/gfx';
import groupBy from 'lodash-es/groupBy';

import { createElementsFromClipboardDataCommand } from '../clipboard/command';
import { getSortedCloneElements, prepareCloneData } from './clone-utils';
import {
  isEmbedSyncedDocBlock,
  isImageBlock,
} from './query';

const offset = 10;
export async function duplicate(
  edgeless: BlockComponent,
  elements: GfxModel[],
  select = true
) {
  const gfx = edgeless.std.get(GfxControllerIdentifier);

  const surface = getSurfaceComponent(edgeless.std);
  if (!surface) return;

  const copyElements = getSortedCloneElements(elements);
  const totalBound = getCommonBoundWithRotation(copyElements);
  totalBound.x += totalBound.w + offset;

  const snapshot = prepareCloneData(copyElements, edgeless.std);
  const [_, { createdElementsPromise }] = edgeless.std.command.exec(
    createElementsFromClipboardDataCommand,
    {
      elementsRawData: snapshot,
      pasteCenter: totalBound.center,
    }
  );
  if (!createdElementsPromise) return;
  const { canvasElements, blockModels } = await createdElementsPromise;

  const newElements = [...canvasElements, ...blockModels];

  surface.fitToViewport(totalBound);

  if (select) {
    gfx.selection.set({
      elements: newElements.map(e => e.id),
      editing: false,
    });
  }
}
export const splitElements = (elements: GfxModel[]) => {
  const { frames, shapes, images, embedSyncedDocs } =
    groupBy(getElementsWithoutGroup(elements), element => {
      if (isFrameBlock(element)) {
        return 'frames';
      } else if (isImageBlock(element)) {
        return 'images';
      } else if (isEmbedSyncedDocBlock(element)) {
        return 'embedSyncedDocs';
      }
      return 'shapes';
    }) as {
      shapes: ShapeElementModel[];
      frames: FrameBlockModel[];
      images: ImageBlockModel[];
      embedSyncedDocs: EmbedSyncedDocModel[];
    };

  return {
    shapes: shapes ?? [],
    frames: frames ?? [],
    images: images ?? [],
    embedSyncedDocs: embedSyncedDocs ?? [],
  };
};
