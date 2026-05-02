import { EdgelessClipboardConfig } from '@linvo-core/block-surface';
import { type BlockSnapshot } from '@linvo-core/store';

export class EdgelessClipboardImageConfig extends EdgelessClipboardConfig {
  static override readonly key = 'linvo:image';

  override async createBlock(image: BlockSnapshot) {
    const { xywh, rotate, sourceId, size, width, height, caption } =
      image.props;

    if (!this.surface) return null;

    if (!(await this.std.docSource.blobSync.get(sourceId as string))) {
      return null;
    }
    return this.crud.addBlock(
      'linvo:image',
      {
        caption,
        sourceId,
        xywh,
        rotate,
        size,
        width,
        height,
      },
      this.surface.model.id
    );
  }
}
