import type { Connectable, NoteBlockModel } from '@linvo/linvo-model';
import type { GfxModel } from '@linvo/std/gfx';
import type { BlockModel } from '@linvo/store';

export function isConnectable(
  element: GfxModel | null
): element is Connectable {
  return !!element && element.connectable;
}

export function isNoteBlock(
  element: BlockModel | GfxModel | null
): element is NoteBlockModel {
  return !!element && 'flavour' in element && element.flavour === 'linvo:note';
}
